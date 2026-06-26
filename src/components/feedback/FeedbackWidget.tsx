"use client"

import { useState, useRef, useCallback } from "react"
import { X, ChevronLeft, AlertCircle, Upload } from "lucide-react"
import Link from "next/link"

type Step = "home" | "report" | "suggest"
type IssueCategory =
  | ""
  | "Recover account/password"
  | "Manage profile information"
  | "Secure a hacked account"
  | "Verify account"
  | "Delete account"
  | "Other"

const ISSUE_OPTIONS: { value: IssueCategory; label: string }[] = [
  { value: "Recover account/password", label: "Recover account/password" },
  { value: "Manage profile information", label: "Manage profile information" },
  { value: "Secure a hacked account", label: "Secure a hacked account" },
  { value: "Verify account", label: "Verify account" },
  { value: "Delete account", label: "Delete account" },
  { value: "Other", label: "Other" },
]

function SensitiveInfoTooltip() {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="ml-1 inline-flex items-center text-slate-400 hover:text-slate-600 transition-colors"
      >
        <AlertCircle className="h-3.5 w-3.5" />
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-lg z-50">
          Sensitive information is any data that should be protected. For example, don&apos;t include passwords, credit card numbers, and personal details.
        </div>
      )}
    </span>
  )
}

function ReportIssueForm({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<IssueCategory>("")
  const [description, setDescription] = useState("")
  const [emailConsent, setEmailConsent] = useState(false)
  const [sending, setSending] = useState(false)

  const canSend = description.trim().length > 0 && category !== ""

  const handleSend = useCallback(async () => {
    if (!canSend || sending) return
    setSending(true)
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "issue",
          category,
          description: description.trim(),
          emailConsent,
        }),
      })
      onClose()
    } catch {
      setSending(false)
    }
  }, [canSend, sending, category, description, emailConsent, onClose])

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-slate-700">
          When you noticed this issue, what were you trying to do? <span className="text-red-500">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as IssueCategory)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Choose an option</option>
          {ISSUE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">
          Describe your issue <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us what happened and what&apos;s not working"
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
      </div>
      <div className="flex items-center gap-1 text-xs text-slate-400">
        <span>Please don&apos;t include any sensitive information</span>
        <SensitiveInfoTooltip />
      </div>
      <label className="flex items-start gap-2 text-xs text-slate-500">
        <input
          type="checkbox"
          checked={emailConsent}
          onChange={(e) => setEmailConsent(e.target.checked)}
          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        We may email you for more information or updates
      </label>
      <p className="text-[11px] text-slate-400 leading-relaxed">
        Some account and system information may be sent to CampCareer. We will use it to fix problems and improve our services, subject to our{" "}
        <Link href="/privacy" className="underline hover:text-slate-600" target="_blank">Privacy Policy</Link>, and{" "}
        <Link href="/terms" className="underline hover:text-slate-600" target="_blank">Terms of Service</Link>.
        We may email you for more information or updates. Go to{" "}
        <Link href="/privacy" className="underline hover:text-slate-600" target="_blank">Legal Help</Link> to ask for content changes for legal reasons.
      </p>
      <button
        type="button"
        onClick={handleSend}
        disabled={!canSend || sending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        {sending ? "Sending..." : "Send"}
      </button>
    </div>
  )
}

function SuggestIdeaForm({ onClose }: { onClose: () => void }) {
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [emailConsent, setEmailConsent] = useState(false)
  const [sending, setSending] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const canSend = description.trim().length > 0

  const handleSend = useCallback(async () => {
    if (!canSend || sending) return
    setSending(true)
    try {
      let screenshot: string | null = null
      if (file) {
        screenshot = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "suggestion",
          description: description.trim(),
          emailConsent,
          screenshot,
        }),
      })
      onClose()
    } catch {
      setSending(false)
    }
  }, [canSend, sending, description, file, emailConsent, onClose])

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-slate-700">
          Describe your suggestion <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us how we can improve our product"
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
      </div>
      <div className="flex items-center gap-1 text-xs text-slate-400">
        <span>Please don&apos;t include any sensitive information</span>
        <SensitiveInfoTooltip />
      </div>
      <div>
        <p className="mb-1 text-xs text-slate-500">A photo will help us better understand your idea.</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Upload className="h-4 w-4" />
          {file ? file.name : "Upload a photo"}
        </button>
      </div>
      <label className="flex items-start gap-2 text-xs text-slate-500">
        <input
          type="checkbox"
          checked={emailConsent}
          onChange={(e) => setEmailConsent(e.target.checked)}
          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        We may email you for more information or updates
      </label>
      <p className="text-[11px] text-slate-400 leading-relaxed">
        Some account and system information may be sent to CampCareer. We will use it to fix problems and improve our services, subject to our{" "}
        <Link href="/privacy" className="underline hover:text-slate-600" target="_blank">Privacy Policy</Link>, and{" "}
        <Link href="/terms" className="underline hover:text-slate-600" target="_blank">Terms of Service</Link>.
        We may email you for more information or updates. Go to{" "}
        <Link href="/privacy" className="underline hover:text-slate-600" target="_blank">Legal Help</Link> to ask for content changes for legal reasons.
      </p>
      <button
        type="button"
        onClick={handleSend}
        disabled={!canSend || sending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        {sending ? "Sending..." : "Send"}
      </button>
    </div>
  )
}

export function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("home")

  const handleOpen = useCallback(() => {
    setOpen(true)
    setStep("home")
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    setStep("home")
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="hover:text-slate-600 transition-colors"
      >
        Feedback
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                {step !== "home" && (
                  <button
                    type="button"
                    onClick={() => setStep("home")}
                    className="-ml-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                )}
                <h2 className="text-sm font-semibold text-slate-900">Send feedback to CampCareer</h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="-mr-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-4">
              {step === "home" && (
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setStep("report")}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-300"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 text-xs font-bold">!</span>
                    Report an issue
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("suggest")}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-300"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 text-base">+</span>
                    Suggest an idea
                  </button>
                </div>
              )}
              {step === "report" && <ReportIssueForm onClose={handleClose} />}
              {step === "suggest" && <SuggestIdeaForm onClose={handleClose} />}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
