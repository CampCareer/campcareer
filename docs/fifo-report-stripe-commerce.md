# FIFO report Stripe server contract

Step 9 prepares the Stripe payment boundary without activating the public purchase button or placing live secrets in the repository.

## Checkout creation

`POST /api/fifo/report/checkout` accepts the validated checkout attempt from the report page. The server creates or reuses one `fifo_report_orders` row for the unique `checkout_attempt_id`, then creates a hosted Stripe Checkout Session using the configured FIFO report Price. The Stripe request uses the checkout attempt as its idempotency key and writes the CampCareer order ID, product ID and edition into both Checkout Session metadata and PaymentIntent metadata.

A retry with the same checkout attempt and identical purchase identity reuses the existing order and hosted Checkout URL. Reusing the attempt ID with different email, product, amount or marketing preference is rejected rather than silently changing the order.

The server contract expects `STRIPE_SECRET_KEY` and `STRIPE_FIFO_REPORT_PRICE_ID`, but neither is populated or activated in this step.

## Webhook verification

`POST /api/fifo/report/webhook` reads the raw request body before JSON parsing. It verifies Stripe's `Stripe-Signature` using the endpoint signing secret, SHA-256 HMAC, constant-time comparison and a five-minute timestamp tolerance. Invalid or stale signatures are rejected before any order state is touched.

The first event set is intentionally narrow:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

Only events carrying the FIFO report product metadata and the expected A$29 / AUD commercial terms can enter the order-state function.

## Idempotent payment state

`fifo_report_stripe_events.event_id` is unique. `apply_fifo_report_stripe_event` locks the target order, rechecks event duplication after the lock, rejects conflicting Stripe identifiers, ignores stale events and prevents a later retry of a failed/expired event from downgrading a paid order.

When payment becomes `paid`, the order records `purchased_at` and changes `delivery_status` from `not_ready` to `pending`. Step 9 intentionally stops there: it does not send an email, create a download URL or subscribe the buyer to marketing.

## Activation boundary

The purchase UI stays locked and production Supabase is unchanged during this step. The next connection step is where the production migrations, Stripe account values, webhook endpoint secret, FIFO report Price, private master PDF and transactional delivery path are connected and verified together.
