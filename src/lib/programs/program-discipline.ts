export type ProgramDiscipline = {
  emoji: string
  label: string
}

type DisciplineRule = ProgramDiscipline & {
  pattern: RegExp
}

const SPECIFIC_DISCIPLINE_RULES: readonly DisciplineRule[] = [
  { pattern: /\b(dentistry|dental|oral health)\b/i, emoji: "🦷", label: "Dentistry" },
  { pattern: /\b(pharmacy|pharmaceutical)\b/i, emoji: "💊", label: "Pharmacy" },
  { pattern: /\b(nursing|midwifery)\b/i, emoji: "🩺", label: "Nursing" },
  { pattern: /\b(paramedicine|paramedic|emergency health)\b/i, emoji: "🚑", label: "Paramedicine" },
  {
    pattern: /\b(physiotherapy|physical therapy|occupational therapy|rehabilitation)\b/i,
    emoji: "🦴",
    label: "Allied health",
  },
  { pattern: /\b(veterinary|animal health)\b/i, emoji: "🐾", label: "Veterinary science" },
  {
    pattern: /\b(medicine|medical science|surgery|public health|health science|clinical)\b/i,
    emoji: "🩺",
    label: "Health",
  },
  {
    pattern: /\b(psychology|psychological|neuroscience|counselling|counseling)\b/i,
    emoji: "🧠",
    label: "Psychology",
  },
  {
    pattern: /\b(computer science|information technology|software|cyber|data science|artificial intelligence|machine learning|computing)\b/i,
    emoji: "💻",
    label: "Technology",
  },
  {
    pattern: /\b(engineering|mechatronic|mechanical|electrical|electronic|civil engineering|chemical engineering)\b/i,
    emoji: "⚙️",
    label: "Engineering",
  },
  {
    pattern: /\b(architecture|architectural|construction|building|quantity surveying|urban planning)\b/i,
    emoji: "🏗️",
    label: "Architecture and building",
  },
  { pattern: /\b(law|legal|juris doctor|criminology)\b/i, emoji: "⚖️", label: "Law" },
  {
    pattern: /\b(education|teaching|teacher|early childhood|pedagogy)\b/i,
    emoji: "📚",
    label: "Education",
  },
  {
    pattern: /\b(accounting|finance|financial|economics|business|commerce|management|marketing|human resources|entrepreneurship)\b/i,
    emoji: "📊",
    label: "Business",
  },
  {
    pattern: /\b(agriculture|agricultural|environment|environmental|forestry|horticulture|sustainability)\b/i,
    emoji: "🌱",
    label: "Environment and agriculture",
  },
  {
    pattern: /\b(biology|biological|chemistry|chemical science|physics|mathematics|statistics|laboratory|biotechnology|natural science)\b/i,
    emoji: "🔬",
    label: "Science",
  },
  {
    pattern: /\b(social work|social science|sociology|politics|international relations|history|anthropology|community services)\b/i,
    emoji: "🌍",
    label: "Society and culture",
  },
  {
    pattern: /\b(creative arts|fine arts|visual arts|graphic design|fashion|music|film|animation|media|photography|theatre)\b/i,
    emoji: "🎨",
    label: "Creative arts",
  },
  {
    pattern: /\b(hospitality|culinary|cookery|food service|tourism|hotel management)\b/i,
    emoji: "🍽️",
    label: "Hospitality",
  },
  { pattern: /\b(sport|sports|exercise science|fitness)\b/i, emoji: "🏃", label: "Sport" },
  { pattern: /\b(aviation|aeronautical|aerospace|pilot)\b/i, emoji: "✈️", label: "Aviation" },
  { pattern: /\b(marine|maritime|nautical|ocean)\b/i, emoji: "⚓", label: "Marine studies" },
]

const BROAD_FIELD_RULES: readonly DisciplineRule[] = [
  { pattern: /information technology/i, emoji: "💻", label: "Technology" },
  { pattern: /engineering and related technologies/i, emoji: "⚙️", label: "Engineering" },
  { pattern: /architecture and building/i, emoji: "🏗️", label: "Architecture and building" },
  { pattern: /health/i, emoji: "🩺", label: "Health" },
  { pattern: /education/i, emoji: "📚", label: "Education" },
  { pattern: /management and commerce/i, emoji: "📊", label: "Business" },
  { pattern: /natural and physical sciences/i, emoji: "🔬", label: "Science" },
  {
    pattern: /agriculture, environmental and related studies/i,
    emoji: "🌱",
    label: "Environment and agriculture",
  },
  { pattern: /society and culture/i, emoji: "🌍", label: "Society and culture" },
  { pattern: /creative arts/i, emoji: "🎨", label: "Creative arts" },
  {
    pattern: /food, hospitality and personal services/i,
    emoji: "🍽️",
    label: "Hospitality",
  },
  { pattern: /mixed field programmes/i, emoji: "🧭", label: "Multidisciplinary" },
]

export function getProgramDiscipline({
  title,
  fieldName,
  broadField,
}: {
  title: string
  fieldName?: string | null
  broadField?: string | null
}): ProgramDiscipline {
  const specificText = [title, fieldName].filter(Boolean).join(" ")
  const specificMatch = SPECIFIC_DISCIPLINE_RULES.find((rule) => rule.pattern.test(specificText))
  if (specificMatch) return { emoji: specificMatch.emoji, label: specificMatch.label }

  const broadText = [fieldName, broadField].filter(Boolean).join(" ")
  const broadMatch = BROAD_FIELD_RULES.find((rule) => rule.pattern.test(broadText))
  if (broadMatch) return { emoji: broadMatch.emoji, label: broadMatch.label }

  return { emoji: "🎓", label: "Study program" }
}
