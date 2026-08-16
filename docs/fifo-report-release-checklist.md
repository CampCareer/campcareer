# FIFO Report Commerce Release Checklist

## Release scope

Product: FIFO Construction Fast Entry Guide 2026  
Price: A$29 AUD, one-time  
Edition: 1.0  
Region: Western Australia  
Pages: 23  
Data reviewed: 16 August 2026  
Master PDF: `CampCareer_FIFO_Construction_Fast_Entry_Guide_2026.pdf`

This checklist governs the final release gate for the paid FIFO guide. Until the final release stage is explicitly approved, the feature remains on `feature/fifo-report-commerce`, PR #253 remains draft, and Stripe remains in Test mode.

## Non-negotiable commerce controls

- [x] Stripe-verified webhook state is the payment source of truth.
- [x] `/fifo/report/success` is return UX only and never treats its URL as proof of payment.
- [x] The master PDF remains in the private `fifo-report-products` bucket.
- [x] Buyers receive only a short-lived private signed URL.
- [x] Duplicate Stripe events and delivery retries are idempotent.
- [x] Transactional delivery uses a stable provider idempotency key so retries do not send duplicate guide emails.
- [x] Purchase email is required for checkout/delivery and is separate from optional marketing consent.
- [x] Marketing consent is default-off and does not affect purchase eligibility.
- [x] Browser code does not receive Stripe secrets, webhook secrets, Supabase service-role credentials or Resend credentials.
- [x] Product price is configured server-side/at Stripe and is never trusted from browser input.
- [x] FIFO commerce analytics are consent-gated and limited to low-cardinality state. Email, checkout-attempt UUIDs, Stripe session IDs, order identifiers and other purchase PII are excluded.
- [x] Delivery observability uses fixed non-PII event/reason codes rather than provider error text or purchase identity.

## Controlled Preview readiness

- [x] Stripe Test product and A$29 AUD one-time Price are configured.
- [x] Preview webhook endpoint accepts the supported checkout/payment events and verified HTTP 200 transport has been demonstrated.
- [x] Supabase commerce and transactional-delivery migrations are applied.
- [x] Canonical Edition 1.0 PDF is present at the private object path.
- [x] A real Stripe Test purchase reached paid state, generated a private signed URL, sent one Resend transactional email and persisted `delivery_status=delivered` without a delivery error.
- [x] Checkout UI is active on `/fifo/report`; required email and optional default-off marketing consent are separate.
- [x] Cancel return, checkout failure and unverified success states are explicit and retry-safe.
- [x] Bare `/fifo/report/success` is `noindex,nofollow`, remains unverified and grants no PDF access.
- [x] P.4 report preview rendering is served from the repaired static JPEG asset.
- [x] Latest release-gate CI passes install, audit, typecheck, lint, unit tests, production build, Git-history secret scan and FIFO Playwright browser tests.
- [x] Browser gate covers checkout handoff, cancellation, checkout failure, bare-success protection, analytics consent, mobile overflow and keyboard navigation.
- [x] Latest feature-branch Preview deployment is READY and the sales page, success guard and P.4 asset have been rechecked.

## Production live-configuration gate

The following items stay intentionally incomplete until the final release stage. Do not place secret values in GitHub, PR comments or chat.

- [ ] Confirm/create the Stripe Live product and A$29 AUD one-time Price.
- [ ] Configure the production Stripe webhook for `/api/fifo/report/webhook` with the supported events.
- [ ] Set Production-scoped Vercel values for `STRIPE_FIFO_REPORT_PRICE_ID`, `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` directly in the provider dashboard.
- [ ] Confirm the existing Production-scoped Supabase/Resend server configuration is correct without exposing credentials.
- [ ] Deploy the approved release candidate and verify the production checkout redirects to Stripe Live with the canonical A$29 AUD product.
- [ ] If explicitly approved, perform one controlled live purchase and verify paid order state, one delivery email and a working short-lived private download URL.
- [ ] Verify duplicate/retry handling does not create a second delivery email.
- [ ] Verify production logs/analytics contain no purchase PII or secret material.
- [ ] Confirm rollback path before release: disable/rollback the commerce deployment if payment succeeds but durable delivery cannot be reconciled.
- [ ] Obtain explicit approval before merging PR #253 to `main` or releasing the live commerce flow.

## Release decision

Current status: ready for the final Production/live Stripe configuration gate, but not approved for Production activation or merge.
