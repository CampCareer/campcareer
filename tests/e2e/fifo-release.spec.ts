import { expect, test } from "@playwright/test"

const VERIFIED_PATHS = [
  ["drillers-offsider", "Driller's Offsider"],
  ["dump-truck-operator", "Dump Truck Operator"],
  ["scaffolder", "Scaffolder"],
  ["rigger", "Rigger"],
] as const

const RESEARCHING_PATHS = [
  ["plant-operator", "Plant Operator"],
  ["excavator-operator", "Excavator Operator"],
  ["loader-operator", "Loader Operator"],
] as const

const REPORT_PREVIEWS = [
  "Actual FIFO guide page showing Jobs You Can Actually Target",
  "Actual FIFO guide page showing The FIFO Ticket Map",
  "Actual FIFO guide page showing Fastest Entry Pathways",
  "Actual FIFO guide page showing What Employers Are Actually Asking For",
] as const

test("FIFO launch renders the decision funnel at the active viewport", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByRole("heading", { name: /Find your fastest path into high-paying work/ })).toBeVisible()
  await expect(page.getByRole("link", { name: "Explore FIFO Jobs" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "FIFO Construction Fast Entry Guide 2026" })).toBeVisible()
  await expect(page.getByText("EDITION 1.0 · COMPLETE", { exact: true })).toBeVisible()
  await expect(page.getByText("A$29", { exact: true })).toBeVisible()
  await expect(page.getByText(/23 pages · Western Australia · Data reviewed 16 Aug 2026/).first()).toBeVisible()
  await expect(page.getByText("COMING SOON", { exact: true })).toHaveCount(0)
  await expect(page.getByRole("link", { name: "See the 2026 FIFO Guide" })).toHaveAttribute("href", "/fifo/report")

  for (const [, name] of VERIFIED_PATHS) {
    await expect(page.getByRole("heading", { name, exact: true })).toBeVisible()
  }

  await page.getByRole("link", { name: "Explore FIFO Jobs" }).click()
  await expect(page).toHaveURL(/\/fifo$/)
  await expect(page).toHaveTitle("Australia FIFO Jobs & Entry Paths | CampCareer")
  await expect(page.getByRole("heading", { name: /Compare FIFO entry paths before you spend money on training/ })).toBeVisible()
  await expect(page.getByTestId("fifo-hub-report-bridge")).toBeVisible()
  await expect(page.getByTestId("fifo-hub-report-bridge").getByRole("link")).toHaveAttribute("href", "/fifo/report")

  for (const [, name] of [...VERIFIED_PATHS, ...RESEARCHING_PATHS]) {
    await expect(page.getByRole("heading", { name, exact: true })).toBeVisible()
  }
})

test("FIFO guide sales page renders the completed product and actual PDF previews without opening checkout early", async ({ page }) => {
  const response = await page.goto("/fifo/report")
  expect(response?.ok()).toBeTruthy()
  await expect(page).toHaveTitle("FIFO Construction Fast Entry Guide 2026 | CampCareer")
  await expect(page.getByRole("heading", { name: "FIFO Construction Fast Entry Guide 2026", exact: true })).toBeVisible()
  await expect(page.getByText("Complete digital guide", { exact: true })).toBeVisible()
  await expect(page.getByRole("img", { name: "FIFO Construction Fast Entry Guide 2026 actual cover" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "See real pages from the finished Edition 1.0." })).toBeVisible()
  await expect(page.getByText(/rendered directly from the completed 23-page PDF/)).toBeVisible()
  for (const alt of REPORT_PREVIEWS) {
    await expect(page.getByRole("img", { name: alt })).toBeVisible()
  }
  await expect(page.getByText("Actual page · P.4", { exact: true })).toBeVisible()
  await expect(page.getByText("Actual page · P.6", { exact: true })).toBeVisible()
  await expect(page.getByText("Actual page · P.8", { exact: true })).toBeVisible()
  await expect(page.getByText("Actual page · P.14", { exact: true })).toBeVisible()
  await expect(page.getByText("Role → Tickets → Application strategy", { exact: true })).toBeVisible()
  await expect(page.getByText("95%", { exact: true })).toBeVisible()
  await expect(page.getByText("A$100–120", { exact: true })).toBeVisible()
  await expect(page.getByRole("button", { name: "Buy the guide — A$29" })).toBeDisabled()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index, follow/i)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/fifo\/report$/)
})

