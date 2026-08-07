import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import ReadingProgressBar from '../../../components/ReadingProgressBar'

const HYGRAPH_ENDPOINT = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master"

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
  try {
    const res = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { slug } }),
      next: { revalidate: 0 }
    })
    
    const json = await res.json()
    if (json.errors) return { article: null, error: json.errors[0].message }
    return { article: json.data?.article || null, error: null }
  } catch (error: any) {
    return { article: null, error: error.message }
  }
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const { article } = await getArticle(params.slug)
  
  if (!article) return { title: 'Article Not Found | GEOTREXX' }

  return {
    title: `${article.title} | GEOTREXX`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      publishedTime: article.publishedDate,
      images: [{ url: article.image?.url, width: 1200, height: 630, alt: article.title }],
    },
  }
}

export default async function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { article, error } = await getArticle(params.slug)

  if (error || !article) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center text-center px-4 min-h-[60vh]">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-2xl p-8 max-w-2xl">
          <h2 className="text-2xl font-black text-red-600 dark:text-red-400 mb-4 uppercase tracking-widest">Article Render Error</h2>
          <Link href="/" className="mt-8 inline-block text-[#C8102E] font-bold uppercase hover:underline">Return Home</Link>
        </div>
      </div>
    )
  }

  const wordCount = article.content?.html ? article.content.html.split(/\s+/).length : 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))
  const displayCategory = (!article.category || article.category.toLowerCase() === 'general news') ? 'World' : article.category;

  // Format Date to match Exhibit (e.g., Aug. 7, 2026 9:30 am GMT)
  const dateObj = new Date(article.publishedDate)
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()

  return (
    <article className="w-full relative bg-[#f9fafb] dark:bg-[#0a0b10] min-h-screen">
      <ReadingProgressBar />

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

        {/* 🚀 Exhibit-Matched Publisher Block */}
        <div className="flex flex-col gap-1 border-t border-b border-gray-200 dark:border-gray-800 py-6">
          <div className="flex items-center gap-3">
            <Image src="/orpheus.jpg" alt="Orpheus Grant-Essilfie" width={48} height={48} className="w-12 h-12 rounded-full object-cover shadow-sm" />
            <p className="text-lg text-gray-900 dark:text-white">
              By <span className="font-bold">Orpheus Grant-Essilfie</span>
            </p>
          </div>
          <p className="text-gray-700 dark:text-gray-400 text-sm pl-[60px] font-medium">
            {formattedDate} {formattedTime} GMT
          </p>
        </div>
      </header>

      {article.image?.url && (
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
            <Image src={article.image.url} alt={article.title} fill priority className="object-cover" />
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 flex flex-col md:flex-row gap-10 relative">
        <div 
          className="prose prose-lg dark:prose-invert prose-headings:font-black prose-a:text-[#C8102E] hover:prose-a:opacity-80 prose-img:rounded-xl prose-img:shadow-lg w-full max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content?.html || '' }}
        />
      </div>
    </article>
  )
}