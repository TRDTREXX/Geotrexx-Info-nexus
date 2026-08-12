import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import ReadingProgressBar from '../../../components/ReadingProgressBar'
import SmartImage from '../../../components/SmartImage'

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const HYGRAPH_ENDPOINT = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master"

async function getArticle(rawSlug: string) {
  if (!rawSlug) return { article: null, error: "No slug provided" };
  
  const targetSlug = decodeURIComponent(rawSlug).toLowerCase();
  
  const query = `
    query GetAllArticles {
      articles(first: 100, orderBy: publishedAt_DESC) {
        id
        title
        slug
        summary
        content { html }
        publishedDate
        publishedAt
        category
        author 
        image { url }
      }
    }
  `
  try {
    const res = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      cache: 'no-store'
    })
    
    const json = await res.json()
    if (json.errors) return { article: null, error: json.errors[0].message }
    
    const articles = json.data?.articles || [];
    const foundArticle = articles.find((a: any) => a.slug?.toLowerCase() === targetSlug) || null;
    
    return { article: foundArticle, error: null }
  } catch (error: any) {
    return { article: null, error: error.message }
  }
}

export async function generateMetadata(props: any): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(props.params);
  const slug = resolvedParams?.slug || '';
  const { article } = await getArticle(slug)
  
  if (!article) return { title: 'Article Not Found | GEOTREXX' }

  const officialUrl = `https://www.geotrexx.com/news/${slug}`;

  return {
    title: `${article.title || 'News'} | GEOTREXX`,
    description: article.summary || 'GEOTREXX News Article',
    alternates: {
      canonical: officialUrl,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: officialUrl,
      type: 'article',
      publishedTime: article.publishedAt,
      images: [{ url: article.image?.url || '', width: 1200, height: 630, alt: article.title || 'News' }],
    },
  }
}

export default async function ArticlePage(props: any) {
  const resolvedParams = await Promise.resolve(props.params);
  const slug = resolvedParams?.slug || '';
  const { article, error } = await getArticle(slug)

  if (error || !article) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center text-center px-4 min-h-[60vh]">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-2xl p-8 max-w-2xl w-full">
          <h2 className="text-2xl font-black text-red-600 dark:text-red-400 mb-4 uppercase tracking-widest">Article Render Error</h2>
          <p className="text-gray-700 dark:text-gray-300 font-mono text-sm break-words mb-6">{error || "Article not found in database."}</p>
          
          <div className="bg-white dark:bg-black p-4 rounded-lg text-left w-full mb-8 shadow-inner border border-red-100 dark:border-red-900/50">
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Searching for Slug:</p>
            <code className="text-[#C8102E] break-all font-mono text-sm">{decodeURIComponent(slug)}</code>
          </div>

          <Link href="/" className="inline-block bg-[#C8102E] text-white px-6 py-3 rounded-lg font-bold uppercase hover:bg-red-700 transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  const wordCount = article.content?.html ? article.content.html.split(/\s+/).length : 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))
  const displayCategory = (!article.category || article.category.toLowerCase() === 'general news') ? 'World' : article.category;
  
  let formattedDate = article.publishedDate || 'Recent';
  
  const authorMap: Record<string, { name: string, imageKey: string }> = {
    'orpheusGrantEssilfie': { name: 'Orpheus Grant-Essilfie', imageKey: 'orpheus' },
    'quistEbenezerAssan': { name: 'Quist Ebenezer Assan', imageKey: 'quist' },
    'geotrexxDesk': { name: 'GEOTREXX Desk', imageKey: 'geotrexx' }
  };

  const rawAuthor = article.author || 'orpheusGrantEssilfie';
  const authorInfo = authorMap[rawAuthor] || { name: 'Orpheus Grant-Essilfie', imageKey: 'orpheus' };

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

        <div className="flex flex-col gap-1 border-t border-b border-gray-200 dark:border-gray-800 py-6">
          <div className="flex items-center gap-3">
            <SmartImage 
              baseName={authorInfo.imageKey} 
              altName={authorInfo.name} 
              className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-200 dark:border-gray-700" 
            />
            <p className="text-lg text-gray-900 dark:text-white">
              By <span className="font-bold">{authorInfo.name}</span>
            </p>
          </div>
          <p className="text-gray-700 dark:text-gray-400 text-sm pl-[60px] font-medium">
            {formattedDate}
          </p>
        </div>
      </header>

      {article.image?.url && (
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl bg-gray-200 dark:bg-gray-800">
            {/* 🚀 Changed to object-contain to stop image chopping */}
            <Image src={article.image.url} alt={article.title || 'Cover image'} fill priority className="object-contain" />
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