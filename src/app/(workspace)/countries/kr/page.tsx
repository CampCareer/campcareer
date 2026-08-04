import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("KR")

export default function SouthKoreaPage() {
  return <CountryRoute code="KR" />
}
