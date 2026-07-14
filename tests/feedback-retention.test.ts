import assert from "node:assert/strict"
import test from "node:test"
import {
  feedbackScreenshotReference,
  isAuthorizedFeedbackRetentionRequest,
} from "../src/lib/feedback-retention"

const screenshotPath = "uploads/2026/07/123e4567-e89b-42d3-a456-426614174000.png"

test("feedback retention accepts only canonical private screenshot references", () => {
  assert.deepEqual(
    feedbackScreenshotReference({ id: "row", screenshot_bucket: "feedback-screenshots", screenshot_path: screenshotPath }),
    { bucket: "feedback-screenshots", path: screenshotPath },
  )
  assert.equal(
    feedbackScreenshotReference({ id: "forged", screenshot_bucket: "other-bucket", screenshot_path: screenshotPath }),
    null,
  )
})

test("feedback retention can remove the temporary legacy metadata reference", () => {
  assert.deepEqual(
    feedbackScreenshotReference({
      id: "legacy",
      metadata: { screenshot: { bucket: "feedback-screenshots", path: screenshotPath } },
    }),
    { bucket: "feedback-screenshots", path: screenshotPath },
  )
})

test("feedback retention requires the production cron bearer secret", () => {
  assert.equal(isAuthorizedFeedbackRetentionRequest("Bearer expected", "expected"), true)
  assert.equal(isAuthorizedFeedbackRetentionRequest("Bearer wrong", "expected"), false)
  assert.equal(isAuthorizedFeedbackRetentionRequest("Bearer expected", undefined), false)
})
