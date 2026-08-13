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

test("Korean landing keeps labels and map navigation in Korean", async ({ page }) => {
  await page.goto("/ko")

  await expect(page.getByText("커리어 신호")).toBeVisible()
  await expect(page.getByText("실시간")).toBeVisible()
  await expect(page.getByText("CAREER SIGNALS")).toHaveCount(0)

  const explore = page.getByRole("link", { name: "아직 정하지 못했나요? 세계를 탐색해보세요." })
  await expect(explore).toHaveAttribute("href", "/ko/maps")
})

test("Korean countries explorer uses localized country UI", async ({ page }) => {
  await page.goto("/ko/countries")

  await expect(page.getByRole("heading", { name: "국가 둘러보기" })).toBeVisible()
  await expect(page.getByRole("searchbox", { name: "국가 검색" })).toHaveAttribute("placeholder", "국가, 통화, 지역 또는 도시 검색…")
  await expect(page.getByText("Explore countries")).toHaveCount(0)
  await expect(page.getByRole("button", { name: /오스트레일리아/ })).toBeVisible()
})

test("Korean occupation explorer keeps its locale while browsing", async ({ page }) => {
  await page.goto("/ko/occupation")

  await expect(page.getByRole("heading", { name: "직업" })).toBeVisible()
  await expect(page.getByPlaceholder("직업 검색, 예: 간호사 또는 전기기사…")).toBeVisible()
  await expect(page.getByText("Start here")).toHaveCount(0)

  await page.getByRole("button", { name: /보건/ }).first().click()
  await expect(page).toHaveURL(/\/ko\/occupation/)
})

test("Korean programs explorer keeps header, search and navigation localized", async ({ page }) => {
  await page.goto("/ko/programs")

  await expect(page.getByRole("heading", { name: "과정" })).toBeVisible()
  await expect(page.getByRole("searchbox", { name: "과정 검색" })).toBeVisible()
  await expect(page.getByText("Explore", { exact: true })).toHaveCount(0)
  await expect(page.getByRole("button", { name: /오스트레일리아/ })).toBeVisible()
})

test("Korean institutions explorer keeps server-rendered UI localized", async ({ page }) => {
  await page.goto("/ko/institutions")

  await expect(page.getByRole("heading", { name: "교육기관" })).toBeVisible()
  await expect(page.getByRole("searchbox", { name: "교육기관 이름 검색" })).toBeVisible()
  await expect(page.getByText("Institutions", { exact: true })).toHaveCount(0)
})
