import { expect, test } from "@playwright/test"

test("FIFO report checkout posts the purchase identity through the server boundary and handles cancel return", async ({ page }) => {
  let checkoutPayload: Record<string, unknown> | null = null

  await page.route("**/api/fifo/report/checkout", async (route) => {
    checkoutPayload = route.request().postDataJSON() as Record<string, unknown>
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        checkoutSessionId: "cs_test_browser_gate",
        checkoutUrl: "https://checkout.stripe.com/c/pay/cs_test_browser_gate",
      }),
    })
  })

  await page.route("https://checkout.stripe.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<html><body><h1>Mock Stripe Checkout</h1></body></html>",
    })
  })

  await page.goto("/fifo/report?checkout=cancelled")
  const capture = page.getByTestId("fifo-report-email-capture")
  await expect(capture.getByRole("status")).toContainText("previous Checkout ended before completion")

  await capture.getByLabel("Guide delivery email").fill("Buyer@Example.COM")
  await expect(capture.getByRole("checkbox")).not.toBeChecked()
  await capture.getByRole("button", { name: "Secure checkout · A$29" }).click()

  await expect.poll(() => checkoutPayload).not.toBeNull()
  expect(checkoutPayload?.email).toBe("buyer@example.com")
  expect(checkoutPayload?.marketingConsent).toBe(false)
  expect(checkoutPayload?.checkoutAttemptId).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  )

  await expect(page).toHaveURL(/checkout\.stripe\.com/)
  await expect(page.getByRole("heading", { name: "Mock Stripe Checkout" })).toBeVisible()
})

test("FIFO success page never treats a bare URL as proof of payment", async ({ page }) => {
  const response = await page.goto("/fifo/report/success")
  expect(response?.ok()).toBeTruthy()
  await expect(page.getByRole("heading", { name: "We could not verify this checkout return link." })).toBeVisible()
  await expect(page.getByText("No verified order was found", { exact: true })).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, nofollow/i)
})
