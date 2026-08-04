import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("NO")

export default function NorwayPage() {
  return <CountryRoute code="NO" />
}
