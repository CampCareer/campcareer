import type { Metadata } from "next"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import localFont from "next/font/local"
import { Fraunces } from "next/font/google"
import "./globals.css"
import { LayoutShell } from "@/components/layout/layout-shell"
import { DEFAULT_LOCALE } from "@/lib/i18n/config"
import { LocaleProvider } from "@/lib/i18n/locale-provider"
import { LocaleInit } from "@/components/locale-init"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})
// Editorial serif display font for headings (body stays Geist).
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  display: "swap",
})

// TODO: Future programmatic SEO pages (do not implement now — plan only):
// - /countries/[country]                         — Country study guide: salary, visa, tuition, PR pathways
// - /fields/[field]                              — Field comparison across 5 countries
// - /rankings/[field]/[country]                  — Best universities by field and country
// - /compare/[field]/[country-a]-vs-[country-b]  — Side-by-side field + country comparison
// - /visa-pathways/[country]/[field]             — Visa and immigration pathway by country + field

export const metadata: Metadata = {
  title: {
    default: "CampCareer | Study Abroad & Immigration Decision Engine",
    template: "%s | CampCareer",
  },
  description: "Compare study-abroad options by tuition, salary, ROI, payback period, visa pathways, PR potential, and career outcomes across the US, UK, Ireland, Canada, and Australia. Estimated figures based on available public data — verify with official sources.",
  keywords: [
    "study abroad", "immigration decision", "ROI", "graduate salary",
    "Ireland tuition", "Australia student visa", "Canada PR", "UK graduate route",
    "university comparison", "work visa", "payback period", "study abroad planner",
  ],
  authors: [{ name: "CampCareer" }],
  creator: "CampCareer",
  metadataBase: new URL("https://www.campcareer.com"),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CampCareer",
    title: "CampCareer | Study Abroad & Immigration Decision Engine",
    description: "Compare study-abroad options by tuition, salary, ROI, payback period, visa pathways, PR potential, and career outcomes across the US, UK, Ireland, Canada, and Australia.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CampCareer — Study Abroad Decision Engine" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CampCareer | Study Abroad & Immigration Decision Engine",
    description: "Compare study-abroad options by tuition, salary, ROI, payback period, visa pathways, PR potential, and career outcomes across 5 countries.",
    images: ["/og-image.png"],
    creator: "@campcareer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}>
        <LocaleProvider locale={DEFAULT_LOCALE}>
          <LocaleInit />
          <LayoutShell>{children}</LayoutShell>
        </LocaleProvider>
        <Analytics />
        <SpeedInsights />
        {/* Google Analytics 4 (gtag.js) — measurement ID G-X2J1LGJL5D */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-X2J1LGJL5D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X2J1LGJL5D');
          `}
        </Script>
      </body>
    </html>
  )
}
