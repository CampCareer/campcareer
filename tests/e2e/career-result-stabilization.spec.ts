import { expect, test } from "@playwright/test"

test("AU Software Developer result keeps its career context when opening Compare", async ({ page }) => {
  await page.goto("/career?country=AU&occupation=software-developer")

  const compare = page.getByRole("link", { name: "Compare this career" })
  await expect(compare).toBeVisible()
  await compare.click()

  await expect(page).toHaveURL(/\/compare\?type=career&country=AU&profile=starting-from-scratch&careers=software-engineer/)
})

test("signed-out career result sends personalisation through login without losing context", async ({ page }) => {
  await page.goto("/career?country=AU&occupation=registered-nurse")

  const personalise = page.getByRole("link", { name: "Sign in to see my path" })
  await expect(personalise).toBeVisible()

  const href = await personalise.getAttribute("href")
  expect(href).toContain("/login?next=")
  expect(decodeURIComponent(href ?? "")).toContain("/onboarding?country=AU&occupation=registered-nurse")
})

test("signed-out save returns to the same career result after login", async ({ page }) => {
  await page.goto("/career?country=AU&occupation=registered-nurse")

  const save = page.getByRole("link", { name: "Save path" })
  await expect(save).toBeVisible()

  const href = await save.getAttribute("href")
  expect(href).toContain("/login?next=")
  expect(decodeURIComponent(href ?? "")).toContain("/career?country=AU&occupation=registered-nurse")
})

test("Korean login keeps the authentication surface and saved pathway summary in Korean", async ({ page }) => {
  const next = encodeURIComponent("/ko/home?origin=KR&country=AU&field=health&status=choosing-school")
  await page.goto(`/ko/login?next=${next}`)

  await expect(page.getByRole("heading", { name: "다시 오신 것을 환영해요" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Google로 계속하기" })).toBeVisible()
  await expect(page.getByLabel("이메일")).toBeVisible()
  await expect(page.getByLabel("비밀번호", { exact: true })).toBeVisible()
  await expect(page.getByRole("button", { name: "비밀번호를 잊으셨나요?" })).toBeVisible()
  await expect(page.getByText("이 경로 저장하기")).toBeVisible()
  await expect(page.getByText("대한민국 → 오스트레일리아 · 보건·돌봄 · 프로그램 선택 중")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Welcome back" })).toHaveCount(0)

  await page.getByRole("button", { name: "비밀번호를 잊으셨나요?" }).click()
  await expect(page.getByRole("alert")).toHaveText("먼저 이메일을 입력해 주세요.")
})
