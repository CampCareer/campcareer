import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("CH")

export default function SwitzerlandPage() {
  return <CountryRoute code="CH" />
}
