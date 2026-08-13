import type { Metadata } from "next"
import { headers } from "next/headers"
import localFont from "next/font/local"
import "./globals.css"
import { LayoutShell } from "@/components/layout/layout-shell"
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config"
import { LocaleProvider } from "@/lib/i18n/locale-provider"
import { LocaleInit } from "@/components/locale-init"
import { PageViewTracker } from "@/components/analytics/page-view-tracker"
import { AnalyticsConsent } from "@/components/analytics-consent"
import { ConsentGatedInsights } from "@/components/consent-gated-insights"

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
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CampCareer",
    title: "CampCareer | Build your career abroad",
    description: "Source-backed job demand, qualification conditions and practical routes for working abroad.",
    images: [{ url: "/og-career-path.png", width: 1200, height: 630, alt: "CampCareer — Build your career abroad" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CampCareer | Build your career abroad",
    description: "Source-backed job demand, qualification conditions and practical routes for working abroad.",
    images: ["/og-career-path.png"],
    creator: "@campcareer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const routeLocale = requestHeaders.get("x-campcareer-locale")
  const locale = isLocale(routeLocale) ? routeLocale : DEFAULT_LOCALE

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LocaleProvider locale={locale}>
          <a href="#main-content" className="cc-skip-link">Skip to main content</a>
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
