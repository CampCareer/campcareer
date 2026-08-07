import { getVisaDetail as getCoreVisaDetail, visaDetailKey, type VisaDetail } from "./visa-detail"
import { BATCH_1_VISA_DETAILS } from "./visa-detail-batch-1"
import { DENMARK_VISA_DETAILS } from "./visa-detail-denmark"
import { EUROPE_VISA_DETAILS } from "./visa-detail-europe"
import { FINLAND_VISA_DETAILS } from "./visa-detail-finland"
import { JAPAN_VISA_DETAILS } from "./visa-detail-japan"
import { KOREA_VISA_DETAILS } from "./visa-detail-korea"
import { NEW_ZEALAND_VISA_DETAILS } from "./visa-detail-new-zealand"
import { NORWAY_VISA_DETAILS } from "./visa-detail-norway"
import { SINGAPORE_VISA_DETAILS } from "./visa-detail-singapore"
import { SWEDEN_VISA_DETAILS } from "./visa-detail-sweden"
import { SWITZERLAND_VISA_DETAILS } from "./visa-detail-switzerland"
import { UAE_VISA_DETAILS } from "./visa-detail-uae"

export function getVisaDetail(countryCode: string, name: string): VisaDetail | null {
  const key = visaDetailKey(countryCode, name)
  return (
    UAE_VISA_DETAILS[key] ??
    SWITZERLAND_VISA_DETAILS[key] ??
    FINLAND_VISA_DETAILS[key] ??
    DENMARK_VISA_DETAILS[key] ??
    SWEDEN_VISA_DETAILS[key] ??
    NORWAY_VISA_DETAILS[key] ??
    NEW_ZEALAND_VISA_DETAILS[key] ??
    JAPAN_VISA_DETAILS[key] ??
    KOREA_VISA_DETAILS[key] ??
    SINGAPORE_VISA_DETAILS[key] ??
    BATCH_1_VISA_DETAILS[key] ??
    EUROPE_VISA_DETAILS[key] ??
    getCoreVisaDetail(countryCode, name)
  )
}
