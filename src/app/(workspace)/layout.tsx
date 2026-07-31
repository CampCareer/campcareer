import { WorkspaceShell } from "@/components/workspace/workspace-shell"
import { CountryProvider } from "@/components/workspace/country-context"

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <CountryProvider>
      <WorkspaceShell>{children}</WorkspaceShell>
    </CountryProvider>
  )
}
