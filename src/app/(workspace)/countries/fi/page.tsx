import { buildCountryMetadata, CountryRoute } from "../country-route"

export const metadata = buildCountryMetadata("FI")

export default function FinlandPage() {
  return <CountryRoute code="FI" />
}
