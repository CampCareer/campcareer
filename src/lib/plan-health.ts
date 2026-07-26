export type PlanHealthLocale = "ko" | "en"

export type PlanHealthSignal = {
  id: "deadline-overdue" | "deadline-missing" | "english-target" | "english-test" | "funding-target" | "funding-pace" | "funding-plan" | "pathway-lead" | "on-track"
  severity: "critical" | "attention" | "positive"
  title: string
  description: string
  href: "/applications" | "/budget" | "/english" | "/compare"
  cta: string
}

type PlanHealthInput = {
  locale: PlanHealthLocale
  targetIntakeMonth: string | null
  applicationDeadlines: Array<{ title: string; dueDate: string }>
  currentSavings: number
  monthlySaving: number
  targetAmount: number | null
  targetDate: string | null
  englishTargetScore: number | null
  englishTestDate: string | null
  leadingOptionTitle: string | null
  leadingRationale: string | null
  now?: Date
}

export type PlanHealth = {
  score: number
  status: "on-track" | "attention" | "at-risk"
  attentionCount: number
  signals: PlanHealthSignal[]
  nextAction: PlanHealthSignal | null
}

const DAY_MS = 24 * 60 * 60 * 1000
const AVERAGE_MONTH_DAYS = 30.44

export function buildPlanHealth(input: PlanHealthInput): PlanHealth {
  const isKo = input.locale === "ko"
  const today = startOfDay(input.now ?? new Date())
  const activeDeadlines = input.applicationDeadlines
    .filter((deadline) => deadline.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  const overdueDeadlines = activeDeadlines.filter((deadline) => toDate(deadline.dueDate) < today)
  const signals: PlanHealthSignal[] = []

  if (overdueDeadlines.length) {
    const first = overdueDeadlines[0]
    signals.push({
      id: "deadline-overdue",
      severity: "critical",
      title: isKo ? "확인하지 않은 지원 마감일이 있습니다" : "An application deadline needs your attention",
      description: isKo
        ? `“${first.title}” 마감일이 지났습니다. 지원 상태와 다음 조치를 지금 확인하세요.`
        : `The deadline for “${first.title}” has passed. Check the application status and your next step now.`,
      href: "/applications",
      cta: isKo ? "지원 준비 확인" : "Review applications",
    })
  } else if (input.targetIntakeMonth && activeDeadlines.length === 0) {
    signals.push({
      id: "deadline-missing",
      severity: "attention",
      title: isKo ? "지원 마감일을 먼저 확정하세요" : "Confirm an application deadline first",
      description: isKo
        ? "지원 마감일을 확정하지 않아 영어 시험일을 계산할 수 없습니다. 후보 한 곳의 마감일부터 기록하세요."
        : "Without an application deadline, your English test date cannot be planned. Start by recording one deadline for a shortlisted option.",
      href: "/applications",
      cta: isKo ? "마감일 추가" : "Add a deadline",
    })
  }

  if (input.targetIntakeMonth && input.englishTargetScore == null) {
    signals.push({
      id: "english-target",
      severity: "attention",
      title: isKo ? "영어 목표 점수를 정하세요" : "Set your target English score",
      description: isKo
        ? "목표 입학 시기는 있지만 필요한 영어 점수가 없습니다. 과정별 입학 조건을 확인해 목표 점수를 먼저 기록하세요."
        : "You have a target intake but no required English score. Check the entry requirement for a shortlisted course and record your target.",
      href: "/english",
      cta: isKo ? "영어 목표 설정" : "Set English target",
    })
  } else if (activeDeadlines.length && input.englishTargetScore != null && !input.englishTestDate) {
    signals.push({
      id: "english-test",
      severity: "attention",
      title: isKo ? "영어 시험일에 여유를 남겨두세요" : "Leave enough room for your English test",
      description: isKo
        ? "지원 일정은 있지만 영어 시험일이 없습니다. 재응시 가능성까지 고려해 시험일을 정하세요."
        : "Your application timeline is set, but no English test date is recorded. Choose one with room for a possible retake.",
      href: "/english",
      cta: isKo ? "영어 일정 정하기" : "Set test date",
    })
  }

  if (input.targetAmount == null && input.targetIntakeMonth) {
    signals.push({
      id: "funding-target",
      severity: "attention",
      title: isKo ? "총 필요 자금을 먼저 가늠하세요" : "Estimate your total funding need",
      description: isKo
        ? "목표 입학 시기에 맞춰 학비·생활비·초기 비용의 기준을 정하면, 실제 부족액과 저축 속도를 계산할 수 있습니다."
        : "Set a baseline for tuition, living and upfront costs for your target intake, then the funding gap and saving pace can be calculated.",
      href: "/budget",
      cta: isKo ? "필요 자금 입력" : "Set funding target",
    })
  } else if (input.targetAmount != null) {
    const remaining = Math.max(input.targetAmount - input.currentSavings, 0)
    const hasSavingPlan = input.monthlySaving > 0
    const targetDate = input.targetDate ? toDate(input.targetDate) : null

    if (remaining > 0 && !hasSavingPlan) {
      signals.push({
        id: "funding-plan",
        severity: "attention",
        title: isKo ? "월 저축 속도를 설정하세요" : "Set your monthly saving pace",
        description: isKo
          ? "필요 자금은 입력했지만 월 저축 계획이 없습니다. 월 금액 하나만 정하면 실제 회수 시점을 계산할 수 있습니다."
          : "Your total funding need is set, but there is no monthly saving pace. Add one amount to see whether the timeline is realistic.",
        href: "/budget",
        cta: isKo ? "자금 런웨이 설정" : "Set money runway",
      })
    } else if (remaining > 0 && hasSavingPlan && targetDate) {
      const monthsNeeded = Math.ceil(remaining / input.monthlySaving)
      const monthsAvailable = Math.max(0, Math.ceil((targetDate.getTime() - today.getTime()) / DAY_MS / AVERAGE_MONTH_DAYS))
      const monthsShort = monthsNeeded - monthsAvailable

      if (targetDate < today) {
        signals.push({
          id: "funding-pace",
          severity: "critical",
          title: isKo ? "자금 목표일이 이미 지났습니다" : "Your funding target date has passed",
          description: isKo
            ? "남은 필요 자금과 목표일을 다시 확인해, 현실적인 저축 속도로 업데이트하세요."
            : "Review the remaining funding need and update the target date to match a realistic saving pace.",
          href: "/budget",
          cta: isKo ? "자금 계획 조정" : "Adjust money plan",
        })
      } else if (monthsShort > 0) {
        signals.push({
          id: "funding-pace",
          severity: "attention",
          title: isKo ? "현재 저축 속도가 목표일에 맞지 않습니다" : "Your current saving pace misses the target date",
          description: isKo
            ? `현재 저축 속도에서는 목표 자금까지 ${monthsShort}개월이 부족합니다. 월 저축, 장학금 또는 목표일 중 하나를 조정하세요.`
            : `At your current saving pace, you are ${monthsShort} month${monthsShort === 1 ? "" : "s"} short of the funding target. Adjust monthly saving, scholarship assumptions, or the date.`,
          href: "/budget",
          cta: isKo ? "런웨이 다시 계산" : "Recalculate runway",
        })
      }
    }
  }

  if (input.leadingOptionTitle) {
    const rationale = input.leadingRationale?.trim()
    signals.push({
      id: "pathway-lead",
      severity: "positive",
      title: isKo ? `${input.leadingOptionTitle}가 현재 1순위입니다` : `${input.leadingOptionTitle} is your current first choice`,
      description: rationale
        ? (isKo ? rationale : rationale)
        : (isKo ? "1순위로 둔 이유를 한 줄로 기록하면 이후 비교와 리포트의 기준이 더 분명해집니다." : "Add one sentence explaining why it leads, so future comparisons and your decision report have a clear reference point."),
      href: "/compare",
      cta: isKo ? "1순위 근거 보기" : "Review first-choice rationale",
    })
  }

  const attentionCount = signals.filter((signal) => signal.severity !== "positive").length
  if (!signals.length) {
    signals.push({
      id: "on-track",
      severity: "positive",
      title: isKo ? "지금 할 일이 없습니다" : "Nothing to action right now",
      description: isKo
        ? "새로운 마감일이나 목표가 추가되면 다음 단계가 자동으로 표시됩니다."
        : "When a deadline, funding assumption, or English plan changes, the next step will appear here automatically.",
      href: "/compare",
      cta: isKo ? "경로 확인" : "Review pathway",
    })
  }

  const criticalCount = signals.filter((signal) => signal.severity === "critical").length
  const score = Math.max(30, 100 - criticalCount * 28 - attentionCount * 14)
  const status = criticalCount > 0 ? "at-risk" : attentionCount > 0 ? "attention" : "on-track"
  const nextAction = signals.find((signal) => signal.severity === "critical") ?? signals.find((signal) => signal.severity === "attention") ?? null

  return { score, status, attentionCount, signals: signals.slice(0, 4), nextAction }
}

function toDate(value: string) {
  return startOfDay(new Date(`${value.slice(0, 10)}T00:00:00`))
}

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate())
}
