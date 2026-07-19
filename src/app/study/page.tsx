import { StudyHub } from '@/components/study/study-hub'
import { getAuStudyValueMatches } from '@/lib/au-study-value-matches'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 86400

export const metadata = pageMetadata({
  title: 'Study Options — Tuition, Graduate Outcomes & Value Matches',
  description: 'Start your study search with complete tuition and graduate-outcome signals for Australian options, then explore destinations worldwide.',
  path: '/study',
})

export default async function StudyPage() {
  const matches = await getAuStudyValueMatches()
  return <StudyHub matches={matches} />
}
