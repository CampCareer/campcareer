# FIFO report purchase-email boundary

The required purchase email exists to support checkout, the receipt, and secure guide delivery. It is not a marketing opt-in.

Before Stripe checkout is enabled, `/fifo/report` keeps a validated email plus an optional marketing preference in session storage only. No server-side lead record, marketing subscription, or email send happens from this form. The marketing checkbox is unchecked by default and must remain optional when the payment flow is connected.
