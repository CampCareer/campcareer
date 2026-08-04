import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("US")

export default function UnitedStatesPage() {
  return <CountryRoute code="US" />
}
