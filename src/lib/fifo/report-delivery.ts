import 'server-only'
import { sendEmail } from '@/lib/email/send'
import { supabaseAdmin } from '@/lib/supabase-admin'
import {
  FIFO_REPORT_STORAGE_BUCKET,
  FIFO_REPORT_STORAGE_OBJECT_PATH,
} from './report-order'

const SIGNED_URL_TTL_SECONDS = 24 * 60 * 60
const SIGNED_URL_REUSE_BUFFER_MS = 5 * 60 * 1000
const DELIVERY_RETRY_AFTER_SECONDS = 300
const DELIVERY_IDEMPOTENCY_PREFIX = 'fifo-report-delivery'

type ClaimResult = {
  claimed?: boolean
  reason?: string
}

type OrderForDelivery = {
  id: string
  email: string
  payment_status: string
  delivery_status: string
  delivery_signed_url: string | null
  delivery_link_expires_at: string | null
}

export type FifoReportDeliveryResult =
  | { ok: true; attempted: true; delivered: true }
  | { ok: true; attempted: false; delivered: true; reason: 'already_delivered' }
  | { ok: false; attempted: false; delivered: false; reason: string }

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
}

async function markDeliveryFailed(orderId: string, code: string) {
  const { error } = await supabaseAdmin.rpc('fail_fifo_report_delivery', {
    p_order_id: orderId,
    p_error_code: code,
  })
  if (error) {
    console.error('[fifo-report-delivery] failed to persist delivery failure', error.code)
  }
}

async function loadDeliveryOrder(orderId: string): Promise<OrderForDelivery> {
  const { data, error } = await supabaseAdmin
    .from('fifo_report_orders')
    .select([
      'id',
      'email',
      'payment_status',
      'delivery_status',
      'delivery_signed_url',
      'delivery_link_expires_at',
    ].join(','))
    .eq('id', orderId)
    .single()

  if (error || !data) throw new Error(`order_lookup_failed:${error?.code ?? 'missing'}`)
  return data as unknown as OrderForDelivery
}

function reusableSignedUrl(order: OrderForDelivery): { url: string; expiresAt: string } | null {
  if (!order.delivery_signed_url || !order.delivery_link_expires_at) return null
  const expiresAtMs = Date.parse(order.delivery_link_expires_at)
  if (!Number.isFinite(expiresAtMs)) return null
  if (expiresAtMs <= Date.now() + SIGNED_URL_REUSE_BUFFER_MS) return null
  return { url: order.delivery_signed_url, expiresAt: order.delivery_link_expires_at }
}

async function ensureSignedUrl(order: OrderForDelivery): Promise<{ url: string; expiresAt: string }> {
  const reusable = reusableSignedUrl(order)
  if (reusable) return reusable

  const { data, error } = await supabaseAdmin.storage
    .from(FIFO_REPORT_STORAGE_BUCKET)
    .createSignedUrl(FIFO_REPORT_STORAGE_OBJECT_PATH, SIGNED_URL_TTL_SECONDS)

  if (error || !data?.signedUrl) {
    throw new Error(`signed_url_failed:${error?.message ?? 'missing_url'}`)
  }

  const expiresAt = new Date(Date.now() + SIGNED_URL_TTL_SECONDS * 1000).toISOString()
  const { error: updateError } = await supabaseAdmin
    .from('fifo_report_orders')
    .update({
      delivery_signed_url: data.signedUrl,
      delivery_link_expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', order.id)
    .eq('payment_status', 'paid')

  if (updateError) throw new Error(`signed_url_state_failed:${updateError.code ?? 'unknown'}`)
  return { url: data.signedUrl, expiresAt }
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function deliveryEmailHtml(url: string, expiresAt: string): string {
  const safeUrl = escapeHtmlAttribute(url)
  const expiry = new Date(expiresAt).toUTCString()
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:640px;margin:0 auto">
      <h1 style="font-size:24px;margin:0 0 16px">Your FIFO Construction Fast Entry Guide is ready</h1>
      <p>Thanks for your purchase. Use the secure link below to download the CampCareer FIFO Construction Fast Entry Guide 2026.</p>
      <p style="margin:28px 0">
        <a href="${safeUrl}" style="display:inline-block;padding:12px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px">Download your guide</a>
      </p>
      <p style="font-size:14px;color:#4b5563">This private download link expires on ${expiry}.</p>
      <p style="font-size:14px;color:#4b5563">This email is part of your purchase and is separate from any optional marketing preference.</p>
    </div>
  `.trim()
}

export async function deliverPaidFifoReport(orderId: string): Promise<FifoReportDeliveryResult> {
  const { data: claimData, error: claimError } = await supabaseAdmin.rpc('claim_fifo_report_delivery', {
    p_order_id: orderId,
    p_retry_after_seconds: DELIVERY_RETRY_AFTER_SECONDS,
  })

  if (claimError) throw new Error(`delivery_claim_failed:${claimError.code ?? 'unknown'}`)
  const claim = asRecord(claimData) as ClaimResult

  if (claim.claimed !== true) {
    const reason = typeof claim.reason === 'string' ? claim.reason : 'not_claimed'
    if (reason === 'already_delivered') {
      return { ok: true, attempted: false, delivered: true, reason }
    }
    return { ok: false, attempted: false, delivered: false, reason }
  }

  let order: OrderForDelivery
  try {
    order = await loadDeliveryOrder(orderId)
    if (order.payment_status !== 'paid') throw new Error('order_not_paid')
  } catch (error) {
    await markDeliveryFailed(orderId, 'order_lookup_failed')
    throw error
  }

  let signed: { url: string; expiresAt: string }
  try {
    signed = await ensureSignedUrl(order)
  } catch (error) {
    await markDeliveryFailed(orderId, 'signed_url_failed')
    throw error
  }

  let providerMessageId = ''
  try {
    const sent = await sendEmail({
      to: order.email,
      subject: 'Your CampCareer FIFO Construction Fast Entry Guide 2026',
      html: deliveryEmailHtml(signed.url, signed.expiresAt),
      idempotencyKey: `${DELIVERY_IDEMPOTENCY_PREFIX}/${order.id}`,
    })
    providerMessageId = sent.id
  } catch (error) {
    await markDeliveryFailed(orderId, 'email_send_failed')
    throw error
  }

  const { data: completedData, error: completedError } = await supabaseAdmin.rpc(
    'complete_fifo_report_delivery',
    {
      p_order_id: orderId,
      p_provider_message_id: providerMessageId || null,
    },
  )

  if (completedError) {
    // Do not mark failed here: Resend may already have accepted the email. A
    // webhook retry reuses the stored signed URL and the same provider
    // idempotency key, then retries only the database completion step.
    throw new Error(`delivery_complete_failed:${completedError.code ?? 'unknown'}`)
  }

  const completed = asRecord(completedData)
  if (completed.completed !== true) {
    throw new Error(`delivery_complete_rejected:${String(completed.reason ?? 'unknown')}`)
  }

  return { ok: true, attempted: true, delivered: true }
}
