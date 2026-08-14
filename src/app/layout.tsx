import type { Metadata } from "next"
import localFont from "next/font/local"
import { Inter } from "next/font/google"
import "./globals.css"
import "./campcareer-brand.css"
import { LayoutShell } from "@/components/layout/layout-shell"
import { DEFAULT_LOCALE } from "@/lib/i18n/config"
import { LocaleProvider } from "@/lib/i18n/locale-provider"
import { LocaleInit } from "@/components/locale-init"
import { PageViewTracker } from "@/components/analytics/page-view-tracker"
import { AnalyticsConsent } from "@/components/analytics-consent"
import { ConsentGatedInsights } from "@/components/consent-gated-insights"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: {
    default: "CampCareer | Source-backed work and study routes",
    template: "%s | CampCareer",
  },
  description: "Build an overseas career with verified job demand, visa conditions, qualifications and actionable routes.",
  keywords: [
    "international career route", "work abroad", "study abroad", "visa conditions", "international job search",
    "working holiday visa", "overseas career",
  ],
  authors: [{ name: "CampCareer" }],
  creator: "CampCareer",
  metadataBase: new URL("https://www.campcareer.com"),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CampCareer",
    title: "CampCareer | 해외에서 일하는 경로를 찾다",
    description: "직업, 국가, 비자, 실행 경로를 한 번에 확인하세요.",
    images: [{ url: "/og-career-path.png", width: 1200, height: 630, alt: "CampCareer — 해외에서 일하는 내 커리어" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CampCareer | 해외에서 일하는 경로를 찾다",
    description: "직업, 국가, 비자, 실행 경로를 한 번에 확인하세요.",
    images: ["/og-career-path.png"],
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
    <html lang={DEFAULT_LOCALE} suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <LocaleProvider locale={DEFAULT_LOCALE}>
          <LocaleInit />
          <PageViewTracker />
          <LayoutShell>{children}</LayoutShell>
          <AnalyticsConsent />
        </LocaleProvider>
        <ConsentGatedInsights />
      </body>
    </html>
  )
}
