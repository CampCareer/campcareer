import { getVisaDetail as getCoreVisaDetail, visaDetailKey, type VisaDetail } from "./visa-detail"
import { BATCH_1_VISA_DETAILS } from "./visa-detail-batch-1"
import { EUROPE_VISA_DETAILS } from "./visa-detail-europe"
import { JAPAN_VISA_DETAILS } from "./visa-detail-japan"
import { KOREA_VISA_DETAILS } from "./visa-detail-korea"
import { SINGAPORE_VISA_DETAILS } from "./visa-detail-singapore"

export function getVisaDetail(countryCode: string, name: string): VisaDetail | null {
  const key = visaDetailKey(countryCode, name)
  return (
    JAPAN_VISA_DETAILS[key] ??
    KOREA_VISA_DETAILS[key] ??
    SINGAPORE_VISA_DETAILS[key] ??
    BATCH_1_VISA_DETAILS[key] ??
    EUROPE_VISA_DETAILS[key] ??
    getCoreVisaDetail(countryCode, name)
  )
}
