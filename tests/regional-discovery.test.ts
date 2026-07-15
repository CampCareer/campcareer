import assert from "node:assert/strict"
import test from "node:test"
import { regionalDiscoveryFor } from "../src/data/regional-discovery"

test("Australia regional discovery starts with the requested city choices", () => {
  const cities = regionalDiscoveryFor("AU")
  assert.deepEqual(cities.slice(0, 4).map((city) => city.city), ["Sydney", "Melbourne", "Brisbane", "Perth"])
  assert.ok(cities.some((city) => city.city === "Gold Coast" && city.code === "QLD"))
  assert.ok(cities.every((city) => city.image.startsWith("https://images.unsplash.com/")))
})

test("US regional discovery includes New York and Chicago with valid state codes", () => {
  const regions = regionalDiscoveryFor("US")
  assert.ok(regions.some((region) => region.city === "New York" && region.code === "NY"))
  assert.ok(regions.some((region) => region.city === "Chicago" && region.code === "IL"))
})

test("Ireland regional discovery offers the four main city choices", () => {
  const cities = regionalDiscoveryFor("IE")
  assert.deepEqual(cities.map((city) => city.city), ["Dublin", "Cork", "Galway", "Limerick"])
  assert.deepEqual(cities.map((city) => city.code), ["D", "CO", "G", "LK"])
  assert.ok(cities.every((city) => city.image.startsWith("https://images.unsplash.com/")))
})

test("remaining launch countries offer curated regional choices", () => {
  const expectedCities = {
    DE: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart"],
    NL: ["Amsterdam", "Rotterdam", "Utrecht", "Eindhoven", "The Hague", "Groningen"],
    BE: ["Brussels", "Leuven", "Ghent", "Antwerp", "Liège", "Bruges"],
    FR: ["Paris", "Lyon", "Toulouse", "Bordeaux", "Lille", "Marseille"],
    ES: ["Madrid", "Barcelona", "Valencia", "Seville", "Granada", "Salamanca", "Málaga", "Bilbao"],
    SG: ["Singapore"],
    KR: ["Seoul", "Busan", "Incheon", "Daejeon", "Daegu", "Gwangju", "Suwon", "Jeju"],
    JP: ["Tokyo", "Osaka", "Kyoto", "Fukuoka", "Nagoya", "Sapporo", "Sendai", "Yokohama"],
    NZ: ["Auckland", "Wellington", "Christchurch", "Dunedin", "Hamilton", "Palmerston North", "Queenstown"],
    NO: ["Oslo", "Bergen", "Trondheim", "Stavanger", "Tromsø", "Kristiansand", "Ålesund"],
    SE: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Lund", "Linköping", "Umeå"],
    DK: ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Roskilde", "Lyngby", "Esbjerg"],
    FI: ["Helsinki", "Tampere", "Turku", "Oulu", "Espoo", "Jyväskylä", "Lappeenranta"],
    CH: ["Zurich", "Geneva", "Lausanne", "Basel", "Bern", "Lugano", "St. Gallen"],
    AE: ["Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah"],
  } as const

  for (const [country, cities] of Object.entries(expectedCities)) {
    const regions = regionalDiscoveryFor(country)
    assert.deepEqual(regions.map((region) => region.city), cities)
    assert.ok(regions.every((region) => region.image.startsWith("https://images.unsplash.com/")))
  }
})

test("Germany regional cards use a distinct city thumbnail for every choice", () => {
  const cards = regionalDiscoveryFor("DE")
  assert.equal(new Set(cards.map((card) => card.image)).size, cards.length)
})

test("Netherlands regional cards use a distinct city thumbnail for every choice", () => {
  const cards = regionalDiscoveryFor("NL")
  assert.equal(new Set(cards.map((card) => card.image)).size, cards.length)
  assert.deepEqual(Object.fromEntries(cards.map((card) => [card.city, card.image.match(/photo-([^?]+)/)?.[1]])), {
    Amsterdam: "1459679749680-18eb1eb37418",
    Rotterdam: "1614521272693-73052eaefc51",
    Utrecht: "1564085027787-7f8911ca8d91",
    Eindhoven: "1707001472432-2eff999bcc9f",
    "The Hague": "1721643365334-9397c6896b6a",
    Groningen: "1706775114556-801040d1ca5b",
  })
})

