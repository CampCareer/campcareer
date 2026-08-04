import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("DK")

export default function DenmarkPage() {
  return <CountryRoute code="DK" />
}
