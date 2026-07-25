"use client"

import { useCallback, useMemo, useState } from "react"
import { STUDY_CATEGORIES } from "@/data/study-concepts"
import {
  type AuPathfinderCategory,
  type AuPathfinderGoal,
  type AuPathfinderProfile,
  type AuPathfinderStudyStage,
  DEFAULT_AU_PATHFINDER_PROFILE,
} from "@/lib/au-pathfinder"

export type WizardStep = "category" | "goals" | "branch" | "schools" | "generating" | "plan"

export type SchoolData = {
  college_id: string
  college_name: string
  college_state: string
  college_city?: string | null
  tuition?: number | null
  median_earnings?: number | null
  employment_rate?: number | null
  roi_score?: number | null
  payback_years?: number | null
}

export type WizardState = {
  step: WizardStep
  category: AuPathfinderCategory | "any"
  goal: AuPathfinderGoal
  studyStage: AuPathfinderStudyStage
  selectedMajor: string | null
  selectedConcept: string | null
  wantsSchool: boolean
  selectedSchool: string | null
  selectedSchoolData: SchoolData | null
}

const INITIAL_STATE: WizardState = {
  step: "category",
  category: "any",
  goal: DEFAULT_AU_PATHFINDER_PROFILE.goal,
  studyStage: DEFAULT_AU_PATHFINDER_PROFILE.studyStage,
  selectedMajor: null,
  selectedConcept: null,
  wantsSchool: false,
  selectedSchool: null,
  selectedSchoolData: null,
}

const STEP_ORDER: WizardStep[] = ["category", "goals", "branch", "schools", "generating", "plan"]

export function useWizardState() {
  const [state, setState] = useState<WizardState>(INITIAL_STATE)

  const goToStep = useCallback((step: WizardStep) => {
    setState((prev) => ({ ...prev, step }))
  }, [])

  const selectCategory = useCallback((category: AuPathfinderCategory | "any") => {
    setState((prev) => ({ ...prev, category, selectedConcept: null, step: "goals" }))
  }, [])

  const selectConcept = useCallback((conceptId: string, category: AuPathfinderCategory) => {
    setState((prev) => ({ ...prev, category, selectedConcept: conceptId, step: "goals" }))
  }, [])

  const selectMajor = useCallback((conceptId: string) => {
    setState((prev) => ({ ...prev, selectedConcept: conceptId, step: "branch" }))
  }, [])

  const selectGoal = useCallback((goal: AuPathfinderGoal) => {
    setState((prev) => ({ ...prev, goal }))
  }, [])

  const selectStudyStage = useCallback((studyStage: AuPathfinderStudyStage) => {
    setState((prev) => ({ ...prev, studyStage }))
  }, [])

  const confirmGoals = useCallback(() => {
    setState((prev) => ({ ...prev, step: "branch" }))
  }, [])

  const chooseSchoolPath = useCallback(() => {
    setState((prev) => ({ ...prev, wantsSchool: true, step: "schools" }))
  }, [])

  const chooseDirectPlan = useCallback(() => {
    setState((prev) => ({ ...prev, wantsSchool: false, step: "generating" }))
  }, [])

  const selectSchool = useCallback((school: string, schoolData?: SchoolData) => {
    setState((prev) => ({ ...prev, selectedSchool: school, selectedSchoolData: schoolData ?? null, step: "generating" }))
  }, [])

  const goToPrevious = useCallback(() => {
    setState((prev) => {
      const currentIndex = STEP_ORDER.indexOf(prev.step)
      if (currentIndex <= 0) return prev
      return { ...prev, step: STEP_ORDER[currentIndex - 1] }
    })
  }, [])

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  const profile: AuPathfinderProfile = useMemo(() => ({
    goal: state.goal,
    budget: DEFAULT_AU_PATHFINDER_PROFILE.budget,
    timeline: DEFAULT_AU_PATHFINDER_PROFILE.timeline,
    studyStage: state.studyStage,
    category: state.category,
  }), [state.goal, state.studyStage, state.category])

  const stepIndex = STEP_ORDER.indexOf(state.step)
  const totalSteps = 3 // category, goals, branch — core decision steps

  return useMemo(() => ({
    state,
    profile,
    stepIndex,
    totalSteps,
    goToStep,
    selectCategory,
    selectConcept,
    selectMajor,
    selectGoal,
    selectStudyStage,
    confirmGoals,
    chooseSchoolPath,
    chooseDirectPlan,
    selectSchool,
    goToPrevious,
    reset,
  }), [
    state, profile, stepIndex, totalSteps,
    goToStep, selectCategory, selectConcept, selectMajor, selectGoal, selectStudyStage,
    confirmGoals, chooseSchoolPath, chooseDirectPlan, selectSchool,
    goToPrevious, reset,
  ])
}

export type WizardActions = ReturnType<typeof useWizardState>
