"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronRight, Code2, Landmark, Stethoscope, Zap } from "lucide-react"
import {
  getChosenFieldValues,
  hasComparableFields,
  toggleComparedField,
  type FieldExplorerFixture,
  type FieldExplorerItem,
  type FieldPriority,
} from "./home-field-fixtures"
import { toHomeSearchQuery } from "./home-search-config"
import { HomePathSaveFooter } from "./home-path-save"
import { HomeResultHeader } from "./home-result-ui"

const PRIORITIES: ReadonlyArray<{ id: FieldPriority; label: string; description: string }> = [
  { id: "career-demand", label: "Career demand", description: "Explore current occupation data where it is available." },
  { id: "lower-study-cost", label: "Lower study cost", description: "Compare provider tuition and total study costs." },
  { id: "faster-route", label: "Faster route", description: "Review duration by qualification and prior study." },
  { id: "visa-potential", label: "Visa potential", description: "Check current occupation and visa rules separately." },
]

type HomeFieldExplorerResultsProps = {
  fixture: FieldExplorerFixture
}

export function HomeFieldExplorerResults({ fixture }: HomeFieldExplorerResultsProps) {
  const router = useRouter()
  const [priority, setPriority] = useState<FieldPriority>("career-demand")
  const [comparedIds, setComparedIds] = useState<string[]>(() => fixture.fields.slice(0, 2).map((field) => field.id))
  const [chosenFieldSlug, setChosenFieldSlug] = useState("")
  const [detailsMessage, setDetailsMessage] = useState("")
  const comparedFields = fixture.fields.filter((field) => comparedIds.includes(field.id))
  const chosenField = fixture.fields.find((field) => field.slug === chosenFieldSlug)
  const selectedPriority = PRIORITIES.find((item) => item.id === priority)!

  const toggleField = (fieldId: string) => {
    setComparedIds((current) => toggleComparedField(current, fieldId, fixture.fields.map((field) => field.id)))
  }

  const chooseField = () => {
    const values = getChosenFieldValues(fixture, chosenFieldSlug)
    if (!values) return
    router.push(`/home?${toHomeSearchQuery(values).toString()}`, { scroll: false })
  }

  return (
    <section className="mx-auto max-w-5xl px-1 pt-4" aria-label="Field exploration results">
      <HomeResultHeader eyebrow="Australia · Field exploration" title={fixture.title} description={fixture.description} status="Field not selected" />

      <PriorityControl priority={priority} onChange={setPriority} description={selectedPriority.description} />
      <FieldsToExplore
        fields={fixture.fields}
        priority={priority}
        comparedIds={comparedIds}
        chosenFieldSlug={chosenFieldSlug}
        onToggleCompare={toggleField}
        onChoose={setChosenFieldSlug}
        onExplore={(field) => setDetailsMessage(`${field.name} details will be connected in a later step.`)}
      />
      <FieldComparison fields={comparedFields} />
      <RelatedCareers fields={comparedFields} onView={(careerName) => setDetailsMessage(`${careerName} occupation details will be connected in a later step.`)} />
      <WhatToConsider fixture={fixture} />
      <ChooseField chosenField={chosenField} onChoose={chooseField} />
      <HomePathSaveFooter />
      {detailsMessage && <p role="status" className="pb-4 text-sm text-[#6f6d68]">{detailsMessage}</p>}
    </section>
  )
}

