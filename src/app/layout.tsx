import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import localFont from "next/font/local"
import "./globals.css"
import { LayoutShell } from "@/components/layout/layout-shell"
import { getLocale } from "@/lib/i18n/server"
import { LocaleProvider } from "@/lib/i18n/locale-provider"

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
    default: "CampCareer — Study Abroad ROI Explorer",
    template: "%s | CampCareer",
  },
  description: "Compare graduate salaries, tuition, and ROI across USA, Ireland, UK, Canada & Australia. Real government data, not guesswork.",
  keywords: ["study abroad", "ROI", "graduate salary", "Ireland tuition", "Australia visa", "Canada PR", "UK graduate salary", "university comparison"],
  authors: [{ name: "CampCareer" }],
  creator: "CampCareer",
  metadataBase: new URL("https://www.campcareer.com"),
  alternates: { canonical: "/" },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.campcareer.com",
    siteName: "CampCareer",
    title: "CampCareer — Study Abroad ROI Explorer",
    description: "Compare graduate salaries, tuition, and ROI across USA, Ireland, UK, Canada & Australia.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CampCareer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CampCareer — Study Abroad ROI Explorer",
    description: "Compare graduate salaries, tuition, and ROI across USA, Ireland, UK, Canada & Australia.",
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
  const locale = getLocale()
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LocaleProvider locale={locale}>
          <LayoutShell>{children}</LayoutShell>
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  )
}
