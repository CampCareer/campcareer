import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("IE")

export default function IrelandPage() {
  return <CountryRoute code="IE" />
}
