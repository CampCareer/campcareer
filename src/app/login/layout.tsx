import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Log In",
  description: "Log in to CampCareer to save courses, track your checklist, and plan your study abroad journey.",
  path: "/login",
})

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
