import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("NL")

export default function NetherlandsPage() {
  return <CountryRoute code="NL" />
}
