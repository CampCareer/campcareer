'use client'

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase-client"
import {
  FolderOpen, Upload, Trash2, Download, FileText,
  File, Image, FileBadge, Loader2, Plus, Eye,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"

type DocCategory = 'passport' | 'transcript' | 'financial' | 'visa' | 'recommendation' | 'other'

type UserDoc = {
  id: string
  file_name: string
  file_path: string
  file_size: number | null
  mime_type: string | null
  category: DocCategory
  note: string | null
  created_at: string
}

const CATEGORIES: { value: DocCategory; label: string; emoji: string; color: string }[] = [
  { value: 'passport',       label: 'Passport & ID',          emoji: '🛂', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { value: 'transcript',     label: 'Transcripts',            emoji: '🎓', color: 'bg-violet-50 border-violet-200 text-violet-700' },
  { value: 'financial',      label: 'Financial Docs',         emoji: '💰', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { value: 'visa',           label: 'Visa & Immigration',     emoji: '✈️', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { value: 'recommendation', label: 'Recommendation Letters', emoji: '📝', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { value: 'other',          label: 'Other',                  emoji: '📁', color: 'bg-slate-50 border-slate-200 text-slate-600' },
]

function formatBytes(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileIcon({ mime }: { mime: string | null }) {
  if (!mime) return <File className="w-4 h-4 text-slate-400" />
  if (mime.startsWith('image/')) return <Image className="w-4 h-4 text-indigo-400" />
  if (mime === 'application/pdf') return <FileBadge className="w-4 h-4 text-rose-400" />
  return <FileText className="w-4 h-4 text-slate-400" />
}

export default function DocumentsPage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [docs, setDocs] = useState<UserDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadCategory, setUploadCategory] = useState<DocCategory>('other')
  const [uploadNote, setUploadNote] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: rows } = await supabase
          .from('user_documents')
          .select('id,file_name,file_path,file_size,mime_type,category,note,created_at')
          .eq('user_id', data.user.id)
          .order('created_at', { ascending: false })
        if (rows) setDocs(rows as UserDoc[])
      }
      setLoading(false)
    })
  }, [])

  async function uploadFile(file: File) {
    if (!user) return
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max 10 MB.')
      return
    }
    setUploading(true)
    setError(null)
    const ext = file.name.split('.').pop()
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filePath = `${user.id}/${uploadCategory}/${uniqueName}`

    const { error: storageError } = await supabase.storage
      .from('user-documents')
      .upload(filePath, file, { upsert: false })

    if (storageError) {
      setError(storageError.message)
      setUploading(false)
      return
    }

    const { data: saved, error: dbError } = await supabase
      .from('user_documents')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        category: uploadCategory,
        note: uploadNote.trim() || null,
      })
      .select()
      .single()

    if (dbError) {
      setError(dbError.message)
    } else if (saved) {
      setDocs(prev => [saved as UserDoc, ...prev])
      setUploadNote('')
      setShowUpload(false)
    }
    setUploading(false)
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return
    for (const file of Array.from(files)) {
      await uploadFile(file)
    }
  }

  async function handleDownload(doc: UserDoc) {
    const { data } = await supabase.storage
      .from('user-documents')
      .createSignedUrl(doc.file_path, 60)
    if (!data?.signedUrl) return

    const response = await fetch(data.signedUrl)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = doc.file_name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  }

  async function handlePreview(doc: UserDoc) {
    const { data } = await supabase.storage
      .from('user-documents')
      .createSignedUrl(doc.file_path, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  async function handleDelete(doc: UserDoc) {
    await supabase.storage.from('user-documents').remove([doc.file_path])
    await supabase.from('user_documents').delete().eq('id', doc.id)
    setDocs(prev => prev.filter(d => d.id !== doc.id))
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

      {/* 헤더 */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-6 h-6 text-indigo-500 shrink-0" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Documents</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Store your visa, academic, and financial documents securely.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowUpload(v => !v)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Upload File
        </button>
      </div>

      {/* 업로드 패널 */}
      {showUpload && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">

          {/* 카테고리 칩 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setUploadCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors focus:outline-none
                    ${uploadCategory === cat.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 노트 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">
              Note <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              value={uploadNote}
              onChange={e => setUploadNote(e.target.value)}
              placeholder="e.g. IELTS certificate, valid until 2027"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            />
          </div>

          {/* 드래그앤드롭 */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors
              ${dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                <p className="text-sm text-slate-500">Uploading…</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">
                  Drag & drop or <span className="text-indigo-600">click to select</span>
                </p>
                <p className="text-xs text-slate-400">PDF, images, Word docs — max 10 MB</p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{error}</p>
          )}
        </div>
      )}

      {/* 로딩 스켈레톤 */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      )}

      {/* 빈 상태 */}
      {!loading && docs.length === 0 && (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-16 text-center">
          <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500 mb-1">No documents yet</p>
          <p className="text-xs text-slate-400">Upload your passport, transcripts, visa docs, and more.</p>
        </div>
      )}

      {/* 카테고리별 그룹 */}
      {!loading && docs.length > 0 && (
        <div className="space-y-6">
          {CATEGORIES.map(cat => {
            const catDocs = docs.filter(d => d.category === cat.value)
            if (catDocs.length === 0) return null
            return (
              <div key={cat.value}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">{cat.emoji}</span>
                  <h2 className="text-sm font-semibold text-slate-700">{cat.label}</h2>
                  <span className="text-xs text-slate-400">{catDocs.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catDocs.map(doc => (
                    <div
                      key={doc.id}
                      className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-2 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <FileIcon mime={doc.mime_type} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{doc.file_name}</p>
                          {doc.note && (
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{doc.note}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {formatBytes(doc.file_size)} · {new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 pt-1 border-t border-slate-100">
                        <button
                          onClick={() => handlePreview(doc)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 font-medium py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs text-slate-600 hover:text-emerald-600 font-medium py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-red-500 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
