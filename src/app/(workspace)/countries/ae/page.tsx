import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("AE")

export default function UnitedArabEmiratesPage() {
  return <CountryRoute code="AE" />
}
