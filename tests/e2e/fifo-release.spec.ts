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

test("FIFO launch renders the decision funnel at the active viewport", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByRole("heading", { name: /Find your fastest path into high-paying work/ })).toBeVisible()
  await expect(page.getByRole("link", { name: "Explore FIFO Jobs" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Australia FIFO Entry Report 2026" })).toBeVisible()

  for (const [, name] of VERIFIED_PATHS) {
    await expect(page.getByRole("heading", { name, exact: true })).toBeVisible()
  }

  await page.getByRole("link", { name: "Explore FIFO Jobs" }).click()
  await expect(page).toHaveURL(/\/fifo$/)
  await expect(page.getByRole("heading", { name: /Compare FIFO entry paths before you spend money on training/ })).toBeVisible()

  for (const [, name] of [...VERIFIED_PATHS, ...RESEARCHING_PATHS]) {
    await expect(page.getByRole("heading", { name, exact: true })).toBeVisible()
  }
})

test("verified FIFO pages render and remain indexable", async ({ page }) => {
  for (const [slug, name] of VERIFIED_PATHS) {
    const response = await page.goto(`/fifo/${slug}`)
    expect(response?.ok()).toBeTruthy()
    await expect(page.getByRole("heading", { name, exact: true })).toBeVisible()
    await expect(page.getByText(/VERIFIED · 2026/).first()).toBeVisible()
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index, follow/i)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/fifo/${slug}$`))
  }
})

test("researching FIFO pages render but stay out of the index", async ({ page }) => {
  for (const [slug, name] of RESEARCHING_PATHS) {
    const response = await page.goto(`/fifo/${slug}`)
    expect(response?.ok()).toBeTruthy()
    await expect(page.getByRole("heading", { name, exact: true })).toBeVisible()
    await expect(page.getByText("This path is not rated yet.", { exact: true })).toBeVisible()
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/i)
  }
})

test("FIFO sitemap exposes only the hub and verified paths", async ({ request }) => {
  const response = await request.get("/fifo/sitemap.xml")
  expect(response.ok()).toBeTruthy()
  const xml = await response.text()

  expect(xml).toContain("https://www.campcareer.com/fifo")
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

  await page.getByRole("link", { name: "See the 2026 FIFO Report" }).click()
  await expect(page).toHaveURL(/#fifo-report$/)
  await expect.poll(() => eventNames).toContain("fifo_report_cta_clicked")
})
