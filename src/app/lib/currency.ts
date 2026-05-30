export const SUPPORTED_CURRENCIES = ["USD", "AUD", "CAD", "GBP", "EUR"] as const
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

export type ExchangeRates = {
  base: "USD"
  date: string
  rates: Record<string, number> // each value = how many units per 1 USD
}

/**
 * Fetches latest exchange rates via our internal proxy route.
 * Proxying avoids CORS issues — api.frankfurter.dev lacks Access-Control-Allow-Origin.
 * Base is USD; rates for AUD, CAD, GBP, EUR are returned.
 */
export async function getExchangeRates(): Promise<ExchangeRates> {
  const res = await fetch("/api/exchange-rates")
  if (!res.ok) throw new Error(`Exchange rate API error: ${res.status}`)
  return res.json() as Promise<ExchangeRates>
}

/**
 * Converts `amount` (in `fromCurrency`) to `baseCurrency`.
 * `rates` uses USD as the pivot: rates[X] = units of X per 1 USD.
 */
export function convertToBase(
  amount: number,
  fromCurrency: SupportedCurrency,
  rates: Record<string, number>,
  baseCurrency: SupportedCurrency,
): number {
  if (fromCurrency === baseCurrency) return amount
  const usd = fromCurrency === "USD" ? amount : amount / rates[fromCurrency]
  return baseCurrency === "USD" ? usd : usd * rates[baseCurrency]
}
