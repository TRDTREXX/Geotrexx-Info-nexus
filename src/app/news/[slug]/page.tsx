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
    `*[slug.current == $slug && !(_id in path("drafts.**"))][0]{
      title,
      "summary": coalesce(summary, description, "Read the full story on GEOTREXX."),
      "mainImage": coalesce(mainImage, image, coverImage)
    }`,
    { slug }
  )

  if (!post) {
    return {
      title: 'Article Not Found | GEOTREXX',
    }
  }

  return {
    title: `${post.title} | GEOTREXX`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: post.mainImage
        ? [
            {
              url: urlFor(post.mainImage).width(1200).height(630).url(),
              width: 1200,
              height: 630,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: post.mainImage ? [urlFor(post.mainImage).width(1200).height(630).url()] : [],
    },
  }
}

// 2. MAIN ARTICLE PAGE
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Flexible GROQ query: catches any document type and resolves both old/new field structures
  const post = await client.fetch(
    `*[slug.current == $slug && !(_id in path("drafts.**"))][0]{
      title,
      "body": coalesce(body, content, articleBody),
      publishedAt,
      "mainImage": coalesce(mainImage, image, coverImage),
      "category": coalesce(category->title, category->name, category, "News"),
      "authorName": coalesce(author->name, author->title, author, "GEOTREXX"),
      "authorImage": coalesce(author->image, authorImage)
    }`,
    { slug }
  )

  if (!post) {
    notFound()
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <article>
        {/* Category Badge */}
        <div className="text-center mb-4">
          <span className="text-red-600 font-bold uppercase tracking-wider text-sm">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-center text-slate-900 mb-8 leading-tight">
          {post.title}
        </h1>

        {/* Author Details & Date */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {post.authorImage && (
            <Image
              src={urlFor(post.authorImage).width(50).height(50).url()}
              alt={typeof post.authorName === 'string' ? post.authorName : 'Author'}
              width={50}
              height={50}
              className="rounded-full bg-gray-200"
            />
          )}
          <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide text-center">
            BY {typeof post.authorName === 'string' ? post.authorName : 'GEOTREXX'}
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

        {/* Featured Cover Image */}
        {post.mainImage && (
          <div className="mb-10 w-full relative h-[400px] md:h-[500px]">
            <Image
              src={urlFor(post.mainImage).url()}
              alt={post.title || 'Featured Image'}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        )}

        {/* Article Body */}
        <div className="prose prose-lg max-w-none prose-slate">
          {post.body ? (
            Array.isArray(post.body) ? (
              <PortableText value={post.body} />
            ) : typeof post.body === 'string' ? (
              <p>{post.body}</p>
            ) : null
          ) : null}
        </div>
      </article>
    </main>
  )
}