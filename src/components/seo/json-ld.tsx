// JSON-LD 구조화 데이터 — 서버 컴포넌트에서 사용.
// data는 schema.org 객체 그대로 전달 (@context 포함 권장).
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify 출력만 삽입되므로 XSS 표면 없음 (< 문자 이스케이프)
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}

const BASE = "https://www.campcareer.com"

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE}${item.path}`,
    })),
  }
}

export function faqLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }
}

export function itemListLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${BASE}${item.path}`,
    })),
  }
}

export function articleLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
  author,
  image,
}: {
  title: string
  description: string
  path: string
  datePublished: string
  dateModified?: string
  author?: string
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished,
    ...(dateModified && { dateModified }),
    mainEntityOfPage: `${BASE}${path}`,
    author: { "@type": "Organization", name: author ?? "CampCareer" },
    publisher: { "@type": "Organization", name: "CampCareer", url: BASE },
    ...(image && { image: image.startsWith("http") ? image : `${BASE}${image}` }),
  }
}
