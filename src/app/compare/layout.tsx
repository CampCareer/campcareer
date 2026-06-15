import { pageMetadata } from "@/lib/seo"
import { JsonLd, faqLd } from "@/components/seo/json-ld"

// Fallback metadata — each comparison deep-link overrides title/description/OG
// via generateMetadata in page.tsx.
export const metadata = pageMetadata({
  title: "Compare a Major Across Two Countries — Degree Risk",
  description: "Pick a major and two countries to compare employment, post-study visa, market demand, AI exposure, and study ROI side by side, with verified sources.",
  path: "/compare",
})

const COMPARE_FAQS = [
  {
    question: "How do you compare a major across two countries?",
    answer:
      "CampCareer scores each major on five layers — employment outcomes, post-study work visa, market demand, AI exposure, and study ROI — for the US, UK, Ireland, Canada, and Australia. Pick a major and two countries to see those layers lined up side by side, with the source and as-of date on every verified figure.",
  },
  {
    question: "Which country is 'better' for my major?",
    answer:
      "The comparison only flags a mechanical edge on the quantitative layers — higher graduate employment, higher market demand, or shorter ROI payback. Qualitative layers like visa pathway and AI exposure are shown without a winner, because the right choice depends on your goals, budget, and immigration plans.",
  },
  {
    question: "Where does the data come from?",
    answer:
      "Each layer carries its own source and last-verified date — official government and sector sources such as graduate outcomes surveys and skilled-occupation lists. Immigration timelines use verified post-study work visa lengths and PR pathways; estimates are labelled as estimates.",
  },
]

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={faqLd(COMPARE_FAQS)} />
      {children}
    </>
  )
}
