import type { ReactNode } from "react"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"

const dashboardImage = (url: string) => url.replace(/\?.*$/, "?w=1600&h=700&fit=crop&auto=format")

type HomeDashboardBackgroundProps = {
  countryCode?: string
  children: ReactNode
}

export function HomeDashboardBackground({ countryCode, children }: HomeDashboardBackgroundProps) {
  const country = LAUNCH_COUNTRIES.find((item) => item.code === countryCode)

  if (!country) return <>{children}</>

  return (
    <div className="relative isolate overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-56 bg-cover bg-center sm:h-64"
        style={{ backgroundImage: `url(${dashboardImage(country.image)})` }}
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/45 via-black/20 to-white sm:h-64" />
      <div className="relative pt-20 sm:pt-28">
        <div className="mx-auto w-full max-w-6xl rounded-t-[28px] bg-white/95 shadow-[0_-18px_50px_-38px_rgba(27,27,27,0.8)] backdrop-blur-[2px]">
          {children}
        </div>
      </div>
    </div>
  )
}
