import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import localFont from "next/font/local"
import "./globals.css"
import { LayoutShell } from "@/components/layout/layout-shell"

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
  title: "CampCareer",
  description: "Find your best country for your career — with data, not emotions.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LayoutShell>{children}</LayoutShell>
        <Analytics />
      </body>
    </html>
  )
}
