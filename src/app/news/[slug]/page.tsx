import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import ReadingProgressBar from '../../../components/ReadingProgressBar'

const HYGRAPH_ENDPOINT = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master"

// 1. Data Fetching Function (This is what Vercel was missing)
async function getArticle(slug: string) {
  const query = `
    query GetArticle($slug: String!) {
      article(where: { slug: $slug }) {
        id
        title
        slug
        summary
        content { html }
        publishedDate
        category
        image { url }
      }
    }
  `
  const res = await fetch(HYGRAPH_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug } }),
    next: { revalidate: 60 }
  })
  
  const json = await res.json()
  return json.data?.article
}

// 2. SEO Metadata Generation
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug)
  
  if (!article) return { title: 'Not Found | GEOTREXX' }

  return {
    title: `${article.title} | GEOTREXX`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      publishedTime: article.publishedDate,
      images: [
        {
          url: article.image?.url,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [article.image?.url],
    }
  }
}

// 3. Main Page Component
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  // Calculate reading time safely
  const wordCount = article.content?.html ? article.content.html.split(/\s+/).length : 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  // 🚀 Frontend Safety Net for Obsolete Categories
  const displayCategory = (!article.category || article.category.toLowerCase() === 'general news') 
    ? 'World' 
    : article.category;

  return (
    <article className="w-full relative bg-[#f9fafb] dark:bg-[#0a0b10] min-h-screen">
      <ReadingProgressBar />

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="flex items-center gap-3 mb-6 text-sm font-bold tracking-widest uppercase">
          <Link href={`/category/${displayCategory.toLowerCase()}`} className="text-[#C8102E] hover:opacity-80 transition-opacity">
            {displayCategory}
          </Link>
          <span className="text-gray-300 dark:text-gray-700">&bull;</span>
          <span className="text-gray-500 dark:text-gray-400">{readingTime} MIN READ</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
          {article.title}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-light mb-10">
          {article.summary}
        </p>

        <div className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-800 py-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#C8102E] flex items-center justify-center text-white font-bold text-lg shadow-md">
              GE
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">GEOTREXX Desk</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Published {new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Bleed Cover Image */}
      {article.image?.url && (
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src={article.image.url} 
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content injected into Tailwind Typography */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 flex flex-col md:flex-row gap-10 relative">
        <div 
          className="prose prose-lg dark:prose-invert prose-headings:font-black prose-a:text-[#C8102E] hover:prose-a:opacity-80 prose-img:rounded-xl prose-img:shadow-lg w-full max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content?.html || '' }}
        />
      </div>
    </article>
  )
}