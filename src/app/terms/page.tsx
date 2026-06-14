import Link from "next/link"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms that govern your use of CampCareer, including the estimated nature of ROI, salary, and visa data.",
  path: "/terms",
})

const LAST_UPDATED = "10 June 2026"

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Terms of Service</h1>
      <p className="text-sm text-slate-400 mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-8 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="font-display text-lg font-extrabold text-slate-800 mb-2">1. Acceptance</h2>
          <p>
            By using campcareer.com (&quot;CampCareer&quot;, the &quot;Service&quot;) you agree to
            these terms. If you do not agree, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-extrabold text-slate-800 mb-2">2. Nature of the data — no advice</h2>
          <p>
            ROI scores, salary figures, tuition costs, tax estimates, payback periods, and visa or
            immigration information shown on CampCareer are <strong>estimates</strong> derived
            from public datasets (such as the U.S. College Scorecard, HEA, HESA, and CRICOS) and
            simplified models. They are provided for general information only and do not
            constitute financial, legal, tax, or immigration advice. Always verify critical
            figures and requirements with official sources before making decisions.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-extrabold text-slate-800 mb-2">3. Your account and content</h2>
          <p>
            You are responsible for keeping your account credentials secure and for the content
            you upload (including documents stored in the Document Vault). You retain ownership
            of your content; you grant us only the rights needed to store and display it back to
            you. You must not upload content that is unlawful or that you do not have the right
            to store.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-extrabold text-slate-800 mb-2">4. Acceptable use</h2>
          <p>
            You agree not to abuse the Service — including attempting to access other users&apos;
            data, scraping at volumes that degrade the Service, or interfering with its
            operation.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-extrabold text-slate-800 mb-2">5. Availability and changes</h2>
          <p>
            The Service is provided &quot;as is&quot; without warranties of any kind. We may
            modify, suspend, or discontinue features at any time. We may update these terms;
            continued use after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-extrabold text-slate-800 mb-2">6. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, CampCareer is not liable for decisions made in
            reliance on estimated data, or for indirect or consequential damages arising from use
            of the Service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-extrabold text-slate-800 mb-2">7. Contact</h2>
          <p>
            Questions about these terms:{" "}
            <a href="mailto:contact@campcareer.com" className="text-indigo-600 hover:underline">contact@campcareer.com</a>
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-200 text-sm">
        <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
      </div>
    </div>
  )
}
