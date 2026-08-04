import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("CA")

export default function CanadaPage() {
  return <CountryRoute code="CA" />
}
