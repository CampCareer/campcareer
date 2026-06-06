import { Metadata } from "next"
import { Press_Start_2P } from "next/font/google"
import { GameClient } from "./components/GameClient"

const pressStart = Press_Start_2P({
  weight:   "400",
  subsets:  ["latin"],
  variable: "--font-press-start",
  display:  "swap",
})

export const metadata: Metadata = {
  title:       "Vacant Dublin — 빈 땅에 집을 짓자",
  description: "더블린 방치된 빈 땅에 아파트를 건설해 주택 위기를 해결하세요.",
}

export default function VacantDublinPage() {
  return (
    <div className={`${pressStart.variable} h-[calc(100vh-56px)] w-full`}>
      <GameClient />
    </div>
  )
}
