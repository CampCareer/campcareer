import { randomUUID } from "node:crypto"
import type { Page, TestInfo } from "@playwright/test"
import { createClient } from "@supabase/supabase-js"

export type AuthE2eUser = {
  id: string
  email: string
  password: string
}

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required for authenticated E2E tests`)
  return value
}

function adminClient() {
  return createClient(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    },
  )
}

export function authenticatedClient() {
  return createClient(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    },
  )
}

export async function provisionAuthE2eUser(
  testInfo: TestInfo,
  options: { completed?: boolean; targetOccupation?: string } = {},
): Promise<AuthE2eUser> {
  const admin = adminClient()
  const suffix = `${testInfo.project.name}-${testInfo.workerIndex}-${randomUUID()}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
  const email = `campcareer-e2e-${suffix}@example.test`
  const password = `CampCareer-E2E-${randomUUID()}!`

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error || !data.user) {
    throw error ?? new Error("Supabase did not return the provisioned E2E user")
  }

  if (options.completed) {
    const { error: preferenceError } = await admin.from("user_preferences").upsert({
      id: data.user.id,
      citizenship_country: "KR",
      target_country: "AU",
      target_occupation: options.targetOccupation ?? "registered-nurse",
      relevant_experience_years: 0,
      degree_level: "bachelor",
      english_level: "working",
      study_path_available: true,
      career_personalisation_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    if (preferenceError) throw preferenceError
  }

  return { id: data.user.id, email, password }
}

export async function removeAuthE2eUser(user: AuthE2eUser | null) {
  if (!user) return
  const { error } = await adminClient().auth.admin.deleteUser(user.id)
  if (error) throw error
}

export async function signInViaEmail(page: Page, user: AuthE2eUser, nextPath: string) {
  await page.goto(`/login?next=${encodeURIComponent(nextPath)}`)
  await page.getByLabel("Email").fill(user.email)
  await page.getByLabel("Password").fill(user.password)
  await page.getByRole("button", { name: "Sign in", exact: true }).click()
}

export async function completeCareerOnboarding(page: Page) {
  await page.getByRole("textbox", { name: "Search for your country" }).fill("Korea")
  await page.getByRole("button", { name: /South Korea/i }).click()
  await page.getByRole("button", { name: "Continue" }).click()

  await page.getByRole("button", { name: "No relevant experience" }).click()
  await page.getByRole("button", { name: "Continue" }).click()

  await page.getByRole("button", { name: "Bachelor’s degree" }).click()
  await page.getByRole("button", { name: "Continue" }).click()

  await page.getByRole("button", { name: "Working proficiency" }).click()
  await page.getByRole("button", { name: "Continue" }).click()

  await page.getByRole("button", { name: "Yes, I can" }).click()
  await page.getByRole("button", { name: "Go to my home" }).click()
}
