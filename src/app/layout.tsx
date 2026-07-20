import type { Metadata } from "next"
import Script from "next/script"
import localFont from "next/font/local"
import { Fraunces } from "next/font/google"
import "./globals.css"
import { LayoutShell } from "@/components/layout/layout-shell"
import { DEFAULT_LOCALE } from "@/lib/i18n/config"
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
    default: "CampCareer | Australia Study & Career Pathways",
    template: "%s | CampCareer",
  },
  description: "Find an Australia study and career path with source-backed tuition, income, and post-study pathway evidence.",
  keywords: [
    "Australia study", "Australia career", "Australian university", "student visa",
    "graduate salary", "university comparison", "work pathway", "study abroad planner",
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
    title: "CampCareer | Australia Study & Career Pathways",
    description: "Find an Australia study and career path with source-backed evidence.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CampCareer — Study Abroad Decision Engine" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CampCareer | Australia Study & Career Pathways",
    description: "Find an Australia study and career path with source-backed evidence.",
    images: ["/opengraph-image"],
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
      <body className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}>
        <LocaleProvider locale={DEFAULT_LOCALE}>
          <LocaleInit />
          <PageViewTracker />
          <LayoutShell>{children}</LayoutShell>
          <AnalyticsConsent />
        </LocaleProvider>
        <ConsentGatedInsights />
        {/* Impact affiliate verification — Revolut */}
        <Script id="impact-verification" strategy="beforeInteractive">
          {`
            (function(){
              var m=document.createElement('meta');
              m.name='impact-site-verification';
              m.setAttribute('value','4f336c30-8942-4500-9a4f-e33629d44797');
              document.head.appendChild(m);
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
