import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("NZ")

export default function NewZealandPage() {
  return <CountryRoute code="NZ" />
}
