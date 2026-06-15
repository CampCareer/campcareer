import type { Locale } from '@/lib/i18n/config'
import { siteUrl } from './links'

// Minimal standalone HTML page for the confirm / unsubscribe result screens.
// Same restraint as the emails: white, one blue, serif heading. Returned as an
// HTML Response from the route handlers (no client JS needed).
const BLUE = '#2563EB'
const INK = '#0f172a'
const BODY = '#334155'
const SERIF = "Georgia, 'Times New Roman', serif"
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function flowPage(opts: {
  locale: Locale
  title: string
  heading: string
  body: string
  ctaHref?: string
  ctaLabel?: string
}): string {
  const cta =
    opts.ctaHref && opts.ctaLabel
      ? `<a href="${opts.ctaHref}" style="display:inline-block;margin-top:8px;padding:13px 24px;font-family:${SANS};font-size:14px;font-weight:600;color:#ffffff;background:${BLUE};text-decoration:none;border-radius:10px;">${esc(opts.ctaLabel)}</a>`
      : ''
  return `<!DOCTYPE html>
<html lang="${opts.locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;color:${INK};font-family:${SANS};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:64px 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">
        <tr><td style="padding-bottom:28px;">
          <a href="${siteUrl()}" style="font-family:${SERIF};font-size:20px;font-weight:600;color:${BLUE};text-decoration:none;letter-spacing:-0.01em;">CampCareer</a>
        </td></tr>
        <tr><td>
          <h1 style="margin:0 0 14px;font-family:${SERIF};font-size:26px;font-weight:600;line-height:1.3;color:${INK};">${esc(opts.heading)}</h1>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:${BODY};">${esc(opts.body)}</p>
          ${cta}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
