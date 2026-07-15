export type RegionalDiscoveryCard = {
  code: string
  city: string
  region: string
  image: string
  accent: string
}

const COUNTRY_CITY_PHOTOS: Record<string, string> = {
  SG: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
  AE: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
}

function cityPhoto(country: keyof typeof COUNTRY_CITY_PHOTOS, focalPoint: "entropy" | "center" | "edges" | "faces") {
  return `${COUNTRY_CITY_PHOTOS[country]}?w=900&h=620&fit=crop&crop=${focalPoint}&auto=format`
}

/** Curated city-first entry points for the regional Maps experience. */
export const REGIONAL_DISCOVERY: Partial<Record<string, readonly RegionalDiscoveryCard[]>> = {
  AU: [
    { code: "NSW", city: "Sydney", region: "New South Wales", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=900&h=620&fit=crop&auto=format", accent: "from-blue-950/65" },
    { code: "VIC", city: "Melbourne", region: "Victoria", image: "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=900&h=620&fit=crop&auto=format", accent: "from-violet-950/65" },
    { code: "QLD", city: "Brisbane", region: "Queensland", image: "https://images.unsplash.com/photo-1623027588467-24b2124f70b1?w=900&h=620&fit=crop&auto=format", accent: "from-amber-950/65" },
    { code: "WA", city: "Perth", region: "Western Australia", image: "https://images.unsplash.com/photo-1562161092-01d53ec54edd?w=900&h=620&fit=crop&auto=format", accent: "from-cyan-950/65" },
    { code: "SA", city: "Adelaide", region: "South Australia", image: "https://images.unsplash.com/photo-1596017497096-90ee17fb4e82?w=900&h=620&fit=crop&auto=format", accent: "from-rose-950/65" },
    { code: "QLD", city: "Gold Coast", region: "Queensland", image: "https://images.unsplash.com/photo-1691028355763-0c4144bf441b?w=900&h=620&fit=crop&auto=format", accent: "from-emerald-950/65" },
  ],
  IE: [
    { code: "D", city: "Dublin", region: "County Dublin", image: "https://images.unsplash.com/photo-1666115836913-24e621a54d0b?w=900&h=620&fit=crop&auto=format", accent: "from-sky-950/65" },
    { code: "CO", city: "Cork", region: "County Cork", image: "https://images.unsplash.com/photo-1633937765115-b5e0987541b3?w=900&h=620&fit=crop&auto=format", accent: "from-rose-950/65" },
    { code: "G", city: "Galway", region: "County Galway", image: "https://images.unsplash.com/photo-1693824107580-9b05a98ea682?w=900&h=620&fit=crop&auto=format", accent: "from-indigo-950/65" },
    { code: "LK", city: "Limerick", region: "County Limerick", image: "https://images.unsplash.com/photo-1660687446300-b05801428ca9?w=900&h=620&fit=crop&auto=format", accent: "from-emerald-950/65" },
  ],
  DE: [
    { code: "BE", city: "Berlin", region: "Berlin", image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=900&h=620&fit=crop&auto=format", accent: "from-slate-950/65" },
    { code: "BY", city: "Munich", region: "Bayern", image: "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=900&h=620&fit=crop&auto=format", accent: "from-sky-950/65" },
    { code: "HH", city: "Hamburg", region: "Hamburg", image: "https://images.unsplash.com/photo-1553547274-0df401ae03c9?w=900&h=620&fit=crop&auto=format", accent: "from-cyan-950/65" },
    { code: "HE", city: "Frankfurt", region: "Hessen", image: "https://images.unsplash.com/photo-1617934276076-ec9239067428?w=900&h=620&fit=crop&auto=format", accent: "from-amber-950/65" },
    { code: "NW", city: "Cologne", region: "Nordrhein-Westfalen", image: "https://images.unsplash.com/photo-1600081925754-e32c08c14c19?w=900&h=620&fit=crop&auto=format", accent: "from-rose-950/65" },
    { code: "BW", city: "Stuttgart", region: "Baden-Württemberg", image: "https://images.unsplash.com/photo-1778574744503-9c7772f3b9b1?w=900&h=620&fit=crop&auto=format", accent: "from-violet-950/65" },
  ],
  NL: [
    { code: "NH", city: "Amsterdam", region: "Noord-Holland", image: "https://images.unsplash.com/photo-1459679749680-18eb1eb37418?w=900&h=620&fit=crop&auto=format", accent: "from-orange-950/65" },
    { code: "ZH", city: "Rotterdam", region: "Zuid-Holland", image: "https://images.unsplash.com/photo-1614521272693-73052eaefc51?w=900&h=620&fit=crop&auto=format", accent: "from-sky-950/65" },
    { code: "UT", city: "Utrecht", region: "Utrecht", image: "https://images.unsplash.com/photo-1564085027787-7f8911ca8d91?w=900&h=620&fit=crop&auto=format", accent: "from-emerald-950/65" },
    { code: "NB", city: "Eindhoven", region: "Noord-Brabant", image: "https://images.unsplash.com/photo-1707001472432-2eff999bcc9f?w=900&h=620&fit=crop&auto=format", accent: "from-rose-950/65" },
    { code: "ZH", city: "The Hague", region: "Zuid-Holland", image: "https://images.unsplash.com/photo-1721643365334-9397c6896b6a?w=900&h=620&fit=crop&auto=format", accent: "from-slate-950/65" },
    { code: "GR", city: "Groningen", region: "Groningen", image: "https://images.unsplash.com/photo-1706775114556-801040d1ca5b?w=900&h=620&fit=crop&auto=format", accent: "from-violet-950/65" },
  ],
  BE: [
    { code: "BR", city: "Brussels", region: "Brussels-Capital", image: "https://images.unsplash.com/photo-1726577488579-7f5ff06124a0?w=900&h=620&fit=crop&auto=format", accent: "from-slate-950/65" },
    { code: "FL", city: "Leuven", region: "Flanders", image: "https://images.unsplash.com/photo-1754506824581-9d3418237d23?w=900&h=620&fit=crop&auto=format", accent: "from-amber-950/65" },
    { code: "FL", city: "Ghent", region: "Flanders", image: "https://images.unsplash.com/photo-1747359882522-12a00d085d7b?w=900&h=620&fit=crop&auto=format", accent: "from-indigo-950/65" },
    { code: "FL", city: "Antwerp", region: "Flanders", image: "https://images.unsplash.com/photo-1746997758533-0fddfdf8bee9?w=900&h=620&fit=crop&auto=format", accent: "from-red-950/65" },
    { code: "WA", city: "Liège", region: "Wallonia", image: "https://images.unsplash.com/photo-1560517000-993dacd20080?w=900&h=620&fit=crop&auto=format", accent: "from-cyan-950/65" },
    { code: "FL", city: "Bruges", region: "Flanders", image: "https://images.unsplash.com/photo-1773866109823-6ee72743ea37?w=900&h=620&fit=crop&auto=format", accent: "from-rose-950/65" },
  ],
  FR: [
    { code: "11", city: "Paris", region: "Île-de-France", image: "https://images.unsplash.com/photo-1742071327447-5cb04ee7ee0a?w=900&h=620&fit=crop&auto=format", accent: "from-slate-950/65" },
    { code: "84", city: "Lyon", region: "Auvergne-Rhône-Alpes", image: "https://images.unsplash.com/photo-1753170183936-ed0aea2d3948?w=900&h=620&fit=crop&auto=format", accent: "from-rose-950/65" },
    { code: "76", city: "Toulouse", region: "Occitanie", image: "https://images.unsplash.com/photo-1576367872882-489d040b9bde?w=900&h=620&fit=crop&auto=format", accent: "from-violet-950/65" },
    { code: "75", city: "Bordeaux", region: "Nouvelle-Aquitaine", image: "https://images.unsplash.com/photo-1748875343539-9e1099eb3557?w=900&h=620&fit=crop&auto=format", accent: "from-amber-950/65" },
    { code: "32", city: "Lille", region: "Hauts-de-France", image: "https://images.unsplash.com/photo-1722093178530-3426be00d616?w=900&h=620&fit=crop&auto=format", accent: "from-indigo-950/65" },
    { code: "93", city: "Marseille", region: "Provence-Alpes-Côte d'Azur", image: "https://images.unsplash.com/photo-1744021000461-f8411055a94b?w=900&h=620&fit=crop&auto=format", accent: "from-sky-950/65" },
  ],
  ES: [
    { code: "MD", city: "Madrid", region: "Community of Madrid", image: "https://images.unsplash.com/photo-1569676814972-31aa39db5817?w=900&h=620&fit=crop&auto=format", accent: "from-red-950/65" },
    { code: "CT", city: "Barcelona", region: "Catalonia", image: "https://images.unsplash.com/photo-1745091726008-717fb812bd0d?w=900&h=620&fit=crop&auto=format", accent: "from-amber-950/65" },
    { code: "VC", city: "Valencia", region: "Valencian Community", image: "https://images.unsplash.com/photo-1747996697631-f556d66265f6?w=900&h=620&fit=crop&auto=format", accent: "from-orange-950/65" },
    { code: "AN", city: "Seville", region: "Andalusia", image: "https://images.unsplash.com/photo-1744698276062-a0ffe2246318?w=900&h=620&fit=crop&auto=format", accent: "from-rose-950/65" },
    { code: "AN", city: "Granada", region: "Andalusia", image: "https://images.unsplash.com/photo-1770288361252-df2f7e6e3069?w=900&h=620&fit=crop&auto=format", accent: "from-violet-950/65" },
    { code: "CL", city: "Salamanca", region: "Castile and León", image: "https://images.unsplash.com/photo-1633994504403-1fc4bac4ae75?w=900&h=620&fit=crop&auto=format", accent: "from-amber-950/65" },
    { code: "AN", city: "Málaga", region: "Andalusia", image: "https://images.unsplash.com/photo-1699972345717-1afc1a32f178?w=900&h=620&fit=crop&auto=format", accent: "from-sky-950/65" },
    { code: "PV", city: "Bilbao", region: "Basque Country", image: "https://images.unsplash.com/photo-1605483212637-fcf76267509b?w=900&h=620&fit=crop&auto=format", accent: "from-slate-950/65" },
  ],
  SG: [
    { code: "SG", city: "Singapore", region: "Singapore", image: cityPhoto("SG", "center"), accent: "from-slate-950/65" },
  ],
  KR: [
    { code: "11", city: "Seoul", region: "Seoul", image: "https://images.unsplash.com/photo-1748273945548-6ef8d73b9325?w=900&h=620&fit=crop&auto=format", accent: "from-slate-950/65" },
    { code: "26", city: "Busan", region: "Busan", image: "https://images.unsplash.com/photo-1750682385431-b92e0f8ccbd0?w=900&h=620&fit=crop&auto=format", accent: "from-sky-950/65" },
    { code: "28", city: "Incheon", region: "Incheon", image: "https://images.unsplash.com/photo-1446733993804-c62a351c7239?w=900&h=620&fit=crop&auto=format", accent: "from-cyan-950/65" },
    { code: "30", city: "Daejeon", region: "Daejeon", image: "https://images.unsplash.com/photo-1756744789026-287c398992d9?w=900&h=620&fit=crop&auto=format", accent: "from-violet-950/65" },
    { code: "27", city: "Daegu", region: "Daegu", image: "https://images.unsplash.com/photo-1663670889635-0aabebf112ba?w=900&h=620&fit=crop&auto=format", accent: "from-rose-950/65" },
    { code: "29", city: "Gwangju", region: "Gwangju", image: "https://images.unsplash.com/photo-1611698324848-9c863ce38ba6?w=900&h=620&fit=crop&auto=format", accent: "from-emerald-950/65" },
    { code: "41", city: "Suwon", region: "Gyeonggi", image: "https://images.unsplash.com/photo-1714905532906-0b9ec1b22dfa?w=900&h=620&fit=crop&auto=format", accent: "from-amber-950/65" },
    { code: "50", city: "Jeju", region: "Jeju", image: "https://images.unsplash.com/photo-1572609025690-7e948447d2c1?w=900&h=620&fit=crop&auto=format", accent: "from-teal-950/65" },
  ],
  JP: [
    { code: "13", city: "Tokyo", region: "Tokyo", image: "https://images.unsplash.com/photo-1547448526-5e9d57fa28f7?w=900&h=620&fit=crop&auto=format", accent: "from-slate-950/65" },
    { code: "27", city: "Osaka", region: "Osaka", image: "https://images.unsplash.com/photo-1626432018525-964f683f2ed0?w=900&h=620&fit=crop&auto=format", accent: "from-rose-950/65" },
    { code: "26", city: "Kyoto", region: "Kyoto", image: "https://images.unsplash.com/photo-1551106368-d9157e48a3ca?w=900&h=620&fit=crop&auto=format", accent: "from-amber-950/65" },
    { code: "40", city: "Fukuoka", region: "Fukuoka", image: "https://images.unsplash.com/photo-1574678505748-99e73cc7ee41?w=900&h=620&fit=crop&auto=format", accent: "from-cyan-950/65" },
    { code: "23", city: "Nagoya", region: "Aichi", image: "https://images.unsplash.com/photo-1747546314703-6c4fc20c5a37?w=900&h=620&fit=crop&auto=format", accent: "from-sky-950/65" },
    { code: "01", city: "Sapporo", region: "Hokkaido", image: "https://images.unsplash.com/photo-1736156725121-027231636f9d?w=900&h=620&fit=crop&auto=format", accent: "from-indigo-950/65" },
    { code: "04", city: "Sendai", region: "Miyagi", image: "https://images.unsplash.com/photo-1701389469145-ad50d5704cc0?w=900&h=620&fit=crop&auto=format", accent: "from-emerald-950/65" },
    { code: "14", city: "Yokohama", region: "Kanagawa", image: "https://images.unsplash.com/photo-1546126627-e3f127b26a38?w=900&h=620&fit=crop&auto=format", accent: "from-violet-950/65" },
  ],
  NZ: [
    { code: "AUK", city: "Auckland", region: "Auckland", image: "https://images.unsplash.com/photo-1745550663491-6cec967ce6e9?w=900&h=620&fit=crop&auto=format", accent: "from-sky-950/65" },
    { code: "WGN", city: "Wellington", region: "Wellington", image: "https://images.unsplash.com/photo-1740776572210-57241d6d01a5?w=900&h=620&fit=crop&auto=format", accent: "from-indigo-950/65" },
    { code: "CAN", city: "Christchurch", region: "Canterbury", image: "https://images.unsplash.com/photo-1704410892064-a1cf957acf86?w=900&h=620&fit=crop&auto=format", accent: "from-emerald-950/65" },
    { code: "OTG", city: "Dunedin", region: "Otago", image: "https://images.unsplash.com/photo-1702908591022-6d14a453f1d6?w=900&h=620&fit=crop&auto=format", accent: "from-rose-950/65" },
    { code: "WKO", city: "Hamilton", region: "Waikato", image: "https://images.unsplash.com/photo-1720762186630-950c6e79edbd?w=900&h=620&fit=crop&auto=format", accent: "from-amber-950/65" },
    { code: "MWT", city: "Palmerston North", region: "Manawatū-Whanganui", image: "https://images.unsplash.com/photo-1599517490179-a77038ad35ef?w=900&h=620&fit=crop&auto=format", accent: "from-violet-950/65" },
    { code: "OTG", city: "Queenstown", region: "Otago", image: "https://images.unsplash.com/photo-1706416857635-140589ff80e8?w=900&h=620&fit=crop&auto=format", accent: "from-teal-950/65" },
  ],
  NO: [
    { code: "OSL", city: "Oslo", region: "Oslo", image: "https://images.unsplash.com/photo-1673697967248-0a52621c991e?w=900&h=620&fit=crop&auto=format", accent: "from-slate-950/65" },
    { code: "VEL", city: "Bergen", region: "Vestland", image: "https://images.unsplash.com/photo-1544085311-11a028465b03?w=900&h=620&fit=crop&auto=format", accent: "from-emerald-950/65" },
    { code: "TRN", city: "Trondheim", region: "Trøndelag", image: "https://images.unsplash.com/photo-1739972209054-c1dab53ebd7f?w=900&h=620&fit=crop&auto=format", accent: "from-sky-950/65" },
    { code: "ROG", city: "Stavanger", region: "Rogaland", image: "https://images.unsplash.com/photo-1739890723805-e0b373bd9671?w=900&h=620&fit=crop&auto=format", accent: "from-cyan-950/65" },
    { code: "TRO", city: "Tromsø", region: "Troms", image: "https://images.unsplash.com/photo-1705450298521-6039856be2c5?w=900&h=620&fit=crop&auto=format", accent: "from-indigo-950/65" },
    { code: "AGD", city: "Kristiansand", region: "Agder", image: "https://images.unsplash.com/photo-1604071255368-e196ea7561c2?w=900&h=620&fit=crop&auto=format", accent: "from-amber-950/65" },
    { code: "MRD", city: "Ålesund", region: "Møre og Romsdal", image: "https://images.unsplash.com/photo-1543078615-d2a11bab60ab?w=900&h=620&fit=crop&auto=format", accent: "from-teal-950/65" },
  ],
  SE: [
    { code: "AB", city: "Stockholm", region: "Stockholm", image: "https://images.unsplash.com/photo-1484037832928-afe345637f55?w=900&h=620&fit=crop&auto=format", accent: "from-slate-950/65" },
    { code: "O", city: "Gothenburg", region: "Västra Götaland", image: "https://images.unsplash.com/photo-1663405811054-ca933435bd00?w=900&h=620&fit=crop&auto=format", accent: "from-blue-950/65" },
    { code: "M", city: "Malmö", region: "Skåne", image: "https://images.unsplash.com/photo-1768385957603-5619592cc3cd?w=900&h=620&fit=crop&auto=format", accent: "from-rose-950/65" },
    { code: "C", city: "Uppsala", region: "Uppsala", image: "https://images.unsplash.com/photo-1553106789-988f8d3c366f?w=900&h=620&fit=crop&auto=format", accent: "from-violet-950/65" },
    { code: "M", city: "Lund", region: "Skåne", image: "https://images.unsplash.com/photo-1728299955742-8102b4c20326?w=900&h=620&fit=crop&auto=format", accent: "from-amber-950/65" },
    { code: "E", city: "Linköping", region: "Östergötland", image: "https://images.unsplash.com/photo-1508694396858-5a25e4301594?w=900&h=620&fit=crop&auto=format", accent: "from-teal-950/65" },
    { code: "AC", city: "Umeå", region: "Västerbotten", image: "https://images.unsplash.com/photo-1651743332051-acf608391fb2?w=900&h=620&fit=crop&auto=format", accent: "from-indigo-950/65" },
  ],
  DK: [
    { code: "HST", city: "Copenhagen", region: "Hovedstaden", image: "https://images.unsplash.com/photo-1531041233226-c8a14aea8f71?w=900&h=620&fit=crop&auto=format", accent: "from-slate-950/65" },
    { code: "MID", city: "Aarhus", region: "Midtjylland", image: "https://images.unsplash.com/photo-1670938936264-abce9c8f0262?w=900&h=620&fit=crop&auto=format", accent: "from-sky-950/65" },
    { code: "SDJ", city: "Odense", region: "Syddanmark", image: "https://images.unsplash.com/photo-1752229532354-f2b08621ca6a?w=900&h=620&fit=crop&auto=format", accent: "from-emerald-950/65" },
    { code: "NOR", city: "Aalborg", region: "Nordjylland", image: "https://images.unsplash.com/photo-1592819847775-6310d3834c92?w=900&h=620&fit=crop&auto=format", accent: "from-cyan-950/65" },
    { code: "SJA", city: "Roskilde", region: "Sjælland", image: "https://images.unsplash.com/photo-1653854309135-c79da0ed007a?w=900&h=620&fit=crop&auto=format", accent: "from-amber-950/65" },
    { code: "HST", city: "Lyngby", region: "Hovedstaden", image: "https://images.unsplash.com/photo-1766082391508-c8744683a67e?w=900&h=620&fit=crop&auto=format", accent: "from-violet-950/65" },
    { code: "SDJ", city: "Esbjerg", region: "Syddanmark", image: "https://images.unsplash.com/photo-1608981796038-f462623ae72b?w=900&h=620&fit=crop&auto=format", accent: "from-rose-950/65" },
  ],
  FI: [
    { code: "UUS", city: "Helsinki", region: "Uusimaa", image: "https://images.unsplash.com/photo-1742639008098-52228af96081?w=900&h=620&fit=crop&auto=format", accent: "from-slate-950/65" },
    { code: "PIR", city: "Tampere", region: "Pirkanmaa", image: "https://images.unsplash.com/photo-1741439273728-0de174cd19dd?w=900&h=620&fit=crop&auto=format", accent: "from-violet-950/65" },
    { code: "VRS", city: "Turku", region: "Varsinais-Suomi", image: "https://images.unsplash.com/photo-1642804602210-767abc6de942?w=900&h=620&fit=crop&auto=format", accent: "from-sky-950/65" },
    { code: "NPO", city: "Oulu", region: "Pohjois-Pohjanmaa", image: "https://images.unsplash.com/photo-1657123096362-f12bfb5dcf53?w=900&h=620&fit=crop&auto=format", accent: "from-cyan-950/65" },
    { code: "UUS", city: "Espoo", region: "Uusimaa", image: "https://images.unsplash.com/photo-1594724914833-6af2e9b76665?w=900&h=620&fit=crop&auto=format", accent: "from-teal-950/65" },
    { code: "KSR", city: "Jyväskylä", region: "Keski-Suomi", image: "https://images.unsplash.com/photo-1593891245945-13f350a0f631?w=900&h=620&fit=crop&auto=format", accent: "from-emerald-950/65" },
    { code: "SKR", city: "Lappeenranta", region: "Etelä-Karjala", image: "https://images.unsplash.com/photo-1700409132318-18e7c9af33a9?w=900&h=620&fit=crop&auto=format", accent: "from-indigo-950/65" },
  ],
  CH: [
    { code: "ZH", city: "Zurich", region: "Zurich", image: "https://images.unsplash.com/photo-1742645045059-3e40ee3530f5?w=900&h=620&fit=crop&auto=format", accent: "from-slate-950/65" },
    { code: "GE", city: "Geneva", region: "Geneva", image: "https://images.unsplash.com/photo-1550913052-56eb528b8e7c?w=900&h=620&fit=crop&auto=format", accent: "from-blue-950/65" },
    { code: "VD", city: "Lausanne", region: "Vaud", image: "https://images.unsplash.com/photo-1748674918639-fccbf8708500?w=900&h=620&fit=crop&auto=format", accent: "from-sky-950/65" },
    { code: "BS", city: "Basel", region: "Basel-Stadt", image: "https://images.unsplash.com/photo-1707321519218-f0a61ce4a249?w=900&h=620&fit=crop&auto=format", accent: "from-rose-950/65" },
    { code: "BE", city: "Bern", region: "Bern", image: "https://images.unsplash.com/photo-1741900035072-7f84f2d90154?w=900&h=620&fit=crop&auto=format", accent: "from-emerald-950/65" },
    { code: "TI", city: "Lugano", region: "Ticino", image: "https://images.unsplash.com/photo-1670279727087-736135859f5f?w=900&h=620&fit=crop&auto=format", accent: "from-teal-950/65" },
    { code: "SG", city: "St. Gallen", region: "St. Gallen", image: "https://images.unsplash.com/photo-1661604258327-f91d61de431d?w=900&h=620&fit=crop&auto=format", accent: "from-violet-950/65" },
  ],
  AE: [
    { code: "DXB", city: "Dubai", region: "Dubai", image: cityPhoto("AE", "center"), accent: "from-amber-950/65" },
    { code: "AUH", city: "Abu Dhabi", region: "Abu Dhabi", image: cityPhoto("AE", "entropy"), accent: "from-slate-950/65" },
    { code: "SHJ", city: "Sharjah", region: "Sharjah", image: cityPhoto("AE", "edges"), accent: "from-rose-950/65" },
    { code: "RAK", city: "Ras Al Khaimah", region: "Ras Al Khaimah", image: cityPhoto("AE", "faces"), accent: "from-orange-950/65" },
  ],
  US: [
    { code: "NY", city: "New York", region: "New York", image: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=900&h=620&fit=crop&auto=format", accent: "from-slate-950/70" },
    { code: "CA", city: "California", region: "California", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&h=620&fit=crop&auto=format", accent: "from-orange-950/65" },
    { code: "IL", city: "Chicago", region: "Illinois", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&h=620&fit=crop&auto=format", accent: "from-sky-950/65" },
    { code: "MA", city: "Boston", region: "Massachusetts", image: "https://images.unsplash.com/photo-1501979376754-2ff867a4f659?w=900&h=620&fit=crop&auto=format", accent: "from-red-950/65" },
    { code: "WA", city: "Seattle", region: "Washington", image: "https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=900&h=620&fit=crop&auto=format", accent: "from-emerald-950/65" },
    { code: "TX", city: "Texas", region: "Texas", image: "https://images.unsplash.com/photo-1531219572328-a0171b4448a3?w=900&h=620&fit=crop&auto=format", accent: "from-yellow-950/65" },
  ],
  CA: [
    { code: "ON", city: "Toronto", region: "Ontario", image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=900&h=620&fit=crop&auto=format", accent: "from-indigo-950/65" },
    { code: "BC", city: "Vancouver", region: "British Columbia", image: "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=900&h=620&fit=crop&auto=format", accent: "from-teal-950/65" },
    { code: "AB", city: "Calgary", region: "Alberta", image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=900&h=620&fit=crop&auto=format", accent: "from-emerald-950/65" },
    { code: "QC", city: "Montréal", region: "Quebec", image: "https://images.unsplash.com/photo-1519178614-68673b201f36?w=900&h=620&fit=crop&auto=format", accent: "from-fuchsia-950/65" },
  ],
  UK: [
    { code: "TLI", city: "London", region: "London", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&h=620&fit=crop&auto=format", accent: "from-slate-950/70" },
    { code: "TLD", city: "Manchester", region: "North West", image: "https://images.unsplash.com/photo-1465447142348-e9952c393450?w=900&h=620&fit=crop&auto=format", accent: "from-red-950/65" },
    { code: "TLM", city: "Edinburgh", region: "Scotland", image: "https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=900&h=620&fit=crop&auto=format", accent: "from-violet-950/65" },
    { code: "TLG", city: "Birmingham", region: "West Midlands", image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=900&h=620&fit=crop&auto=format", accent: "from-amber-950/65" },
  ],
} as const

export function regionalDiscoveryFor(countryCode: string) {
  return REGIONAL_DISCOVERY[countryCode.toUpperCase()] ?? []
}
