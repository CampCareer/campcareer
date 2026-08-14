# CampCareer

CampCareer scores careers and shows people the clearest path to get there.

The initial product is deliberately focused:

1. **CampCareer Score** — judge whether a career is worth pursuing in a specific country.
2. **Evidence** — explain why the score exists with source-backed signals.
3. **Pathway** — show the practical requirements and steps to enter the career.
4. **Study / Programs** — connect the career to relevant education and training options.
5. **Jobs** — connect the career to real employment opportunities and job-search links.

The public score is deliberately simple:

> **Demand · Pay · Entry**

```text
CampCareer Score = Demand × 4 + Pay × 3 + Entry × 3
```

Visa and personal eligibility belong to the pathway, not the public career score. Personalisation changes **Your Path**, not the CampCareer Score.

The primary product surface is the **Career Page**, not a dashboard. Users should receive useful career value before being asked to create an account.

> **Value first. Account second.**

Canonical product documents:

- [Product doctrine](./docs/PRODUCT_DOCTRINE.md)
- [CampCareer Score Contract v1](./docs/CAMPCAREER_SCORE_CONTRACT.md)
- [Initial information architecture](./docs/INITIAL_INFORMATION_ARCHITECTURE.md)
- [Career Page experience spec](./docs/CAREER_PAGE_EXPERIENCE_SPEC.md)
- [Concise product core](./docs/product-core.md)

## Tech Stack
Next.js, Supabase, Tailwind CSS, Vercel

## Run Locally
npm install
npm run dev
