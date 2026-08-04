import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("SE")

export default function SwedenPage() {
  return <CountryRoute code="SE" />
}
