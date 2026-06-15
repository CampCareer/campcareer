import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { MDXComponents } from "mdx/types"

function DataCard({ num, label }: { num: string; label: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
      <span className="block text-2xl font-bold text-blue-600 mb-1">{num}</span>
      <span className="block text-xs text-slate-500 leading-snug">{label}</span>
    </div>
  )
}

function DataGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8 not-prose">
      {children}
    </div>
  )
}

function CompareTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto my-8 not-prose">
      <table className="w-full text-sm border-collapse">
        {children}
      </table>
    </div>
  )
}

function Callout({
  type = "tip",
  title,
  children,
}: {
  type?: "tip" | "warning" | "info"
  title?: string
  children: React.ReactNode
}) {
  const styles = {
    tip:     { wrapper: "bg-amber-50 border-amber-200",  icon: "💡", text: "text-amber-800",  sub: "text-amber-700" },
    warning: { wrapper: "bg-red-50 border-red-200",      icon: "⚠️", text: "text-red-800",    sub: "text-red-700" },
    info:    { wrapper: "bg-blue-50 border-blue-200",    icon: "ℹ️", text: "text-blue-800",   sub: "text-blue-700" },
  }
  const s = styles[type]
  return (
    <div className={`border rounded-2xl p-5 my-8 not-prose ${s.wrapper}`}>
      {title && (
        <p className={`text-sm font-semibold mb-1 ${s.text}`}>
          {s.icon} {title}
        </p>
      )}
      <div className={`text-sm leading-relaxed ${s.sub}`}>{children}</div>
    </div>
  )
}

function CTA({
  title,
  description,
  href,
  label,
  secondaryHref,
  secondaryLabel,
}: {
  title: string
  description?: string
  href: string
  label: string
  secondaryHref?: string
  secondaryLabel?: string
}) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 my-8 not-prose">
      <p className="text-sm font-semibold text-blue-700 mb-2">{title}</p>
      {description && (
        <p className="text-sm text-slate-600 mb-4">{description}</p>
      )}
      <div className="flex flex-wrap gap-3">
        <Link
          href={href}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          {label} <ArrowRight className="w-4 h-4" />
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            className="inline-flex items-center gap-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  )
}

function AuthorBox({
  name,
  role,
  initials,
}: {
  name: string
  role: string
  initials: string
}) {
  return (
    <div className="not-prose flex items-center gap-3 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-blue-600">{initials}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">{role}</p>
      </div>
    </div>
  )
}

function BlogImage({
  src,
  alt,
  caption,
  priority = false,
}: {
  src: string
  alt: string
  caption?: string
  priority?: boolean
}) {
  return (
    <figure className="my-8 not-prose">
      <div className="relative w-full overflow-hidden rounded-2xl bg-slate-100" style={{ aspectRatio: "16/9" }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-slate-400 leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export const mdxComponents: MDXComponents = {
  DataCard,
  DataGrid,
  CompareTable,
  Callout,
  CTA,
  AuthorBox,
  BlogImage,
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <BlogImage src={src ?? ""} alt={alt ?? ""} />
  ),
  h1: (props) => <h1 className="text-3xl font-bold text-slate-900 mt-10 mb-4 leading-tight" {...props} />,
  h2: (props) => <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4" {...props} />,
  h3: (props) => <h3 className="text-lg font-semibold text-slate-800 mt-8 mb-3" {...props} />,
  p:  (props) => <p className="text-slate-600 leading-relaxed mb-4" {...props} />,
  ul: (props) => <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-6" {...props} />,
  ol: (props) => <ol className="list-decimal pl-5 space-y-2 text-slate-600 mb-6" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold text-slate-800" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-4 border-blue-200 pl-5 my-6 text-slate-500 italic" {...props} />
  ),
  hr: () => <hr className="border-slate-200 my-8" />,
  table: (props) => (
    <div className="overflow-x-auto my-8">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-slate-50" {...props} />,
  th: (props) => (
    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200" {...props} />
  ),
  td: (props) => (
    <td className="px-4 py-3 text-slate-600 border-b border-slate-100" {...props} />
  ),
  a: (props) => (
    <a className="text-blue-600 hover:text-blue-800 underline underline-offset-2" {...props} />
  ),
  code: (props) => (
    <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
  ),
}
