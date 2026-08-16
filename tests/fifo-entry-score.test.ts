import assert from "node:assert/strict"
import test from "node:test"
import { calculateFifoEntryScore, fifoEntryScoreBand, FIFO_ENTRY_SCORE_WEIGHTS } from "../src/lib/fifo/entry-score"

test("FIFO Entry Score weights total 100 percent", () => {
  const total = Object.values(FIFO_ENTRY_SCORE_WEIGHTS).reduce((sum, value) => sum + value, 0)
  assert.equal(total, 1)
})

test("Driller's Offsider launch evidence produces a Strong score of 80", () => {
  const score = calculateFifoEntryScore({
    pay: 8.5,
    accessibility: 7.5,
    demand: 7.5,
    trainingBurden: 8.5,
  })
  assert.equal(score, 80)
  assert.equal(fifoEntryScoreBand(score), "Strong")
})

test("FIFO Entry Score rejects out-of-range inputs", () => {
  assert.throws(
    () => calculateFifoEntryScore({ pay: 11, accessibility: 5, demand: 5, trainingBurden: 5 }),
    RangeError,
  )
})
