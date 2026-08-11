import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type JapanDesignOccupationEditorialOverride = {
  id: string
  countryCode: "JP"
  editorial: CountryOccupationEditorial
}

export const JAPAN_DESIGN_OCCUPATION_EDITORIAL_OVERRIDES: readonly JapanDesignOccupationEditorialOverride[] = [
  {
    id: "graphic-designer",
    countryCode: "JP",
    editorial: {
      headline: "A directly classified visual-design occupation under MHLW 017-02 グラフィックデザイナー",
      entryPathway:
        "Japan's 2022 MHLW classification directly maps Graphic Designer to 017-02. The group covers visual design for printed and promotional material and explicitly includes advertising, sign and package designers. Formal qualifications are not universally required; visual-design study and a strong portfolio are common entry foundations. The reviewed Japanese design programmes remain related study pathways rather than occupational qualifications.",
      registration:
        "There is no universal statutory Graphic Designer licence in Japan. Employers commonly assess portfolio quality, software capability and professional experience rather than a regulated occupational credential.",
      jobMarketNote:
        "017-02 is the direct classification anchor, while illustrators, CG designers, book designers and creative directors are classified elsewhere. CampCareer keeps those adjacent creative roles outside the exact Graphic Designer scope.",
      scoreCaveat:
        "The foundation score reflects accessible portfolio-based entry and low licensing burden only. Shortage, vacancy, salary, growth and visa evidence remain unscored until the later common market-data enrichment phase.",
    },
  },
  {
    id: "ux-designer",
    countryCode: "JP",
    editorial: {
      headline: "A digital product-design role officially anchored by job tag to MHLW 009-99 rather than the general designer family",
      entryPathway:
        "MHLW job tag maps UX/UIデザイナー to 009-99 その他の情報処理・通信技術者（ソフトウェア開発）. The work combines user research, interface and interaction design, usability testing and collaboration with software teams. Interaction design, visual communication, product design, psychology and information-design study can support entry; the reviewed Japanese communication-design programme remains related rather than a professional qualification.",
      registration:
        "There is no universal statutory UX/UI Designer licence. Portfolio evidence, research and prototyping skill, digital-product experience and collaboration with development teams are the main practical entry signals.",
      jobMarketNote:
        "The official 009-99 anchor is broader than UX/UI design and also contains other software-development work. CampCareer therefore does not present group-level labour statistics as exact UX Designer observations.",
      scoreCaveat:
        "The provisional score recognises a clear digital-design pathway and low universal licensing burden. Market demand, earnings, growth and visa components remain deferred to the later enrichment phase.",
    },
  },
  {
    id: "multimedia-designer",
    countryCode: "JP",
    editorial: {
      headline: "A digital-media design and production umbrella without one standalone Japanese small-classification code",
      entryPathway:
        "Japan does not publish one exact Multimedia Designer small-classification code. CampCareer's role spans CG and digital visual-design work within 017-99 and broader professional media-content production within 020-99 depending on duties. Digital media, visual communication, motion, interaction and media-production study are relevant; all three reviewed Japanese programme mappings remain related pathways.",
      registration:
        "No universal statutory Multimedia Designer licence applies. Employment is normally based on creative and technical capability, portfolio evidence and production experience.",
      jobMarketNote:
        "017-99 and 020-99 cover substantially more than multimedia design. They are therefore retained as non-rollup references rather than being merged into a fabricated exact Multimedia Designer labour series.",
      scoreCaveat:
        "Only entry accessibility and general burden are scored in the foundation phase. Shortage, vacancies, salary, growth and visa signals remain intentionally unscored.",
    },
  },
  {
    id: "animator",
    countryCode: "JP",
    editorial: {
      headline: "A 2D/3D animation umbrella spanning job tag's 080-03 2D anchor and 017-99 CG-design scope",
      entryPathway:
        "MHLW job tag maps the 2D アニメーター occupation to 080-03 画工・看板制作工, while CampCareer's broader Animator role also includes 3D and CG animation that overlaps 017-99 CGデザイナー. Animation schools, art and digital-media programmes can help, but job tag notes that no particular academic qualification is universally required; studios commonly assess drawing, motion and digital-production portfolios.",
      registration:
        "There is no universal statutory Animator licence. Portfolio quality, drawing and motion fundamentals, production software skills and studio experience are the core entry signals.",
      jobMarketNote:
        "The official statistical anchors are broader than the canonical role: 080-03 also contains sign-production work and 017-99 contains many design occupations. CampCareer does not merge them into one exact Animator labour series.",
      scoreCaveat:
        "The foundation score recognises open portfolio-based entry and low licensing burden. Market, earnings, growth, shortage and visa evidence are deferred to the later common enrichment phase.",
    },
  },
  {
    id: "interior-designer",
    countryCode: "JP",
    editorial: {
      headline: "A directly recognised interior-design scope inside MHLW 017-99 その他のデザイナー",
      entryPathway:
        "MHLW 017-99 explicitly includes インテリアデザイナー, インテリアコーディネーター and インテリアプランナー. Interior, spatial and residential-design study plus portfolio work are common routes. The reviewed Japanese residential/interior programme is retained as a direct academic pathway, but academic completion does not create any separate statutory design licence.",
      registration:
        "There is no universal statutory Interior Designer licence. Interior design must be distinguished from architectural design, building confirmation and other legally regulated building-design or supervision work that can require an appropriately licensed 建築士.",
      jobMarketNote:
        "017-99 includes many other product, fashion, CG, spatial and craft design occupations. Group-level statistics are therefore not treated as exact Interior Designer market values.",
      scoreCaveat:
        "The current score reflects a structured design pathway with low universal licensing burden only. Market and visa components remain unscored pending later enrichment.",
    },
  },
  {
    id: "film-editor",
    countryCode: "JP",
    editorial: {
      headline: "A directly recognised video-editing scope under MHLW job tag's 020-99 professional-arts classification",
      entryPathway:
        "MHLW job tag maps 映像編集者 / 動画編集者 to 020-99 他に分類されない法務・経営・文化芸術等の専門的職業. Film, broadcasting, video and media-production study can support entry, but no particular qualification is universally required. Editing reels, software capability and production experience are central; the reviewed Japanese media programme remains related.",
      registration:
        "There is no universal statutory Film Editor licence in Japan. Entry is based primarily on editing skill, production workflow knowledge and demonstrable reel or project experience.",
      jobMarketNote:
        "020-99 is a broad residual professional group containing many unrelated occupations, so its labour statistics are not presented as exact Film Editor evidence.",
      scoreCaveat:
        "The foundation score reflects accessible skills-based entry and low licensing burden. Shortage, vacancy, salary, growth and visa components remain deferred.",
    },
  },
  {
    id: "architect",
    countryCode: "JP",
    editorial: {
      headline: "A regulated architecture pathway mapped to MHLW 008-01 建築設計技術者 with statutory 建築士 boundaries",
      entryPathway:
        "MHLW 008-01 directly covers architectural design and construction-supervision technical work. Architecture study is the clearest academic foundation. The reviewed Japanese architecture programme is retained as direct and the residential/interior programme as related, but programme completion alone does not grant 建築士 status or authorise regulated professional work.",
      registration:
        "Japan regulates the 建築士 profession. 一級建築士 requires passing the national examination and obtaining the Minister of Land, Infrastructure, Transport and Tourism licence through registration; 二級建築士 and 木造建築士 are prefectural licences. Building scale, structure and work type determine when appropriately licensed architects must perform design or construction supervision.",
      jobMarketNote:
        "008-01 is the closest direct occupational anchor, but the classification includes architectural-design technical work broadly while statutory practice rights differ by licence class and building scope. CampCareer therefore keeps classification and professional licensing as separate fields.",
      scoreCaveat:
        "The foundation score is low because entry into regulated architect practice is structured and licence-dependent, not because Japanese architecture demand has been judged weak. Market, salary, growth and visa components remain unscored until the later enrichment phase.",
    },
  },
  {
    id: "web-designer",
    countryCode: "JP",
    editorial: {
      headline: "A directly classified web-design occupation under MHLW 017-01 ウェブデザイナー",
      entryPathway:
        "MHLW 017-01 directly covers Webデザイナー, Webクリエイター and homepage designers and describes requirements, page structure and visual elements such as typography, layout, colour and icons. Web programming and HTML coding are explicitly separated into 009-03. Visual/web design, interaction design and front-end production study plus a portfolio are common entry routes; the reviewed Japanese programme is related.",
      registration:
        "There is no universal statutory Web Designer licence. Employers typically assess portfolio quality, design systems, responsive design, accessibility awareness and practical web-production capability.",
      jobMarketNote:
        "CampCareer keeps 017-01 design work separate from Web programming, HTML coding, Web direction and Web production management, which are classified elsewhere by MHLW.",
      scoreCaveat:
        "The foundation score recognises open portfolio-based entry and low licensing burden. Market, earnings, growth, shortage and visa components remain intentionally unscored until the common enrichment phase.",
    },
  },
]
