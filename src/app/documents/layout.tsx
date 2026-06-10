import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Document Vault — Keep Your Study Abroad Documents Safe",
  description: "Securely store and track passports, visas, transcripts, and other study abroad documents with expiry reminders.",
  path: "/documents",
})

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
