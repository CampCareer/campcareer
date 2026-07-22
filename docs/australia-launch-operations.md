# Australia launch operations gate

This is the operating checklist for CampCareer’s Australia-only launch. It is
not permission to start selling a report: every commercial gate below must be
green for the exact product and scope being published.

## 1. Public conversion path

`Australia pathfinder → study comparison → report launch page → double-opt-in launch update → authenticated report workspace → checkout (only when released)`

The public report page at `/reports/australia` must always distinguish a
launch-update request from a purchase. It displays prices as catalogue context,
but must not offer a card-payment or expert-booking action while a product is
`contracted`.

## 2. Measurement contract

Measurement begins only after a visitor chooses **Allow measurement**. Event
properties must remain low-cardinality and must never contain email, free text,
or a saved-option title.

| Event | Meaning | Permitted properties |
| --- | --- | --- |
| `report_launch_view` | The public Australia report page was viewed | `surface`, `country`, `locale` |
| `report_launch_interest_started` | Visitor focused the launch-update form | `country` |
| `report_launch_interest_submitted` | A consented launch-update request was stored | `report_products` |
| `report_workspace_open` | Signed-in report preparation workspace opened | `surface`, `country`, `locale` |

Review weekly by UTM source/medium/campaign:

1. report-page visitors;
2. form starts;
3. confirmed launch updates;
4. saved personal-report workspaces; and
5. paid orders only after the product gate opens.

The first useful conversion is **confirmed** launch updates, not raw form
submissions. Unconfirmed records must not receive launch mail.

## 3. Required operational configuration

- `RESEND_API_KEY` and the `alerts@campcareer.com` sender must be verified.
- `NEXT_PUBLIC_SITE_URL` must point to the production domain so confirmation
  links are never local or relative.
- `CRON_SECRET` must be configured and the daily Vercel cron at
  `/api/internal/feedback-retention` must be healthy; it also clears expired or
  unsubscribed report-launch interests.
- Apply the report-personalisation and report-launch-interest migrations before
  enabling the related UI in production.
- Confirm that report launch emails, confirmation pages, unsubscribe pages,
  privacy policy, and terms work in Korean and English.

## 4. Product-release gate, per report scope

Before changing a product’s `salesStatus` to `available`, the release owner
must verify all of the following:

- every material input has a primary source, data-as-of date, verification
  date, confidence label, evidence kind, and methodology/assumptions;
- the exact field, city, university, or programme scope passes the readiness
  check — a national aggregate does not make a city or university report ready;
- the report template, Korean and English content, source citations, reviewer
  handoff, and delivery status work end to end;
- payment, tax display, refunds, delivery timing, customer support, and account
  deletion paths are published and tested;
- for Expert Review, expert credentials, availability, cancellation terms, and
  A$100 expert / A$49 CampCareer settlement handling are operationally ready.

## 5. Release-day smoke checks

- Test `/reports/australia` at 390px in English and Korean with no horizontal
  scrolling.
- Submit a disposable email only in the approved production test environment;
  confirm it, then unsubscribe it and verify the retention record is queued
  for deletion.
- Verify an anonymous visitor cannot reach `/reports/my-australia`, while a
  signed-in visitor can save only their own intake and options.
- Verify no product page exposes a payment or scheduling action when the
  readiness script reports the product scope as blocked.
- Check UTM attribution with a consented test session; the stored event must
  contain campaign fields but no email or free-text value.
