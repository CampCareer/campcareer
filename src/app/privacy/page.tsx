import Link from "next/link"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How CampCareer collects, stores, and protects account, saved-plan, consent, and product analytics data.",
  path: "/privacy",
})

const LAST_UPDATED = "11 July 2026"

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
              <strong>Usage analytics</strong> — page views, performance measurements, and
              allow-listed product events collected with Vercel Analytics and Speed Insights.
              Product events may include origin country, concept ID, destination, and engine/data
              versions, but never email addresses or free-text responses.
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
            are retained while your account remains active or until you request deletion.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">4. Processors and sub-processors</h2>
          <p>We use the following service providers to operate CampCareer:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li><strong>Supabase</strong> — database and authentication.</li>
            <li><strong>Vercel</strong> — application hosting and privacy-friendly analytics.</li>
            <li><strong>Resend</strong> — transactional messages and separately consented alerts.</li>
          </ul>
          <p className="mt-2">
            These providers process data on our behalf under their own data-processing agreements
            and security certifications.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">5. Your rights and deletion requests</h2>
          <p>
            Depending on where you live (including under the EU/UK GDPR), you may have the right
            to access, correct, export, or delete your personal data. You can delete saved
            saved content where the product provides a delete control. To delete your entire
            account and all associated data, email{" "}
            <a href="mailto:contact@campcareer.com" className="text-blue-600 hover:underline">contact@campcareer.com</a>{" "}
            from your registered address; we will action verified requests within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">6. Cookies</h2>
          <p>
            We use strictly necessary cookies for authentication sessions and interface state.
            Vercel&apos;s current analytics configuration is used without advertising or cross-site
            tracking cookies. We do not use Google Analytics or third-party advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">7. Changes to this policy</h2>
          <p>
            We may update this policy as the product evolves. Material changes will be announced
            on this page with an updated &quot;last updated&quot; date.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-200 text-sm">
        <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
      </div>
    </div>
  )
}
