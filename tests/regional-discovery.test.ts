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

test("every remaining launch country offers four regional choices", () => {
  const expectedCities = {
    DE: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart"],
    NL: ["Amsterdam", "Rotterdam", "Utrecht", "Eindhoven", "The Hague", "Groningen"],
    BE: ["Brussels", "Antwerp", "Ghent", "Leuven"],
    FR: ["Paris", "Lyon", "Toulouse", "Marseille"],
    ES: ["Madrid", "Barcelona", "Valencia", "Seville"],
    SG: ["Central", "CBD", "East", "West"],
    KR: ["Seoul", "Busan", "Incheon", "Daejeon"],
    JP: ["Tokyo", "Osaka", "Kyoto", "Fukuoka"],
    NZ: ["Auckland", "Wellington", "Christchurch", "Dunedin"],
    NO: ["Oslo", "Bergen", "Trondheim", "Stavanger"],
    SE: ["Stockholm", "Gothenburg", "Malmö", "Uppsala"],
    DK: ["Copenhagen", "Aarhus", "Odense", "Aalborg"],
    FI: ["Helsinki", "Tampere", "Turku", "Oulu"],
    CH: ["Zurich", "Geneva", "Lausanne", "Basel"],
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
})
