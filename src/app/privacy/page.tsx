import Link from "next/link"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How CampCareer collects, stores, and protects account, saved-plan, consent, and product analytics data.",
  path: "/privacy",
})

const LAST_UPDATED = "19 July 2026"

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-slate-900 tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-400 mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-8 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">1. Who we are</h2>
          <p>
            CampCareer (&quot;we&quot;, &quot;us&quot;) operates campcareer.com, a study-abroad and
            immigration decision platform. This policy explains what personal data we collect,
            why we collect it, and the choices you have. For any privacy question or request,
            contact us at <a href="mailto:contact@campcareer.com" className="text-blue-600 hover:underline">contact@campcareer.com</a>.
            CampCareer is the controller for the data described in this policy. Before we launch a
            paid partner programme in a new jurisdiction, we will publish the applicable legal
            entity and registered-address contact details here.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">2. Data we collect</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Account data</strong> — email address and authentication identifiers when
              you create an account or sign in.
            </li>
            <li>
              <strong>Decision inputs</strong> — origin country, study concept, budget, currency,
              and product priority used to calculate or save a decision plan.
            </li>
            <li>
              <strong>Saved plans</strong> — the recommendation snapshot, source and engine
              versions, and recalculation history you explicitly save.
            </li>
            <li>
              <strong>Consent records</strong> — separate records for saving a plan and for any
              optional policy or marketing alerts. Saving a plan does not subscribe you to marketing.
            </li>
            <li>
              <strong>Application-support requests</strong> — your name, account email, selected
              study option, destination, optional intake and budget, requested help, consent time,
              and request status when you ask to be connected with a verified school or agency.
              We do not share this request with a partner until you give the specific consent shown
              in that request form.
            </li>
            <li>
              <strong>Usage analytics</strong> — page views, performance measurements, and
              allow-listed product events collected with Vercel Analytics and Speed Insights.
              Product events may include origin country, concept ID, destination, and engine/data
              versions, but never email addresses or free-text responses.
            </li>
            <li>
              <strong>Feedback reports</strong> — the category and text you submit, plus an email
              address only if you opt in to follow-up. If you separately opt in, we may attach the
              page path, locale, time zone, browser user-agent, and viewport size to help reproduce
              a fault. Uploaded screenshots are stored privately and are not made public or shared
              with partners.
            </li>
            <li>
              <strong>Community contributions</strong> — the contribution type, page or topic,
              text, optional source link, moderation status and reviewer note when you submit a
              review, correction or source suggestion. Approved contributions create a private
              reputation ledger entry. We do not publish your identity or contribution in this
              first release.
            </li>
            <li>
              <strong>Programme completion and portfolio data</strong> — the private snapshot of
              planning records used when you complete a CampCareer programme, and the current
              careers, providers and courses shown in your private portfolio. This is not an
              academic, immigration or employment credential.
            </li>
            <li>
              <strong>Programme evidence links</strong> — programme labels, official source URLs
              and notes you save for your private Verify step. Saving a link does not mean that
              CampCareer, a provider or a regulator has approved it.
            </li>
            <li>
              <strong>Optional measurement and attribution</strong> — after you choose “Allow
              measurement”, we store a short-lived session identifier, first page path, and UTM
              campaign fields to measure product and partner-link performance. We do not create
              these attribution cookies when you choose “Essential only”.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">3. How we store and protect data</h2>
          <p>
            Personal records are stored with our infrastructure providers (see section 4).
            Saved decision plans are protected by owner-only row-level security and are only
            readable by the authenticated account that owns them. Data is encrypted in transit
            and at rest by our providers. Save-intent tokens expire after 24 hours. Saved plans
            are retained while your account remains active or until you request deletion. Feedback
            reports and private screenshots are retained for up to 180 days, unless a longer period
            is necessary to investigate abuse, security, or a legal claim. Optional attribution
            cookies expire after 30 days; measurement-consent choices expire after 180 days.
            Community contribution and reputation records are retained while your account remains
            active and are deleted with your account, unless retention is necessary for abuse,
            security, or a legal claim.
            Programme completion and private portfolio records are also retained while your account
            remains active and are deleted with your account.
            Programme evidence links are retained on the same basis and are deleted with your
            account.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">4. Processors and sub-processors</h2>
          <p>We use the following service providers to operate CampCareer:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li><strong>Supabase</strong> — database and authentication.</li>
            <li><strong>Supabase Storage</strong> — private feedback screenshots when you choose to upload one.</li>
            <li><strong>Vercel</strong> — application hosting and privacy-friendly analytics.</li>
            <li><strong>Resend</strong> — transactional messages and separately consented alerts.</li>
          </ul>
          <p className="mt-2">
            These providers process data on our behalf under their own data-processing agreements
            and security certifications.
          </p>
          <p className="mt-2">
            If you submit an application-support request, the verified school or agency assigned to
            that request becomes an independent recipient of the information you explicitly agreed
            to share. Sponsored placement never changes comparison or course ranking.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">5. Legal bases and international transfers</h2>
          <p>
            We process account and saved-plan data to provide the service you request; security,
            reliability, and limited product measurement under our legitimate interests where
            permitted; and optional feedback follow-up, partner sharing, alerts, and measurement
            where you give consent. Our providers may process data outside your country. Where
            required, we rely on the provider&apos;s applicable transfer safeguards and data-processing
            terms. Do not submit special-category personal data, passport numbers, passwords, or
            payment-card data in feedback.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">6. Your rights and deletion requests</h2>
          <p>
            Depending on where you live (including under the EU/UK GDPR), you may have the right
            to access, correct, export, or delete your personal data. You can manage your profile
            and delete saved content where the product provides a delete control. You can also
            permanently delete your account in <Link href="/settings" className="text-blue-600 hover:underline">Account settings</Link>.
            For an access, correction, or export request, email{" "}
            <a href="mailto:contact@campcareer.com" className="text-blue-600 hover:underline">contact@campcareer.com</a>{" "}
            from your registered address; we will action verified requests within 30 days. Limited
            feedback and security records may be retained for the periods described in section 3.
            Depending on your location, you may also have the right to complain to your local data
            protection authority.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">7. Cookies and measurement choices</h2>
          <p>
            We use strictly necessary cookies for authentication sessions and interface state.
            Optional product measurement and attribution begin only after you choose “Allow
            measurement” in the privacy control. Vercel&apos;s current analytics configuration is used
            without Google Analytics or third-party advertising cookies. Partner links may carry an
            affiliate identifier after you choose to open that partner&apos;s site; the partner&apos;s own
            privacy policy then applies.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">8. Children and changes to this policy</h2>
          <p>
            CampCareer is not designed for children under 16. We may update this policy as the
            product evolves. Material changes will be announced on this page with an updated
            &quot;last updated&quot; date.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-200 text-sm">
        <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
      </div>
    </div>
  )
}
