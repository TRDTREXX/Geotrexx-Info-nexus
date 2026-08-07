import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import ReadingProgressBar from '../../../components/ReadingProgressBar'

const HYGRAPH_ENDPOINT = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master"

// 1. Fetch the specific article data
async function getPost(slug: string) {
  const query = `
    query GetPost($slug: String!) {
      post(where: { slug: $slug }) {
        id
        title
        slug
        excerpt
        content { html }
        createdAt
        updatedAt
        category
        coverImage { url }
        author {
          name
          picture { url }
        }
      }
    }
  `
  const res = await fetch(HYGRAPH_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug } }),
    next: { revalidate: 60 } // Enterprise edge caching
  })
  
  const json = await res.json()
  return json.data?.post
}

// 2. Generate Dynamic SEO & Open Graph Metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  if (!post) return { title: 'Not Found | GEOTREXX' }

  return {
    title: `${post.title} | GEOTREXX`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.createdAt,
      authors: [post.author?.name || 'GEOTREXX Editor'],
      images: [
        {
          url: post.coverImage?.url,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage?.url],
    }
  }
}

// 3. The Page Component
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  // Calculate rough reading time (avg 200 words per minute)
  const wordCount = post.content.html.split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  // 4. Google News JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    image: [post.coverImage?.url],
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: [{
      '@type': 'Person',
      name: post.author?.name || 'GEOTREXX Staff',
    }]
  }

  return (
    <article className="w-full relative bg-[#f9fafb] dark:bg-[#0a0b10] min-h-screen">
      <ReadingProgressBar />
      
      {/* Inject Google Schema invisibly */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="flex items-center gap-3 mb-6 text-sm font-bold tracking-widest uppercase">
          <Link href={`/category/${post.category?.toLowerCase() || 'news'}`} className="text-[#C8102E] hover:opacity-80 transition-opacity">
            {post.category || 'News'}
          </Link>
          <span className="text-gray-300 dark:text-gray-700">&bull;</span>
          <span className="text-gray-500 dark:text-gray-400">{readingTime} MIN READ</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
          {post.title}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-light mb-10">
          {post.excerpt}
        </p>

        {/* Author & Meta Block */}
        <div className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-800 py-4">
          <div className="flex items-center gap-4">
            {post.author?.picture?.url ? (
              <Image src={post.author.picture.url} alt={post.author.name} width={48} height={48} className="rounded-full h-12 w-12 object-cover border-2 border-gray-100 dark:border-gray-800" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-[#C8102E] flex items-center justify-center text-white font-bold text-lg">
                {(post.author?.name || 'G')[0]}
              </div>
            )}
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{post.author?.name || 'GEOTREXX Staff'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Published {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          
          {/* Social Share Icons Placeholder (Desktop only) */}
          <div className="hidden md:flex gap-3 text-gray-400">
             <button className="hover:text-[#C8102E] transition-colors" aria-label="Share on X">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
             </button>
             <button className="hover:text-[#C8102E] transition-colors" aria-label="Share on Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
             </button>
          </div>
        </div>
      </header>

      {/* Massive Full-Bleed Cover Image */}
      {post.coverImage?.url && (
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src={post.coverImage.url} 
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content Wrapper */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 flex flex-col md:flex-row gap-10 relative">
        
        {/* The HTML Content from Hygraph injected into Tailwind Typography */}
        <div 
          className="prose prose-lg dark:prose-invert prose-headings:font-black prose-a:text-[#C8102E] hover:prose-a:opacity-80 prose-img:rounded-xl prose-img:shadow-lg w-full max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content.html }}
        />
        
      </div>
    </article>
  )
}