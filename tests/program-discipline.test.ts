import assert from "node:assert/strict"
import test from "node:test"
import { getProgramDiscipline } from "../src/lib/programs/program-discipline"

test("program discipline uses specific course subjects before broad fields", () => {
  assert.deepEqual(
    getProgramDiscipline({
      title: "Bachelor of Nursing",
      fieldName: "Health",
      broadField: "06 - Health",
    }),
    { emoji: "🩺", label: "Nursing" },
  )

  assert.deepEqual(
    getProgramDiscipline({
      title: "Bachelor of Architectural Design",
      fieldName: "Creative design",
      broadField: "10 - Creative Arts",
    }),
    { emoji: "🏗️", label: "Architecture and building" },
  )
})

test("program discipline recognises common career-oriented subjects", () => {
  assert.equal(getProgramDiscipline({ title: "Master of Cyber Security" }).emoji, "💻")
  assert.equal(getProgramDiscipline({ title: "Bachelor of Engineering" }).emoji, "⚙️")
  assert.equal(getProgramDiscipline({ title: "Juris Doctor" }).emoji, "⚖️")
  assert.equal(getProgramDiscipline({ title: "Master of Business Analytics" }).emoji, "📊")
})

test("program discipline falls back to the official broad field", () => {
  assert.deepEqual(
    getProgramDiscipline({
      title: "Advanced Studies",
      broadField: "10 - Creative Arts",
    }),
    { emoji: "🎨", label: "Creative arts" },
  )
})

test("program discipline uses a neutral fallback when no subject is available", () => {
  assert.deepEqual(getProgramDiscipline({ title: "Foundation Program" }), {
    emoji: "🎓",
    label: "Study program",
  })
})
