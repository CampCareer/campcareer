import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("JP")

export default function JapanPage() {
  return <CountryRoute code="JP" />
}
