import { AustraliaCountrySources } from "./australia-country-sources"

export default function MethodologyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AustraliaCountrySources />
    </>
  )
}
