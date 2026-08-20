export const dynamic = 'force-dynamic'
export const revalidate = 0

import { client } from '../../../sanity/lib/client'
import { urlFor } from '../../../sanity/lib/image'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await client.fetch(
    `*[_type in ["post", "article", "news"] && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      title,
      "summary": coalesce(summary, description, "Read the full story on GEOTREXX."),
      "mainImage": coalesce(mainImage, image, coverImage)
    }`,
    { slug },
    { cache: 'no-store' }
  )
  if (!post) return { title: 'Article Not Found | GEOTREXX' }
  return {
    title: `${post.title} | GEOTREXX`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://www.geotrexx.com/news/${slug}`, 
      images: post.mainImage?.asset ? [{ url: urlFor(post.mainImage).width(1200).height(630).url() }] : [],
      type: 'article',
    }
  }
}

const RichTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      // Direct URL fetch from the unpacked GROQ query
      if (!value?.asset?.url) return null;
      
      return (
        <div className="w-full flex justify-center my-10">
          <img
            src={value.asset.url}
            alt={value.alt || 'GEOTREXX Article Image'}
            className="w-full h-auto max-h-[700px] object-contain rounded-md bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 shadow-sm"
            loading="lazy"
          />
        </div>
      )
    }
  },
  block: {
    normal: ({ children }) => <p className="mb-6 leading-relaxed text-gray-800 dark:text-gray-200 text-lg md:text-xl font-serif">{children}</p>,
    h1: ({ children }) => <h1 className="text-3xl md:text-4xl font-black mt-12 mb-6 text-black dark:text-white tracking-tight">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-black mt-10 mb-4 text-black dark:text-white tracking-tight">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-black dark:text-white">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#dc143c] pl-6 my-8 italic text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#111] py-6 pr-6 shadow-sm">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="ml-6 mb-6 list-disc space-y-2 text-lg md:text-xl text-gray-800 dark:text-gray-200 font-serif marker:text-[#dc143c]">{children}</ul>,
    number: ({ children }) => <ol className="ml-6 mb-6 list-decimal space-y-2 text-lg md:text-xl text-gray-800 dark:text-gray-200 font-serif">{children}</ol>,
  },
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // 🔥 Unpacking the image URL directly in the query body
  const post = await client.fetch(
    `*[_type in ["post", "article", "news"] && slug.current == $slug && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]{
      ...,
      "body": coalesce(body, content, text)[]{
        ...,
        _type == "image" => {
          ...,
          asset->{
            url
          }
        }
      },
      "summaryText": coalesce(summary, description),
      "authorName": coalesce(author->name, writer->name, byline, authorName, "GEOTREXX MEDIA GROUP"),
      "authorImageUrl": author->image.asset->url
    }`,
    { slug },
    { cache: 'no-store' }
  )

  if (!post) notFound()

  const finalAuthorName = post.authorName || "GEOTREXX MEDIA GROUP"

  return (
    <main className="w-full bg-white dark:bg-[#0a0b10] min-h-screen">
      <article className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        
        <header className="max-w-3xl mx-auto mb-10">
          {post.category && (
            <div className="flex items-center space-x-2 mb-4">
              <span className="w-2 h-2 bg-[#dc143c] rounded-full"></span>
              <span className="text-[#dc143c] font-black uppercase tracking-widest text-xs md:text-sm">
                {post.category}
              </span>
            </div>
          )}
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-800 to-gray-500 dark:from-white dark:via-gray-100 dark:to-gray-500 leading-[1.05] tracking-tighter mb-6 drop-shadow-sm">
            {post.title}
          </h1>

          {post.summaryText && (
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-medium mb-8 leading-snug">
              {post.summaryText}
            </p>
          )}
          
          <div className="flex items-center space-x-4 border-t border-b border-gray-200 dark:border-gray-800 py-4 mb-8">
            {post.authorImageUrl ? (
              <Image
                src={post.authorImageUrl}
                alt={finalAuthorName}
                width={48}
                height={48}
                className="rounded-full object-cover border border-gray-200 dark:border-gray-800"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#dc143c] flex items-center justify-center text-white font-black text-xl shadow-sm">
                {finalAuthorName.charAt(0)}
              </div>
            )}
            <div>
              <div className="text-sm font-black text-black dark:text-white uppercase tracking-wider">
                {finalAuthorName}
              </div>
              {post.publishedAt && (
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                  {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>
          </div>
        </header>

        {post.mainImage?.asset && (
          <div className="w-full relative aspect-[16/9] mb-12 bg-gray-100 dark:bg-[#111] rounded-sm overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
            <Image
              src={urlFor(post.mainImage).url()}
              alt={post.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {post.body ? (
            <PortableText value={post.body} components={RichTextComponents} />
          ) : (
            <p className="text-gray-500 italic">Story content is being updated.</p>
          )}
        </div>
      </article>
    </main>
  )
}