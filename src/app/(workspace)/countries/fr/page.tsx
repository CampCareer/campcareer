import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("FR")

export default function FrancePage() {
  return <CountryRoute code="FR" />
}
