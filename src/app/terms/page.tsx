import Link from "next/link"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms that govern your use of CampCareer, including the estimated nature of ROI, salary, and visa data.",
  path: "/terms",
})

const LAST_UPDATED = "14 July 2026"

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-slate-900 tracking-tight mb-2">Terms of Service</h1>
      <p className="text-sm text-slate-400 mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-8 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">1. Acceptance</h2>
          <p>
            By using campcareer.com (&quot;CampCareer&quot;, the &quot;Service&quot;) you agree to
            these terms. If you do not agree, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">2. Nature of the data — no advice</h2>
          <p>
            ROI scores, salary figures, tuition costs, tax estimates, payback periods, and visa or
            immigration information shown on CampCareer are source-backed data, estimates, or
            unavailable fields as labelled in the product. They are provided for general information
            only and do not constitute financial, legal, tax, admissions, or immigration advice.
            We do not guarantee admission, employment, sponsorship, visa approval, permanent
            residence, income, or a particular outcome. Always verify critical figures and
            requirements with the official authority and provider before making decisions.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">3. Your account and content</h2>
          <p>
            You are responsible for keeping your account credentials secure and for the content
            you submit, including saved-plan inputs, support requests, and optional feedback
            screenshots. You retain ownership of your content; you grant us only the rights needed
            to store, review, secure, and operate the service. You must not submit content that is
            unlawful, confidential to another person, or that you do not have the right to share.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">4. Feedback and external links</h2>
          <p>
            Feedback helps us improve the service but does not create a support obligation or
            transfer ownership of our product. Do not include passwords, passport numbers, payment
            details, or sensitive personal information. Links to official sources, schools, jobs,
            or other third parties are provided for convenience; those sites control their own
            content, availability, and privacy practices.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">5. Partners, referrals, and affiliate links</h2>
          <p>
            CampCareer may show clearly labelled links to verified schools, agencies, insurers,
            money-transfer providers, communications providers, or accommodation services. A
            commercial relationship never changes the ranking or evidence shown in a comparison.
            We only share a support request with a partner after the specific consent shown in that
            request. Any agreement you enter with a partner is directly with that partner.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">6. Acceptable use</h2>
          <p>
            You agree not to abuse the Service — including attempting to access other users&apos;
            data, scraping at volumes that degrade the Service, or interfering with its
            operation.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">7. Availability and changes</h2>
          <p>
            The Service is provided &quot;as is&quot; without warranties of any kind. We may
            modify, suspend, or discontinue features at any time. We may update these terms;
            continued use after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">8. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, CampCareer is not liable for decisions made in
            reliance on estimated data, or for indirect or consequential damages arising from use
            of the Service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">9. Contact</h2>
          <p>
            Questions about these terms:{" "}
            <a href="mailto:contact@campcareer.com" className="text-blue-600 hover:underline">contact@campcareer.com</a>
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-200 text-sm">
        <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
      </div>
    </div>
  )
}
