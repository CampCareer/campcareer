import { expect, test } from "@playwright/test"

const OPTIONAL_MEASUREMENT_COOKIES = [
  "cc_sid",
  "cc_first_path",
  "cc_utm_source",
  "cc_utm_medium",
  "cc_utm_campaign",
  "cc_utm_term",
  "cc_utm_content",
]

test("a new visitor can decline optional measurement without receiving measurement cookies", async ({ context, page }) => {
  await page.goto("/privacy")

  await expect(page.getByRole("complementary", { name: "Privacy choices" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Read the Privacy Policy" })).toHaveAttribute("href", "/privacy#cookies-and-measurement")
  await page.getByRole("button", { name: "Use essential only" }).click()

  await expect(page.getByRole("complementary", { name: "Privacy choices" })).toBeHidden()
  const cookies = await context.cookies()
  expect(cookies.find((cookie) => cookie.name === "cc_analytics_consent")?.value).toBe("denied")
  expect(cookies.map((cookie) => cookie.name)).not.toEqual(expect.arrayContaining(OPTIONAL_MEASUREMENT_COOKIES))
})

test("a consenting visitor receives only the documented measurement cookies", async ({ context, page }) => {
  await page.goto("/privacy?utm_source=privacy-test&utm_campaign=consent")
  await page.getByRole("button", { name: "Allow measurement" }).click()
  await expect(page.getByRole("complementary", { name: "Privacy choices" })).toBeHidden()

  await expect.poll(async () => (await context.cookies()).map((cookie) => cookie.name)).toEqual(expect.arrayContaining(["cc_analytics_consent", "cc_sid", "cc_first_path", "cc_utm_source", "cc_utm_campaign"]))
  const cookies = await context.cookies()
  expect(cookies.find((cookie) => cookie.name === "cc_analytics_consent")?.value).toBe("granted")
  expect(decodeURIComponent(cookies.find((cookie) => cookie.name === "cc_first_path")?.value ?? "")).toBe("/privacy")
  expect(cookies.find((cookie) => cookie.name === "cc_utm_source")?.value).toBe("privacy-test")
  expect(cookies.find((cookie) => cookie.name === "cc_utm_campaign")?.value).toBe("consent")
})
