import Link from "next/link"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How CampCareer collects, stores, and protects your personal data, including account information and uploaded documents.",
  path: "/privacy",
})

const LAST_UPDATED = "10 June 2026"

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
              <strong>Profile and preference data</strong> — target country, field of study, and
              other answers you provide during onboarding to personalise the product.
            </li>
            <li>
              <strong>Saved content</strong> — courses, checklists, timelines, and career paths
              you save while using the product.
            </li>
            <li>
              <strong>Uploaded documents</strong> — files you choose to store in the Document
              Vault (for example passports, visas, or transcripts), together with metadata such
              as document type and expiry date. We never access the contents of your documents
              except to provide the storage and reminder features you request.
            </li>
            <li>
              <strong>Usage analytics</strong> — aggregated page-view and interaction data
              collected via Vercel Analytics to understand how the product is used. This data is
              not used to identify individual users.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">3. How we store and protect data</h2>
          <p>
            Your data is stored with our infrastructure providers (see section 4). Documents and
            personal records are stored in access-controlled storage protected by row-level
            security, so they are only readable by your authenticated account. Data is encrypted
            in transit (TLS) and at rest by our storage providers. We retain your data for as
            long as your account exists, or as required to provide the service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">4. Processors and sub-processors</h2>
          <p>We use the following service providers to operate CampCareer:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li><strong>Supabase</strong> — database, authentication, and file storage.</li>
            <li><strong>Vercel</strong> — application hosting and privacy-friendly analytics.</li>
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
            courses and uploaded documents at any time from within the product. To delete your
            entire account and all associated data, email{" "}
            <a href="mailto:contact@campcareer.com" className="text-blue-600 hover:underline">contact@campcareer.com</a>{" "}
            from your registered address; we will action verified requests within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">6. Cookies</h2>
          <p>
            We use strictly necessary cookies for authentication sessions, language preference,
            and interface state (such as sidebar collapse). We do not use third-party advertising
            cookies.
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