function PriorityControl({ priority, onChange, description }: { priority: FieldPriority; onChange: (priority: FieldPriority) => void; description: string }) {
  return (
    <section className="py-6 sm:py-7" aria-labelledby="priority-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="priority-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Explore by priority</h2>
          <p className="mt-2 max-w-2xl rounded-xl border border-[#e7e6e3] bg-[#fafaf9] px-3 py-2 text-sm leading-6 text-[#5f5d57]">{description} Fields are shown for exploration, not ranked or personalised.</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Explore fields by priority">
        {PRIORITIES.map((item) => {
          const selected = priority === item.id
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(item.id)}
              className={`min-h-11 rounded-xl border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2 ${selected ? "border-blue-600 bg-blue-600 text-white" : "border-[#dedcd7] bg-white text-[#4a4842] hover:border-[#aaa8a1]"}`}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function FieldsToExplore({ fields, priority, comparedIds, chosenFieldSlug, onToggleCompare, onChoose, onExplore }: {
  fields: readonly FieldExplorerItem[]
  priority: FieldPriority
  comparedIds: readonly string[]
  chosenFieldSlug: string
  onToggleCompare: (fieldId: string) => void
  onChoose: (fieldSlug: string) => void
  onExplore: (field: FieldExplorerItem) => void
}) {
  return (
    <section id="fields-to-explore" className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="fields-heading">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="fields-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Fields to explore</h2>
          <p className="mt-1 text-sm leading-6 text-[#6f6d68]">Choose fields to compare. These cards are not a personalised recommendation.</p>
        </div>
        <p role="status" aria-live="polite" className="text-sm font-medium text-[#4a4842]">{comparedIds.length} selected for comparison</p>
      </div>
      <div className="mt-4 grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => (
          <FieldCard
            key={field.id}
            field={field}
            priority={priority}
            compared={comparedIds.includes(field.id)}
            chosen={chosenFieldSlug === field.slug}
            onToggleCompare={() => onToggleCompare(field.id)}
            onChoose={() => onChoose(field.slug)}
            onExplore={() => onExplore(field)}
          />
        ))}
      </div>
    </section>
  )
}

function FieldCard({ field, priority, compared, chosen, onToggleCompare, onChoose, onExplore }: {
  field: FieldExplorerItem
  priority: FieldPriority
  compared: boolean
  chosen: boolean
  onToggleCompare: () => void
  onChoose: () => void
  onExplore: () => void
}) {
  return (
    <article className={`flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_12px_30px_-28px_rgba(27,27,27,0.45)] ${chosen ? "border-blue-300 ring-1 ring-blue-100" : "border-[#e7e6e3]"}`}>
      <div className="flex h-20 items-center justify-between bg-[#f5f8ff] px-4 sm:h-24">
        <FieldIcon type={field.icon} />
        {chosen && <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white">Selected field</span>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold leading-6 text-[#1b1b1b]">{field.name}</h3>
        <p className="mt-2 text-sm leading-5 text-[#5f5d57]"><span className="font-medium text-[#3a3935]">Careers:</span> {field.relatedCareers.map((career) => career.name).join(", ")}</p>
        <dl className="mt-4 space-y-2.5 border-t border-[#eeece8] pt-3 text-sm">
          <Fact term="Study length" definition={field.studyDurationLabel} />
          <Fact term="Tuition" definition={field.tuitionLabel} />
          <Fact term="Key requirement" definition={field.entryRequirement} />
        </dl>
        <p className="mt-3 border-t border-[#eeece8] pt-3 text-xs font-medium leading-5 text-blue-700">{field.priorityNotes[priority]}</p>
        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[#eeece8] pt-3">
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#3a3935] focus-within:ring-2 focus-within:ring-blue-600/35">
            <input type="checkbox" data-field-id={field.id} checked={compared} onChange={onToggleCompare} className="size-4 rounded border-[#aaa8a1] accent-blue-600" />
            Compare
          </label>
          <button type="button" onClick={onExplore} className="min-h-11 rounded-lg px-2 text-right text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2">Explore field</button>
        </div>
        <button type="button" onClick={onChoose} aria-pressed={chosen} className={`mt-2 min-h-11 rounded-lg border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2 ${chosen ? "border-blue-600 bg-blue-50 text-blue-700" : "border-[#d5d3ce] text-[#3a3935] hover:border-[#aaa8a1]"}`}>
          {chosen ? "Field selected" : "Select field"}
        </button>
      </div>
    </article>
  )
}

function FieldIcon({ type }: { type: FieldExplorerItem["icon"] }) {
  const Icon = type === "nursing" ? Stethoscope : type === "software" ? Code2 : type === "electrical" ? Zap : type === "finance" ? Landmark : ChevronRight
  return <span aria-hidden="true" className="grid size-14 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm"><Icon className="size-7" /></span>
}

function Fact({ term, definition }: { term: string; definition: string }) {
  return <div><dt className="text-[#8a8882]">{term}</dt><dd className="mt-0.5 font-medium leading-5 text-[#3a3935]">{definition}</dd></div>
}

function FieldComparison({ fields }: { fields: readonly FieldExplorerItem[] }) {
  const canCompare = hasComparableFields(fields.map((field) => field.id))
  const rows: Array<[string, (field: FieldExplorerItem) => string]> = [
    ["Related careers", (field) => field.relatedCareers.map((career) => career.name).join(", ")],
    ["Typical study duration", (field) => field.studyDurationLabel],
    ["Tuition availability", (field) => field.tuitionLabel],
    ["Entry requirements", (field) => field.entryRequirement],
    ["Professional registration", (field) => field.registrationLabel],
    ["Visa relevance", (field) => field.visaRelevanceLabel],
  ]

  return (
    <section id="field-comparison" className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="comparison-heading">
      <h2 id="comparison-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Field comparison</h2>
      {canCompare ? (
        <>
          <div className="mt-5 hidden overflow-hidden rounded-2xl border border-[#e7e6e3] md:grid" style={{ gridTemplateColumns: `minmax(9rem, 1fr) repeat(${fields.length}, minmax(0, 1.35fr))` }}>
            <div className="border-b border-[#e7e6e3] bg-[#fafaf9] px-4 py-4 text-sm font-semibold text-[#4a4842]">Compare</div>
            {fields.map((field) => <div key={field.id} className="border-b border-l border-[#e7e6e3] px-4 py-4 text-sm font-semibold leading-5 text-[#1b1b1b]">{field.name}</div>)}
            {rows.flatMap(([label, getValue]) => [
              <div key={`${label}-label`} className="border-b border-[#e7e6e3] bg-[#fafaf9] px-4 py-3 text-sm font-medium text-[#4a4842]">{label}</div>,
              ...fields.map((field) => <div key={`${label}-${field.id}`} className="border-b border-l border-[#e7e6e3] px-4 py-3 text-sm leading-5 text-[#3a3935]">{getValue(field)}</div>),
            ])}
          </div>
          <div className="mt-4 space-y-3 md:hidden">
            {fields.map((field) => (
              <article key={field.id} className="rounded-xl border border-[#e7e6e3] p-4">
                <h3 className="text-base font-semibold text-[#1b1b1b]">{field.name}</h3>
                <dl className="mt-4 space-y-3">{rows.map(([label, getValue]) => <Fact key={label} term={label} definition={getValue(field)} />)}</dl>
              </article>
            ))}
          </div>
        </>
      ) : (
        <p role="status" className="mt-4 rounded-xl border border-dashed border-[#d8d6d0] px-4 py-3 text-sm leading-6 text-[#6f6d68]">Select at least two fields to compare their details side by side.</p>
      )}
    </section>
  )
}

function RelatedCareers({ fields, onView }: { fields: readonly FieldExplorerItem[]; onView: (careerName: string) => void }) {
  const careers = fields.flatMap((field) => field.relatedCareers.map((career) => ({ ...career, fieldName: field.name }))).slice(0, 6)

  return (
    <section className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="careers-heading">
      <div>
        <h2 id="careers-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Related careers</h2>
        <p className="mt-1 text-sm leading-6 text-[#6f6d68]">Representative occupations connected to the fields selected for comparison.</p>
      </div>
      {careers.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {careers.map((career) => (
            <article key={`${career.fieldName}-${career.id}`} className="rounded-xl border border-[#e7e6e3] bg-[#fafaf9] p-4">
              <p className="text-xs font-semibold text-blue-700">{career.fieldName}</p>
              <h3 className="mt-2 text-base font-semibold text-[#1b1b1b]">{career.name}</h3>
              <p className="mt-2 text-sm leading-5 text-[#5f5d57]">{career.description}</p>
              <p className="mt-3 text-xs font-medium text-[#8a8882]">{career.dataStatus}</p>
              <button type="button" onClick={() => onView(career.name)} className="mt-3 inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2">View occupation</button>
            </article>
          ))}
        </div>
      ) : (
        <p role="status" className="mt-4 text-sm text-[#6f6d68]">Select fields to see their representative occupations.</p>
      )}
    </section>
  )
}

function WhatToConsider({ fixture }: { fixture: FieldExplorerFixture }) {
  return (
    <section className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="consider-heading">
      <h2 id="consider-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">What to consider</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {fixture.considerations.map((item) => (
          <li key={item.title} className="flex gap-3 rounded-xl border border-[#e7e6e3] bg-[#fafaf9] p-3.5">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-blue-700" />
            <span><span className="block text-sm font-semibold text-[#3a3935]">{item.title}</span><span className="mt-0.5 block text-sm leading-5 text-[#6f6d68]">{item.description}</span></span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ChooseField({ chosenField, onChoose }: { chosenField?: FieldExplorerItem; onChoose: () => void }) {
  return (
    <section id="choose-field" className="border-t border-[#e7e6e3] py-7 sm:py-8" aria-labelledby="choose-field-heading">
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e0e8f7] bg-[#f7faff] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h2 id="choose-field-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Choose a field</h2>
          <p className="mt-1 text-sm leading-6 text-[#5f5d57]">{chosenField ? `Selected: ${chosenField.name}. Next, compare programs and schools for this field.` : "Select one field above to continue to program and school comparison."}</p>
        </div>
        <button type="button" disabled={!chosenField} onClick={onChoose} className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#b9c8e2] sm:w-auto">
          Choose this field <ChevronRight className="size-4" />
        </button>
      </div>
    </section>
  )
}
