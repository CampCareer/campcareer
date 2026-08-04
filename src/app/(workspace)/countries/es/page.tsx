import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("ES")

export default function SpainPage() {
  return <CountryRoute code="ES" />
}
