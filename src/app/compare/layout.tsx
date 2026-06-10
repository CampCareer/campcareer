import { pageMetadata } from "@/lib/seo"
import { JsonLd, faqLd } from "@/components/seo/json-ld"

export const metadata = pageMetadata({
  title: "Country Compare — USA vs Ireland vs UK vs Canada vs Australia",
  description: "Side-by-side salary and ROI comparison across 5 countries. Find the best country for your career with real graduate earnings data.",
  path: "/compare",
})

const COMPARE_FAQS = [
  {
    question: "Which country has the best ROI for international students?",
    answer:
      "It depends on your field of study. CampCareer compares ROI scores — net salary after rent and living costs relative to total tuition — across the US, UK, Ireland, Canada, and Australia using government salary data, so you can see which country pays back your degree fastest for your specific field.",
  },
  {
    question: "How is the ROI score calculated?",
    answer:
      "ROI score = (net salary × graduation rate) ÷ total tuition for the degree, where net salary is median graduate earnings minus estimated annual rent and living costs in the college's city. Scores within one country are directly comparable; cross-country comparisons should account for currency and tax differences.",
  },
  {
    question: "Where does the salary data come from?",
    answer:
      "Official government sources: the U.S. College Scorecard, Ireland's HEA Graduate Outcomes Survey, the UK's HESA/Discover Uni, Australia's CRICOS and graduate outcome data, and Canadian provincial datasets.",
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
