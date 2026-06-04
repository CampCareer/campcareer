import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Image from "next/image"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { getAllPosts, getPostBySlug } from "@/lib/blog"
import { mdxComponents } from "@/components/blog/mdx-components"
import { getTranslations } from "@/lib/i18n/server"

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return { title: "Post Not Found" }
  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.date,
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const t = getTranslations()
  const tb = t.blog
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const { meta, content } = post

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> {tb.backToBlog}
      </Link>

      {meta.heroImage && (
        <div className="relative w-full overflow-hidden rounded-2xl bg-slate-100 mb-8" style={{ aspectRatio: "16/9" }}>
          <Image
            src={meta.heroImage}
            alt={meta.heroImageAlt ?? meta.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${meta.tagColor}`}>
            {meta.tag}
          </span>
          <span className="text-xs text-slate-400">{meta.date}</span>
          <span className="text-xs text-slate-400">{meta.readTime} read</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
          {meta.title}
        </h1>
        <p className="text-xl text-slate-500 leading-relaxed">{meta.description}</p>
      </div>

      <hr className="border-slate-200 mb-10" />

      <article>
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </article>

      <hr className="border-slate-200 mt-12 mb-8" />

      <div className="flex items-center justify-between">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All articles
        </Link>
        <Link
          href="/roi-explorer"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Try ROI Explorer <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
