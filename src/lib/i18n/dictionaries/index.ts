import en, { type Dictionary } from './en'
import ko from './ko'
import type { Locale } from '../config'

const reviewedKo: Dictionary = {
  ...ko,
  nav: {
    ...ko.nav,
    degreeRisk: '전공 위험도',
  },
  dashboard: {
    ...ko.dashboard,
    topPicks: {
      ...ko.dashboard.topPicks,
      titlePrefix: '추천 코스',
    },
  },
}

export const dictionaries: Record<Locale, Dictionary> = { en, ko: reviewedKo }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en
}

export type { Dictionary }
