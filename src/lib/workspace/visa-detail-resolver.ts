import { getVisaDetail as getCoreVisaDetail, visaDetailKey, type VisaDetail } from "./visa-detail"
import { EUROPE_VISA_DETAILS } from "./visa-detail-europe"

export function getVisaDetail(countryCode: string, name: string): VisaDetail | null {
  return EUROPE_VISA_DETAILS[visaDetailKey(countryCode, name)] ?? getCoreVisaDetail(countryCode, name)
}
