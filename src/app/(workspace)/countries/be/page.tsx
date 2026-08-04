import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("BE")

export default function BelgiumPage() {
  return <CountryRoute code="BE" />
}
