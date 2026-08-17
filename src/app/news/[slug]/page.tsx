import { client } from '../../../../sanity/lib/client'
import { urlFor } from '../../../../sanity/lib/image'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { notFound } from 'next/navigation'

// 1. DYNAMIC METADATA (For Facebook/X Link Previews)
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug: params.slug })

  if (!post) {
    return {}
  }

  return {
    title: `${post.title} | GEOTREXX`,
    description: "Read the full story on GEOTREXX Info Nexus.",
    openGraph: {
      title: post.title,
      images: post.mainImage ? [
        {
          url: urlFor(post.mainImage).width(1200).height(630).url(),
          width: 1200,
          height: 630,
        },
      ] : [],
    },
  }
}

// 2. MAIN PAGE COMPONENT
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  // Fetch the full article including the category and author data from Sanity
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]{
    title,
    body,
    publishedAt,
    mainImage,
    category,
    "authorName": author->name,
    "authorImage": author->image
  }`, { slug: params.slug })

  // If the article doesn't exist, show a 404 page
  if (!post) {
    notFound()
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <article>
        
        {/* DYNAMIC CATEGORY FIX (Replaces the hardcoded "GHANA") */}
        <div className="text-center mb-4">
          <span className="text-red-600 font-bold uppercase tracking-wider text-sm">
            {post.category || 'News'}
          </span>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-black text-center text-slate-900 mb-8 leading-tight">
          {post.title}
        </h1>

        {/* AUTHOR BLOCK */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {post.authorImage && (
            <Image
              src={urlFor(post.authorImage).width(50).height(50).url()}
              alt={post.authorName || 'Author'}
              width={50}
              height={50}
              className="rounded-full bg-gray-200"
            />
          )}
          <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            BY {post.authorName || 'GEOTREXX'}
            <br />
            {post.publishedAt && (
              <span className="text-gray-500 font-normal">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            )}
          </div>
        </div>

        {/* MAIN COVER IMAGE */}
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

        {/* ARTICLE BODY / CONTENT */}
        <div className="prose prose-lg max-w-none prose-slate">
          {post.body ? <PortableText value={post.body} /> : null}
        </div>

      </article>
    </main>
  )
}