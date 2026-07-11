import { pageMetadata } from "@/lib/seo"

export { /* @next-codemod-error `default` export is re-exported. Check if this component uses `params` or `searchParams`*/
default } from "@/app/fr/jobs/page"
export const revalidate = 86400
export const metadata = {
  ...pageMetadata({ title: "프랑스 채용 수요 직업군 | CampCareer", description: "France Travail BMO 2026 기반 프랑스 채용계획과 채용난이도 직업군을 확인하세요.", path: "/ko/fr/jobs" }),
  alternates: { canonical: "/ko/fr/jobs", languages: { "ko-KR": "/ko/fr/jobs", en: "/fr/jobs" } },
}