test("Belgium regional cards cover study hubs and a flagship destination with unique thumbnails", () => {
  const cards = regionalDiscoveryFor("BE")
  assert.deepEqual(cards.map((card) => card.city), ["Brussels", "Leuven", "Ghent", "Antwerp", "Liège", "Bruges"])
  assert.equal(new Set(cards.map((card) => card.image)).size, cards.length)
})

test("France regional cards cover major study hubs with unique thumbnails", () => {
  const cards = regionalDiscoveryFor("FR")
  assert.deepEqual(cards.map((card) => card.city), ["Paris", "Lyon", "Toulouse", "Bordeaux", "Lille", "Marseille"])
  assert.equal(new Set(cards.map((card) => card.image)).size, cards.length)
})

test("Spain regional cards cover major study and destination cities with unique thumbnails", () => {
  const cards = regionalDiscoveryFor("ES")
  assert.deepEqual(cards.map((card) => card.city), ["Madrid", "Barcelona", "Valencia", "Seville", "Granada", "Salamanca", "Málaga", "Bilbao"])
  assert.equal(new Set(cards.map((card) => card.image)).size, cards.length)
})

test("South Korea regional cards cover major study hubs with unique thumbnails", () => {
  const cards = regionalDiscoveryFor("KR")
  assert.deepEqual(cards.map((card) => card.city), ["Seoul", "Busan", "Incheon", "Daejeon", "Daegu", "Gwangju", "Suwon", "Jeju"])
  assert.equal(new Set(cards.map((card) => card.image)).size, cards.length)
})

test("Japan regional cards cover major study hubs with unique thumbnails", () => {
  const cards = regionalDiscoveryFor("JP")
  assert.deepEqual(cards.map((card) => card.city), ["Tokyo", "Osaka", "Kyoto", "Fukuoka", "Nagoya", "Sapporo", "Sendai", "Yokohama"])
  assert.equal(new Set(cards.map((card) => card.image)).size, cards.length)
})

test("New Zealand regional cards cover major study hubs with unique thumbnails", () => {
  const cards = regionalDiscoveryFor("NZ")
  assert.deepEqual(cards.map((card) => card.city), ["Auckland", "Wellington", "Christchurch", "Dunedin", "Hamilton", "Palmerston North", "Queenstown"])
  assert.equal(new Set(cards.map((card) => card.image)).size, cards.length)
})

test("Norway regional cards cover major study hubs with unique thumbnails", () => {
  const cards = regionalDiscoveryFor("NO")
  assert.deepEqual(cards.map((card) => card.city), ["Oslo", "Bergen", "Trondheim", "Stavanger", "Tromsø", "Kristiansand", "Ålesund"])
  assert.equal(new Set(cards.map((card) => card.image)).size, cards.length)
})

test("Sweden regional cards cover major study hubs with unique thumbnails", () => {
  const cards = regionalDiscoveryFor("SE")
  assert.deepEqual(cards.map((card) => card.city), ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Lund", "Linköping", "Umeå"])
  assert.equal(new Set(cards.map((card) => card.image)).size, cards.length)
})

test("Denmark regional cards cover major study hubs with unique thumbnails", () => {
  const cards = regionalDiscoveryFor("DK")
  assert.deepEqual(cards.map((card) => card.city), ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Roskilde", "Lyngby", "Esbjerg"])
  assert.equal(new Set(cards.map((card) => card.image)).size, cards.length)
})

test("Finland regional cards cover major study hubs with unique thumbnails", () => {
  const cards = regionalDiscoveryFor("FI")
  assert.deepEqual(cards.map((card) => card.city), ["Helsinki", "Tampere", "Turku", "Oulu", "Espoo", "Jyväskylä", "Lappeenranta"])
  assert.equal(new Set(cards.map((card) => card.image)).size, cards.length)
})

test("Switzerland regional cards cover major study hubs with unique thumbnails", () => {
  const cards = regionalDiscoveryFor("CH")
  assert.deepEqual(cards.map((card) => card.city), ["Zurich", "Geneva", "Lausanne", "Basel", "Bern", "Lugano", "St. Gallen"])
  assert.equal(new Set(cards.map((card) => card.image)).size, cards.length)
})

test("Singapore is a city-state with one direct workspace choice", () => {
  const cards = regionalDiscoveryFor("SG")
  assert.deepEqual(cards.map((card) => [card.code, card.city, card.region]), [["SG", "Singapore", "Singapore"]])
})
