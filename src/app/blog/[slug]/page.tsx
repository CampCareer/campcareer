import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Image from "next/image"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { getAllPosts, getPostBySlug } from "@/lib/blog"
import { buildMdxComponents } from "@/components/blog/mdx-components"
import { JsonLd, articleLd, breadcrumbLd, faqLd } from "@/components/seo/json-ld"

// Up to 3 internal links for the post foot — same tag first, topped up with the
// most recent other posts so the block is never empty (internal-link graph).
function relatedPosts(slug: string, tag: string) {
  const others = getAllPosts().filter((p) => p.slug !== slug)
  const sameTag = others.filter((p) => p.tag === tag)
  const rest = others.filter((p) => p.tag !== tag)
  return [...sameTag, ...rest].slice(0, 3)
}

export const revalidate = 86400
export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return { title: "Post Not Found" }
  const path = `/blog/${params.slug}`
  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: { canonical: path },
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      url: path,
      siteName: "CampCareer",
      type: "article",
      publishedTime: post.meta.date,
      ...(post.meta.heroImage && { images: [{ url: post.meta.heroImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.description,
      ...(post.meta.heroImage && { images: [post.meta.heroImage] }),
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const { meta, content } = post
  const path = `/blog/${params.slug}`
  const components = buildMdxComponents({ country: meta.ctaCountry, major: meta.ctaMajor })
  const related = relatedPosts(params.slug, meta.tag)

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <JsonLd data={articleLd({
        title: meta.title,
        description: meta.description,
        path,
        datePublished: meta.date,
        author: meta.author,
        image: meta.heroImage,
      })} />
      <JsonLd data={breadcrumbLd([
        { name: "Blog", path: "/blog" },
        { name: meta.title, path },
      ])} />
      {meta.faqs && meta.faqs.length > 0 && (
        <JsonLd data={faqLd(meta.faqs.map((f) => ({ question: f.q, answer: f.a })))} />
      )}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to blog
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${meta.tagColor}`}>
            {meta.tag}
          </span>
          <span className="text-xs text-slate-400">{meta.date}</span>
          <span className="text-xs text-slate-400">{meta.readTime} read</span>
        </div>
        <h1 className="font-display text-4xl font-semibold text-slate-900 leading-tight tracking-tight mb-4">
          {meta.title}
        </h1>
        <p className="text-xl text-slate-500 leading-relaxed">{meta.description}</p>
      </div>

      <hr className="border-slate-200 mb-8" />

      {meta.author && (
        <div className="flex items-start gap-3 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-sm font-bold text-blue-600">
              {meta.authorInitials ?? meta.author.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">{meta.author}</p>
            {meta.authorTitle && (
              <p className="text-xs text-slate-500">{meta.authorTitle}</p>
            )}
            {meta.authorRole && (
              <p className="text-xs text-slate-500 mt-0.5">{meta.authorRole}</p>
            )}
            {(meta.reviewedBy || meta.lastReviewed) && (
              <div className="mt-1.5 pt-1.5 border-t border-slate-200 space-y-0.5">
                {meta.reviewedBy && (
                  <p className="text-[11px] text-slate-400">
                    Reviewed by {meta.reviewedBy}
                  </p>
                )}
                {meta.lastReviewed && (
                  <p className="text-[11px] text-slate-400">
                    Last reviewed {new Date(meta.lastReviewed + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {meta.heroImage && (
        <div
          className="relative w-full overflow-hidden rounded-2xl bg-slate-100 mb-10"
          style={{ aspectRatio: "16/9" }}
        >
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

      <article>
        <MDXRemote source={content} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </article>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">Related guides</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-sm"
              >
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${p.tagColor}`}>{p.tag}</span>
                <p className="mt-2 text-sm font-medium text-slate-800 leading-snug transition-colors group-hover:text-blue-700">
                  {p.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

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
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Try ROI Explorer <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
