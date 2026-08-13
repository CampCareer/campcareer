import { expect, test } from "@playwright/test"
import {
  authenticatedClient,
  completeCareerOnboarding,
  provisionAuthE2eUser,
  removeAuthE2eUser,
  signInViaEmail,
  type AuthE2eUser,
} from "./auth-e2e-helpers"

const REGISTERED_NURSE_RESULT = "/career?country=AU&occupation=registered-nurse"

test("signed-out career result survives login, onboarding, save, Home reopen, and Compare", async ({ page }, testInfo) => {
  let user: AuthE2eUser | null = null

  try {
    user = await provisionAuthE2eUser(testInfo)

    await page.goto(REGISTERED_NURSE_RESULT)
    const signIn = page.getByRole("link", { name: "Sign in to see my path" })
    await expect(signIn).toBeVisible()
    await signIn.click()

    await expect(page).toHaveURL(/\/login\?next=/)
    await page.getByLabel("Email").fill(user.email)
    await page.getByLabel("Password").fill(user.password)
    await page.getByRole("button", { name: "Sign in", exact: true }).click()

    await expect(page).toHaveURL(/\/onboarding\?country=AU&occupation=registered-nurse/)
    await completeCareerOnboarding(page)

    await expect(page).toHaveURL(/\/career\?country=AU&occupation=registered-nurse&personalised=1/)
    await expect(page.getByRole("link", { name: "View my path" })).toBeVisible()

    const save = page.getByRole("button", { name: "Save path" })
    await expect(save).toBeVisible()
    await save.click()
    await expect(page.getByRole("button", { name: "Saved" })).toHaveAttribute("aria-pressed", "true")

    await page.goto("/home")
    const savedCareer = page.getByRole("link", { name: /Registered Nurse/i })
    await expect(savedCareer).toBeVisible()
    await savedCareer.click()

    await expect(page).toHaveURL(/\/career\?country=AU&occupation=registered-nurse&personalised=1/)
    await page.getByRole("link", { name: "Compare this career" }).click()
    await expect(page).toHaveURL(/\/compare\?type=career&country=AU&profile=starting-from-scratch&careers=registered-nurse/)
  } finally {
    await removeAuthE2eUser(user)
  }
})

test("completed user re-login preserves the requested career and skips onboarding", async ({ page }, testInfo) => {
  let user: AuthE2eUser | null = null

  try {
    user = await provisionAuthE2eUser(testInfo, { completed: true })
    await signInViaEmail(page, user, REGISTERED_NURSE_RESULT)

    await expect(page).toHaveURL(/\/career\?country=AU&occupation=registered-nurse$/)
    await expect(page).not.toHaveURL(/\/onboarding/)

    const personalised = page.getByRole("link", { name: "View my path" })
    await expect(personalised).toBeVisible()
    await personalised.click()
    await expect(page).toHaveURL(/\/career\?country=AU&occupation=registered-nurse&personalised=1/)
  } finally {
    await removeAuthE2eUser(user)
  }
})

test("saved career RLS keeps one authenticated user's path private from another", async ({}, testInfo) => {
  let owner: AuthE2eUser | null = null
  let stranger: AuthE2eUser | null = null

  try {
    owner = await provisionAuthE2eUser(testInfo, { completed: true })
    stranger = await provisionAuthE2eUser(testInfo, { completed: true })

    const ownerClient = authenticatedClient()
    const { error: ownerSignInError } = await ownerClient.auth.signInWithPassword({
      email: owner.email,
      password: owner.password,
    })
    expect(ownerSignInError).toBeNull()

    const { error: saveError } = await ownerClient.from("saved_career_results").insert({
      user_id: owner.id,
      country_code: "AU",
      career_id: "registered-nurse",
    })
    expect(saveError).toBeNull()

    const strangerClient = authenticatedClient()
    const { error: strangerSignInError } = await strangerClient.auth.signInWithPassword({
      email: stranger.email,
      password: stranger.password,
    })
    expect(strangerSignInError).toBeNull()

    const { data: visibleRows, error: selectError } = await strangerClient
      .from("saved_career_results")
      .select("user_id,country_code,career_id")
      .eq("country_code", "AU")
      .eq("career_id", "registered-nurse")

    expect(selectError).toBeNull()
    expect(visibleRows).toEqual([])
  } finally {
    await removeAuthE2eUser(owner)
    await removeAuthE2eUser(stranger)
  }
})
