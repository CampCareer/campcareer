import { expect, test } from "@playwright/test"

test("FIFO report checkout posts the purchase identity through the server boundary and handles cancel return", async ({ page }) => {
  const captured: { payload: Record<string, unknown> | null } = { payload: null }

  await page.route("**/api/fifo/report/checkout", async (route) => {
    captured.payload = route.request().postDataJSON() as Record<string, unknown>
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

  await expect.poll(() => captured.payload).not.toBeNull()
  expect(captured.payload?.email).toBe("buyer@example.com")
  expect(captured.payload?.marketingConsent).toBe(false)
  expect(captured.payload?.checkoutAttemptId).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  )

  await expect(page).toHaveURL(/checkout\.stripe\.com/)
  await expect(page.getByRole("heading", { name: "Mock Stripe Checkout" })).toBeVisible()
})

test("FIFO checkout failure stays on the guide and exposes a retryable non-PII error", async ({ page }) => {
  await page.route("**/api/fifo/report/checkout", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "checkout_unavailable" }),
    })
  })

  await page.goto("/fifo/report")
  const capture = page.getByTestId("fifo-report-email-capture")
  await capture.getByLabel("Guide delivery email").fill("buyer@example.com")
  await capture.getByRole("button", { name: "Secure checkout · A$29" }).click()

  await expect(capture.getByRole("alert")).toContainText("Checkout could not be started")
  await expect(page).toHaveURL(/\/fifo\/report$/)
  await expect(capture.getByRole("button", { name: "Secure checkout · A$29" })).toBeEnabled()
})

test("FIFO success page never treats a bare URL as proof of payment", async ({ page }) => {
  const response = await page.goto("/fifo/report/success")
  expect(response?.ok()).toBeTruthy()
  await expect(page.getByRole("heading", { name: "We could not verify this checkout return link." })).toBeVisible()
  await expect(page.getByText("No verified order was found", { exact: true })).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, nofollow/i)
})

test("FIFO commerce analytics is consent-gated and contains only low-cardinality state", async ({ context, page }) => {
  const payloads: Array<{ eventName?: string; context?: Record<string, unknown> }> = []

  await page.route("**/api/v1/discovery-events", async (route) => {
    if (route.request().method() === "POST") {
      payloads.push(route.request().postDataJSON() as { eventName?: string; context?: Record<string, unknown> })
    }
    await route.fulfill({ status: 204 })
  })
  await page.route("**/api/fifo/report/checkout", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "checkout_unavailable" }),
    })
  })

  await page.goto("/fifo/report?checkout=cancelled")
  await page.waitForTimeout(300)
  expect(payloads).toEqual([])

  await context.addCookies([
    {
      name: "cc_analytics_consent",
      value: "granted",
      domain: "127.0.0.1",
      path: "/",
    },
  ])
  await page.reload()
  await expect.poll(() => payloads.map((payload) => payload.eventName)).toEqual(
    expect.arrayContaining(["fifo_report_view", "fifo_checkout_cancelled"]),
  )

  const capture = page.getByTestId("fifo-report-email-capture")
  await capture.getByLabel("Guide delivery email").fill("buyer@example.com")
  await capture.getByRole("button", { name: "Secure checkout · A$29" }).click()
  await expect.poll(() => payloads.map((payload) => payload.eventName)).toEqual(
    expect.arrayContaining(["fifo_checkout_started", "fifo_checkout_failed"]),
  )

  for (const payload of payloads) {
    for (const key of Object.keys(payload.context ?? {})) {
      expect(["surface", "locale", "status", "reason"]).toContain(key)
    }
    expect(JSON.stringify(payload.context ?? {})).not.toContain("buyer@example.com")
  }
})

test("FIFO report checkout remains responsive and keyboard-usable on a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/fifo/report")

  const hasNoHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
  )
  expect(hasNoHorizontalOverflow).toBeTruthy()

  const buyLink = page.getByRole("link", { name: "Buy the guide — A$29" }).first()
  await buyLink.focus()
  await expect(buyLink).toBeFocused()
  await buyLink.press("Enter")

  const capture = page.getByTestId("fifo-report-email-capture")
  await expect(capture).toBeInViewport()
  const emailInput = capture.getByLabel("Guide delivery email")
  const marketing = capture.getByRole("checkbox")
  const checkoutButton = capture.getByRole("button", { name: "Secure checkout · A$29" })

  await emailInput.focus()
  await expect(emailInput).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(marketing).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(checkoutButton).toBeFocused()
  await expect(marketing).not.toBeChecked()
})
