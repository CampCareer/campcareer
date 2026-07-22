# CampCareer Australia launch contract

Status: agreed in product scope; not yet available for purchase
Market: Australia only
Catalogue currency: AUD
Primary audience: people planning study, work, or a study-to-work pathway in Australia

This document is the release boundary for CampCareer before the first public marketing launch. It deliberately narrows the product to Australia so the service earns trust through depth before expanding to the 20-country vision.

## 1. What is in the first launch

### Public market boundary

- Public acquisition, navigation, SEO landing pages, reports, and checkout sell Australia only.
- Research and existing routes for other countries may remain in the codebase, but must not present themselves as a comparable paid product or primary public journey.
- The public Australia catalogue is organised around the existing ten broad areas:
  1. Construction & skilled trades
  2. Health & care
  3. IT, data & science
  4. Engineering, manufacturing & resources
  5. Business, finance, legal & public administration
  6. Education, social & community services
  7. Environment & agriculture
  8. Design, media & culture
  9. Hospitality, retail & services
  10. Transport, aviation, maritime & logistics

An area, city, university, qualification, or occupation may only be sold in a report once it passes the evidence gate in section 5. A visible catalogue card is not a promise that every combination is immediately report-ready.

### Core decision journey

`conditions → field/occupation → university and city comparison → saved options → report or expert review`

The free experience must produce enough evidence for a visitor to understand their options. Paid reports package that evidence into a decision, scenario analysis, and an actionable next step; they must not withhold basic facts merely to create a paywall.

## 2. Commercial catalogue

All listed prices are in Australian dollars and exclude no hidden service tier. Local tax and payment-processing treatment will be finalised during the checkout implementation.

| Product | Price | Deliverable | Scope |
| --- | ---: | --- | --- |
| Australia Deep-Dive Report | A$9 | 15–25 pages; target 20 | One field, one city, or one university |
| Australia Study ROI Index 2026 | A$29 | 35–60 pages; target 50 | Australia-wide ranking and market analysis |
| My Australia ROI Decision Report | A$59 | 18–30 pages; target 24 | Personal recommendation across saved options |
| Australia Expert Review | A$149 | Booked review and consultation | Expert-led implementation guidance |

### Upgrade rule

- A customer who has a completed, paid **Australia Study ROI Index 2026** order may upgrade to the **My Australia ROI Decision Report** for an additional **A$30**.
- Without that paid order, the personalised report costs **A$59**.
- A$9 deep-dive reports do not create an upgrade discount in the first launch. Bundles and other promotional discounts are deliberately out of scope until purchase data exists.
- The checkout service must prove entitlement server-side; a URL parameter, browser storage value, or emailed link alone must never unlock the discounted price.

### Expert review settlement

- Customer price: A$149.
- Intended expert payout: A$100 after the booked review is completed.
- Intended CampCareer gross share: A$49 before processor fees, refunds, taxes, and any contractual obligations.
- Expert eligibility, rescheduling, cancellation, tax treatment, payout timing, and customer refund rules are operational requirements for the payment and scheduling stage; no expert session is sold before they are published.

## 3. Report content contract

### A$9 Australia Deep-Dive Report

One report addresses exactly one selected topic: a field, a city, or a university. It should explain the decision context, the relevant study and career outcomes, cost factors, risks, source dates, and what the reader should verify next. It is not a generic blog article exported to PDF.

### Australia Study ROI Index 2026

Working subtitle: **The Data-Driven Guide to Degrees, Careers and Payback** / **학비, 생활비, 취업률, 연봉을 반영한 투자회수 분석**.

The target table of contents includes:

1. Australia-wide major ROI ranking
2. Separate bachelor, master, and VET rankings
3. University or provider tuition-to-outcome comparison
4. Short- and mid-term graduate earnings
5. Employment and job-relevance outcomes
6. City cost-of-living adjusted ROI
7. Tuition payback period
8. Occupation demand and shortage persistence
9. AI automation exposure
10. Major 2026 policy and market changes
11. Methodology and data sources
12. Trap analysis, including high-salary choices with weak ROI

Rankings must never imply false precision. Where the data does not support a direct comparison, the report must label the item as unavailable, estimated, or not comparable rather than invent a rank.

### My Australia ROI Decision Report

The intake captures:

- current age;
- education and work history;
- English level;
- maximum budget and expected scholarship amount;
- family accompaniment;
- preferred cities and metro-versus-regional preference;
- target occupation;
- return-home versus Australian employment goal;
- risk tolerance; and
- desired payback period.

The report evaluates the user's saved options. It contains:

1. **Executive decision** — a plain-language first recommendation and why it wins.
2. **User condition summary** — budget, programme, target occupation, preferred region, analysis horizon, and decision weights.
3. **Option comparison** — total tuition, estimated living cost, total funds required, expected starting salary, after-tax income, payback period, job-market score, and risk for Options A, B, and C.
4. **Personalised ROI scenarios** — base, optimistic, and conservative cases. The conservative scenario explicitly models outcomes such as a six-month job-search delay, 10% lower starting pay, or 15% higher living costs.
5. **Option fit and risk** — who each option suits, who it does not suit, favourable conditions, key risks, and items the customer must verify.
6. **90-day action plan** — programme and admission checks, English planning, scholarship review, financial plan, application preparation, and final choice/application actions.
7. **Confidence and sources** — every material number identifies its source, as-of date, actual-versus-estimated status, confidence (High/Medium/Low), and assumptions.

The product is an evidence-based decision aid. It must not claim to determine visa eligibility, guarantee admission, employment, permanent residency, salary, or investment return.

### Australia Expert Review

The expert sees the customer's consented decision context and report-related questions before the session. The service provides a practical review and implementation consultation; it does not provide regulated immigration, legal, financial, or education-agent advice unless the assigned expert is appropriately authorised and the service terms permit it.

## 4. Language, experience, and privacy requirements

- The product interface, questionnaire, checkout, order emails, delivery email, terms, and support paths launch in natural Korean and English. No surface may show an English fallback as a finished Korean translation.
- Report language is an explicit customer choice. A language may only be offered where its template, generated content, sources, and quality review are complete.
- Mobile is a first-class checkout and report-ordering surface. The complete questionnaire, saved-option selection, payment return, and order status must work at a 390px viewport without horizontal table dependence.
- Personalised intake is sensitive profile data. It must request only necessary fields, explain why each field is collected, retain it for a defined period, let the customer request deletion, and never use it to make an automated visa-eligibility decision.

## 5. Evidence and product-quality gate

No paid report can use a material input unless the data record includes, where applicable:

- the primary source URL and source organisation;
- the data as-of date and last verification date;
- whether the number is observed, calculated, estimated, or user-provided;
- methodology and assumptions, including tuition, tax, living-cost, and payback calculations;
- a confidence label of High, Medium, or Low; and
- a review path for policy changes and disputed information.

City living costs must use the user's selected city and practical housing assumptions where they are known. A national average must be identified as an estimate, not presented as a personal cost.

## 6. Step-0 acceptance criteria

This stage is complete when:

- the machine-readable catalogue in `src/lib/report-catalog.ts` matches this contract;
- the four report products, AUD prices, page ranges, scope types, upgrade entitlement, and expert split have automated contract tests;
- the Australia-only public-product boundary remains enforced; and
- no catalogue or checkout UI exposes a product as purchasable before the payment, fulfilment, and evidence gates are delivered.

The next stage is data trust and coverage: turn the source rules above into field-level, university-level, and city-level launch checks before building a sales surface.
