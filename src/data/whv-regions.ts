import { WHVRegion } from "@/types/whv"
import type { WHVWorkCategory } from "./whv-occupations"

const BASE_WORK: WHVWorkCategory[] = ["agriculture", "fishing", "tree_farming", "mining", "construction"]

function r(work: WHVWorkCategory[] = BASE_WORK) {
  return work
}

export const WHV_REGIONS: Record<string, WHVRegion> = {
  // NSW
  "101": { category: "eligible", pct: 100, name: "Capital Region", workCategories: r() },
  "102": { category: "eligible", pct: 100, name: "Central Coast", workCategories: r() },
  "103": { category: "eligible", pct: 100, name: "Central West", workCategories: r() },
  "104": { category: "eligible", pct: 100, name: "Coffs Harbour - Grafton", workCategories: r(["tourism_hospitality"]) },
  "105": { category: "eligible", pct: 100, name: "Far West and Orana", workCategories: r(["tourism_hospitality"]) },
  "106": { category: "eligible", pct: 95, name: "Hunter Valley exc Newcastle", workCategories: r(["tourism_hospitality"]) },
  "107": { category: "eligible", pct: 89, name: "Illawarra", workCategories: r() },
  "108": { category: "eligible", pct: 100, name: "Mid North Coast", workCategories: r(["tourism_hospitality"]) },
  "109": { category: "eligible", pct: 100, name: "Murray", workCategories: r() },
  "110": { category: "eligible", pct: 100, name: "New England and North West", workCategories: r(["tourism_hospitality"]) },
  "111": { category: "eligible", pct: 100, name: "Newcastle and Lake Macquarie", workCategories: r() },
  "112": { category: "eligible", pct: 100, name: "Richmond - Tweed", workCategories: r(["tourism_hospitality"]) },
  "113": { category: "eligible", pct: 100, name: "Riverina", workCategories: r() },
  "114": { category: "eligible", pct: 100, name: "Southern Highlands and Shoalhaven", workCategories: r() },
  "115": { category: "eligible", pct: 90, name: "Sydney - Baulkham Hills and Hawkesbury", workCategories: r() },
  "116": { category: "eligible", pct: 91, name: "Sydney - Blacktown", workCategories: r() },
  "117": { category: "partial", pct: 4, name: "Sydney - City and Inner South", workCategories: r() },
  "118": { category: "partial", pct: 27, name: "Sydney - Eastern Suburbs", workCategories: r() },
  "119": { category: "eligible", pct: 79, name: "Sydney - Inner South West", workCategories: r() },
  "120": { category: "eligible", pct: 51, name: "Sydney - Inner West", workCategories: r() },
  "121": { category: "partial", pct: 42, name: "Sydney - North Sydney and Hornsby", workCategories: r() },
  "122": { category: "eligible", pct: 80, name: "Sydney - Northern Beaches", workCategories: r() },
  "123": { category: "eligible", pct: 94, name: "Sydney - Outer South West", workCategories: r() },
  "124": { category: "eligible", pct: 93, name: "Sydney - Outer West and Blue Mountains", workCategories: r() },
  "125": { category: "eligible", pct: 62, name: "Sydney - Parramatta", workCategories: r() },
  "126": { category: "eligible", pct: 52, name: "Sydney - Ryde", workCategories: r() },
  "127": { category: "eligible", pct: 79, name: "Sydney - South West", workCategories: r() },
  "128": { category: "eligible", pct: 79, name: "Sydney - Sutherland", workCategories: r() },

  // VIC
  "201": { category: "eligible", pct: 100, name: "Ballarat", workCategories: r() },
  "202": { category: "eligible", pct: 100, name: "Bendigo", workCategories: r() },
  "203": { category: "eligible", pct: 100, name: "Geelong", workCategories: r() },
  "204": { category: "eligible", pct: 100, name: "Hume", workCategories: r() },
  "205": { category: "eligible", pct: 100, name: "Latrobe - Gippsland", workCategories: r(["tourism_hospitality"]) },
  "206": { category: "partial", pct: 33, name: "Melbourne - Inner", workCategories: r() },
  "207": { category: "eligible", pct: 75, name: "Melbourne - Inner East", workCategories: r() },
  "208": { category: "eligible", pct: 78, name: "Melbourne - Inner South", workCategories: r() },
  "209": { category: "partial", pct: 42, name: "Melbourne - North East", workCategories: r() },
  "210": { category: "partial", pct: 49, name: "Melbourne - North West", workCategories: r() },
  "211": { category: "eligible", pct: 93, name: "Melbourne - Outer East", workCategories: r() },
  "212": { category: "eligible", pct: 93, name: "Melbourne - South East", workCategories: r() },
  "213": { category: "partial", pct: 48, name: "Melbourne - West", workCategories: r() },
  "214": { category: "eligible", pct: 100, name: "Mornington Peninsula", workCategories: r(["tourism_hospitality"]) },
  "215": { category: "eligible", pct: 100, name: "North West", workCategories: r(["tourism_hospitality"]) },
  "216": { category: "eligible", pct: 100, name: "Shepparton", workCategories: r() },
  "217": { category: "eligible", pct: 100, name: "Warrnambool and South West", workCategories: r() },

  // QLD
  "301": { category: "eligible", pct: 100, name: "Brisbane - East", workCategories: r() },
  "302": { category: "eligible", pct: 89, name: "Brisbane - North", workCategories: r() },
  "303": { category: "eligible", pct: 94, name: "Brisbane - South", workCategories: r() },
  "304": { category: "eligible", pct: 75, name: "Brisbane - West", workCategories: r() },
  "305": { category: "eligible", pct: 68, name: "Brisbane Inner City", workCategories: r() },
  "306": { category: "eligible", pct: 100, name: "Cairns", workCategories: r(["tourism_hospitality"]) },
  "307": { category: "eligible", pct: 100, name: "Darling Downs - Maranoa", workCategories: r(["tourism_hospitality"]) },
  "308": { category: "eligible", pct: 100, name: "Central Queensland", workCategories: r(["tourism_hospitality"]) },
  "309": { category: "eligible", pct: 85, name: "Gold Coast", workCategories: r(["tourism_hospitality"]) },
  "310": { category: "eligible", pct: 100, name: "Ipswich", workCategories: r() },
  "311": { category: "eligible", pct: 100, name: "Logan - Beaudesert", workCategories: r() },
  "312": { category: "eligible", pct: 100, name: "Mackay", workCategories: r(["tourism_hospitality"]) },
  "313": { category: "eligible", pct: 100, name: "Moreton Bay - North", workCategories: r() },
  "314": { category: "eligible", pct: 100, name: "Moreton Bay - South", workCategories: r() },
  "315": { category: "eligible", pct: 100, name: "Queensland - Outback", workCategories: r(["tourism_hospitality"]) },
  "316": { category: "eligible", pct: 100, name: "Sunshine Coast", workCategories: r(["tourism_hospitality"]) },
  "317": { category: "eligible", pct: 100, name: "Toowoomba", workCategories: r() },
  "318": { category: "eligible", pct: 100, name: "Townsville", workCategories: r(["tourism_hospitality"]) },
  "319": { category: "eligible", pct: 100, name: "Wide Bay", workCategories: r(["tourism_hospitality"]) },

  // SA
  "401": { category: "eligible", pct: 100, name: "Adelaide - Central and Hills", workCategories: r() },
  "402": { category: "eligible", pct: 100, name: "Adelaide - North", workCategories: r() },
  "403": { category: "eligible", pct: 100, name: "Adelaide - South", workCategories: r() },
  "404": { category: "eligible", pct: 100, name: "Adelaide - West", workCategories: r() },
  "405": { category: "eligible", pct: 100, name: "Barossa - Yorke - Mid North", workCategories: r() },
  "406": { category: "eligible", pct: 100, name: "South Australia - Outback", workCategories: r(["tourism_hospitality"]) },
  "407": { category: "eligible", pct: 100, name: "South Australia - South East", workCategories: r() },

  // WA
  "501": { category: "eligible", pct: 100, name: "Bunbury", workCategories: r() },
  "502": { category: "eligible", pct: 71, name: "Mandurah", workCategories: r() },
  "503": { category: "none", pct: 0, name: "Perth - Inner", workCategories: [] },
  "504": { category: "partial", pct: 32, name: "Perth - North East", workCategories: r() },
  "505": { category: "partial", pct: 24, name: "Perth - North West", workCategories: r() },
  "506": { category: "partial", pct: 20, name: "Perth - South East", workCategories: r() },
  "507": { category: "partial", pct: 2, name: "Perth - South West", workCategories: r() },
  "509": { category: "eligible", pct: 99, name: "Western Australia - Wheat Belt", workCategories: r() },
  "510": { category: "eligible", pct: 100, name: "Western Australia - Outback (North)", workCategories: r(["tourism_hospitality"]) },
  "511": { category: "eligible", pct: 100, name: "Western Australia - Outback (South)", workCategories: r(["tourism_hospitality"]) },

  // TAS
  "601": { category: "eligible", pct: 100, name: "Hobart", workCategories: r(["tourism_hospitality"]) },
  "602": { category: "eligible", pct: 100, name: "Launceston and North East", workCategories: r(["tourism_hospitality"]) },
  "603": { category: "eligible", pct: 100, name: "South East", workCategories: r(["tourism_hospitality"]) },
  "604": { category: "eligible", pct: 100, name: "West and North West", workCategories: r(["tourism_hospitality"]) },

  // NT
  "701": { category: "eligible", pct: 100, name: "Darwin", workCategories: r(["tourism_hospitality"]) },
  "702": { category: "eligible", pct: 100, name: "Northern Territory - Outback", workCategories: r(["tourism_hospitality"]) },

  // ACT
  "801": { category: "eligible", pct: 100, name: "Australian Capital Territory", workCategories: r() },

  // Other Territories
  "901": { category: "eligible", pct: 100, name: "Other Territories", workCategories: r() },
}
