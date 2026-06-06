import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vacant Dublin — 빈 땅에 집을 짓자",
  description: "더블린 방치된 빈 땅에 아파트를 건설해 주택 위기를 해결하세요.",
}

export default function VacantDublinPage() {
  return (
    <div className="h-[calc(100vh-56px)] w-full">
      <iframe
        src="/games/vacant-dublin.html"
        className="w-full h-full border-0"
        title="Vacant Dublin"
        allow="clipboard-write"
      />
    </div>
  )
}
