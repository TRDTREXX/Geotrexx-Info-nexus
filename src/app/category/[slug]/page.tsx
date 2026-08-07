import NewsCard from '../../../components/NewsCard'
import Link from 'next/link'

const HYGRAPH_ENDPOINT = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master"

const getCategoryArticles = async (categorySlug: string) => {
  const query = `
    query GetAllArticles {
      articles(orderBy: publishedDate_DESC, first: 100) {
        id
        title
        slug
        summary
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
      body: JSON.stringify({ query }),
      next: { revalidate: 0 }
    })
    const json = await res.json()
    
    if (json.errors) return { data: [], error: json.errors[0].message }

    const allArticles = json.data?.articles || []

    const filtered = allArticles.filter((article: any) => {
      if (!article.category) return false;
      const catA = article.category.toLowerCase().replace(/[^a-z0-9]/g, '')
      const catB = categorySlug.toLowerCase().replace(/[^a-z0-9]/g, '')
      return catA === catB
    })

    return { data: filtered, error: null }
  } catch (error: any) {
    return { data: [], error: error.message }
  }
}

// Fixed for Next.js 15 parameter Promises
export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { data: articles, error } = await getCategoryArticles(params.slug)
  
  const formatTitle = (slug: string) => {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }
  
  const pageTitle = formatTitle(params.slug)

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      
      <div className="flex items-center gap-4 mb-10 border-b border-gray-200 dark:border-gray-800 pb-6">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-widest">
          {pageTitle}
        </h1>
        <div className="h-1 flex-grow bg-gray-100 dark:bg-gray-800 ml-4 rounded-full">
          <div className="h-full w-24 bg-[#C8102E] rounded-full"></div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800 mb-8">
          <p className="text-red-600 dark:text-red-400 font-mono text-sm">Error: {error}</p>
        </div>
      )}

      {(!articles || articles.length === 0) && !error ? (
        <div className="py-20 text-center bg-white dark:bg-[#1a1b23] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L18.5 7H20" /></svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Stories Found</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">We couldn't find any published articles in the <span className="font-bold text-[#C8102E]">{pageTitle}</span> category yet.</p>
          <Link href="/" className="inline-block mt-6 px-6 py-3 bg-[#C8102E] text-white font-bold uppercase tracking-widest rounded-lg hover:bg-red-800 transition-colors">Return Home</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: any) => (
            <NewsCard 
              key={article.id}
              title={article.title}
              slug={article.slug}
              excerpt={article.summary || "Click to read the full story and dive deep into the analysis."}
              imageUrl={article.image?.url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80"}
              category={article.category}
              date={article.publishedDate}
            />
          ))}
        </div>
      )}
    </div>
  )
}