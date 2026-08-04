import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("SG")

export default function SingaporePage() {
  return <CountryRoute code="SG" />
}
