import { createHash } from 'crypto'

// 항목의 category+task로부터 안정적이고 결정적인 id를 생성한다.
// 같은 내용이면 항상 같은 id가 나오므로, 캐시/진행상황/화면이 영구적으로 일치한다.
export function makeChecklistId(category: string, task: string): string {
  const normalized = `${category}|${task}`.toLowerCase().trim().replace(/\s+/g, ' ')
  return createHash('sha1').update(normalized).digest('hex').slice(0, 12)
}

// 항목 배열에 결정적 id를 부여한다 (Claude가 준 id는 무시하고 덮어쓴다).
export function withStableIds<T extends { category: string; task: string }>(
  items: T[]
): (T & { id: string })[] {
  return items.map((item) => ({
    ...item,
    id: makeChecklistId(item.category, item.task),
  }))
}
