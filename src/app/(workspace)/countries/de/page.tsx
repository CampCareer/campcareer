import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("DE")

export default function GermanyPage() {
  return <CountryRoute code="DE" />
}
