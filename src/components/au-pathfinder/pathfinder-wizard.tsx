"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useWizardState } from "./wizard-state"
import { WizardStepIndicator } from "./wizard/wizard-step-indicator"
import { StepCategory } from "./wizard/step-category"
import { StepGoals } from "./wizard/step-goals"
import { StepBranch } from "./wizard/step-branch"
import { StepSchools } from "./wizard/step-schools"
import { StepGenerating } from "./wizard/step-generating"
import { StepPlan } from "./wizard/step-plan"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { FeaturedMajors } from "@/components/landing/featured-majors"
import { HowItWorks } from "@/components/landing/how-it-works"
import { LoginCta } from "@/components/landing/login-cta"

export function PathfinderWizard() {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const pathLocale = isKo ? "ko" : "en"
  const w = useWizardState()
  const { state } = w
  const [started, setStarted] = useState(false)

  return (
    <main className="min-h-screen bg-slate-50">
      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-600 via-blue-500 to-slate-50">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-slate-50" />
              <div className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-center"
                >
                  <h1 className="mx-auto max-w-lg text-4xl font-bold tracking-tight text-white drop-shadow-sm sm:text-5xl">
                    {isKo
                      ? "전공 선택, 더 이상\n감이 아닌 데이터로"
                      : "Choose your major\nwith data, not guesswork"}
                  </h1>
                  <motion.button
                    type="button"
                    onClick={() => setStarted(true)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-10 inline-flex items-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-lg shadow-black/10 transition hover:bg-blue-50"
                  >
                    {isKo ? "시작하기" : "Get started"}
                    <span className="text-sm opacity-60">→</span>
                  </motion.button>
                </motion.div>
              </div>
            </section>

            {/* Data showcase */}
            <FeaturedMajors locale={pathLocale} />

            {/* How it works */}
            <HowItWorks locale={pathLocale} />

            {/* Login CTA */}
            <LoginCta locale={pathLocale} />
          </motion.div>
        ) : (
          <motion.div
            key="wizard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero header — step indicator */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="relative overflow-hidden bg-gradient-to-b from-blue-600 via-blue-500 to-slate-50"
            >
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-slate-50" />
              <div className="relative z-10 mx-auto max-w-7xl px-4 pt-5 pb-20 sm:px-6 sm:pt-6 sm:pb-24">
                <div className="flex justify-center">
                  <WizardStepIndicator
                    currentStep={state.step}
                    isKo={isKo}
                  />
                </div>
              </div>
            </motion.section>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={state.step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {state.step === "category" && (
                  <StepCategory
                    isKo={isKo}
                    onSelect={w.selectCategory}
                    onSelectConcept={w.selectConcept}
                  />
                )}
                {state.step === "goals" && (
                  <StepGoals
                    profile={w.profile}
                    isKo={isKo}
                    locale={pathLocale}
                    goal={state.goal}
                    studyStage={state.studyStage}
                    selectedConcept={state.selectedConcept}
                    onSelectGoal={w.selectGoal}
                    onSelectStage={w.selectStudyStage}
                    onSelectMajor={w.selectMajor}
                    onConfirm={w.confirmGoals}
                    onBack={w.goToPrevious}
                  />
                )}
                {state.step === "branch" && (
                  <StepBranch
                    profile={w.profile}
                    isKo={isKo}
                    selectedConcept={state.selectedConcept}
                    onSchoolPath={w.chooseSchoolPath}
                    onDirectPlan={w.chooseDirectPlan}
                    onBack={w.goToPrevious}
                  />
                )}
                {state.step === "schools" && (
                  <StepSchools
                    profile={w.profile}
                    isKo={isKo}
                    selectedConcept={state.selectedConcept}
                    onSelectSchool={w.selectSchool}
                    onBack={w.goToPrevious}
                  />
                )}
                {state.step === "generating" && (
                  <StepGenerating isKo={isKo} onComplete={() => w.goToStep("plan")} />
                )}
                {state.step === "plan" && (
                  <StepPlan
                    profile={w.profile}
                    isKo={isKo}
                    locale={pathLocale}
                    wantsSchool={state.wantsSchool}
                    selectedConcept={state.selectedConcept}
                    selectedSchool={state.selectedSchool}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
