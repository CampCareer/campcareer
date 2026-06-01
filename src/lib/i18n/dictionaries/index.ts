import en, { type Dictionary } from './en'
import ko from './ko'
import type { Locale } from '../config'

export const dictionaries: Record<Locale, Dictionary> = { en, ko }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en
}

export type { Dictionary }