test("verified FIFO pages render, remain indexable and hand off to the guide", async ({ page }) => {
  for (const [slug, name] of VERIFIED_PATHS) {
    const response = await page.goto(`/fifo/${slug}`)
    expect(response?.ok()).toBeTruthy()
    await expect(page).toHaveTitle(`${name} FIFO Entry Path Australia | CampCareer`)
    await expect(page.getByRole("heading", { name, exact: true })).toBeVisible()
    await expect(page.getByText(/VERIFIED · 2026/).first()).toBeVisible()
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index, follow/i)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/fifo/${slug}$`))
    const reportBridge = page.getByTestId("fifo-context-report-cta")
    await expect(reportBridge).toBeVisible()
    await expect(reportBridge.getByRole("link")).toHaveAttribute("href", "/fifo/report")
  }
})

test("researching FIFO pages render, stay out of the index and still explain the guide handoff", async ({ page }) => {
  for (const [slug, name] of RESEARCHING_PATHS) {
    const response = await page.goto(`/fifo/${slug}`)
    expect(response?.ok()).toBeTruthy()
    await expect(page).toHaveTitle(`${name} FIFO Entry Path Australia | CampCareer`)
    await expect(page.getByRole("heading", { name, exact: true })).toBeVisible()
    await expect(page.getByText("This path is not rated yet.", { exact: true })).toBeVisible()
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
    const reportBridge = page.getByTestId("fifo-context-report-cta")
    await expect(reportBridge).toBeVisible()
    await expect(reportBridge.getByRole("link")).toHaveAttribute("href", "/fifo/report")
  }
})

test("FIFO sitemap exposes the hub, guide and verified paths only", async ({ request }) => {
  const response = await request.get("/fifo/sitemap.xml")
  expect(response.ok()).toBeTruthy()
  const xml = await response.text()

  expect(xml).toContain("https://www.campcareer.com/fifo")
  expect(xml).toContain("https://www.campcareer.com/fifo/report")
  for (const [slug] of VERIFIED_PATHS) {
    expect(xml).toContain(`https://www.campcareer.com/fifo/${slug}`)
  }
  for (const [slug] of RESEARCHING_PATHS) {
    expect(xml).not.toContain(`https://www.campcareer.com/fifo/${slug}`)
  }
})

test("FIFO analytics stays silent without consent and emits the funnel after consent", async ({ context, page }) => {
  const eventNames: string[] = []
  page.on("request", (request) => {
    if (request.method() !== "POST" || !request.url().includes("/api/v1/discovery-events")) return
    try {
      const payload = request.postDataJSON() as { eventName?: string }
      if (payload.eventName) eventNames.push(payload.eventName)
    } catch {
      // Ignore malformed/non-JSON requests. The endpoint contract is asserted below.
    }
  })

  await page.goto("/")
  await expect(page.getByRole("heading", { name: /Find your fastest path into high-paying work/ })).toBeVisible()
  await page.waitForTimeout(400)
  expect(eventNames).toEqual([])

  await context.addCookies([
    {
      name: "cc_analytics_consent",
      value: "granted",
      domain: "127.0.0.1",
      path: "/",
    },
  ])
  await page.reload()
  await expect.poll(() => eventNames).toContain("fifo_landing_view")

  await page.getByRole("link", { name: "Explore FIFO Jobs" }).click()
  await expect(page).toHaveURL(/\/fifo$/)
  await expect.poll(() => eventNames).toEqual(expect.arrayContaining(["fifo_hub_opened", "fifo_hub_view"]))

  await page.getByRole("link", { name: "See the evidence" }).first().click()
  await expect(page).toHaveURL(/\/fifo\/drillers-offsider$/)
  await expect.poll(() => eventNames).toEqual(expect.arrayContaining(["fifo_path_opened", "fifo_path_view"]))

  const reportBridge = page.getByTestId("fifo-context-report-cta")
  await reportBridge.getByRole("link").click()
  await expect(page).toHaveURL(/\/fifo\/report$/)
  await expect.poll(() => eventNames).toContain("fifo_report_cta_clicked")
})
