export const dynamic = 'force-dynamic'

import { client } from '../../../sanity/lib/client'
import { urlFor } from '../../../sanity/lib/image'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { notFound } from 'next/navigation'

// 1. DYNAMIC METADATA (Social Media Previews)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]{
      title,
      "summary": coalesce(summary, description, "Read the full story on GEOTREXX."),
      "mainImage": coalesce(mainImage, image, coverImage)
    }`,
    { slug }
  )

  if (!post) {
    return { title: 'Article Not Found | GEOTREXX' }
  }

  return {
    title: `${post.title} | GEOTREXX`,
    description: post.summary,
    openGraph: {
      title: post.title,
      images: post.mainImage ? [{ url: urlFor(post.mainImage).width(1200).height(630).url() }] : [],
    },
  }
}

// 2. MAIN ARTICLE PAGE & RAW DATA DUMP
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // We fetch EVERYTHING (...) so we can see the exact field names in the diagnostic dump
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]{
      ...,
      "authorName": author->name,
      "authorImage": author->image
    }`,
    { slug }
  )

  if (!post) {
    notFound()
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <article>
        {/* Category Label */}
        {post.category && (
          <div className="text-center mb-4">
            <span className="text-red-600 font-bold uppercase tracking-wider text-sm">
              {post.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-center text-slate-900 mb-8 leading-tight">
          {post.title}
        </h1>

        {/* Author / Date */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {post.authorImage && (
            <Image
              src={urlFor(post.authorImage).width(50).height(50).url()}
              alt={post.authorName || 'Author'}
              width={50}
              height={50}
              className="rounded-full bg-gray-200 object-cover"
            />
          )}
          <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide text-center">
            BY {post.authorName || 'GEOTREXX'}
            {post.publishedAt && (
              <>
                <br />
                <span className="text-gray-500 font-normal">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {post.mainImage && (
          <div className="mb-10 w-full relative h-[400px] md:h-[500px]">
            <Image
              src={urlFor(post.mainImage).url()}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        )}

        {/* Body Text */}
        <div className="prose prose-lg max-w-none prose-slate mx-auto">
          {post.body ? <PortableText value={post.body} /> : null}
        </div>
      </article>

      {/* --- DEVELOPER DIAGNOSTIC DUMP --- */}
      <div className="mt-20 bg-slate-900 text-green-400 p-6 rounded-lg overflow-x-auto font-mono text-xs border border-red-500">
        <h2 className="text-white mb-4 text-lg font-bold">🛠️ DIAGNOSTIC DUMP</h2>
        <p className="text-slate-400 mb-4">
          Please copy this green text and paste it back into the chat. It shows exactly how your database is structured.
        </p>
        <pre>{JSON.stringify(post, null, 2)}</pre>
      </div>
    </main>
  )
}