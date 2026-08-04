import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("UK")

export default function UnitedKingdomPage() {
  return <CountryRoute code="UK" />
}
