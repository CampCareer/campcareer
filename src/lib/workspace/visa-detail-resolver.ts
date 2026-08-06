import { getVisaDetail as getCoreVisaDetail, visaDetailKey, type VisaDetail } from "./visa-detail"
import { BATCH_1_VISA_DETAILS } from "./visa-detail-batch-1"
import { EUROPE_VISA_DETAILS } from "./visa-detail-europe"

export function getVisaDetail(countryCode: string, name: string): VisaDetail | null {
  const key = visaDetailKey(countryCode, name)
  return BATCH_1_VISA_DETAILS[key] ?? EUROPE_VISA_DETAILS[key] ?? getCoreVisaDetail(countryCode, name)
}
