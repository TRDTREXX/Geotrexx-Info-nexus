import NewsCard from '../components/NewsCard'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const HYGRAPH_ENDPOINT = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master"

const getLatestArticles = async () => {
  // 🚀 Trust the database to sort perfectly, grabbing only the 16 absolute newest.
  const query = `
    query GetArticles {
      articles(first: 16, orderBy: publishedAt_DESC) {
        id
        title
        slug
        summary
        publishedDate
        publishedAt
        category
        image { url }
      }
    }
  `
  try {
    const res = await fetch(`${HYGRAPH_ENDPOINT}?burst=${Date.now()}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({ query }),
      cache: 'no-store'
    })
    
    const json = await res.json()
    if (json.errors) return { data: null, error: json.errors[0].message }
    
    // 🚀 Stripped out the buggy JavaScript sorting completely. 
    return { data: json.data?.articles || [], error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

const getDisplayCategory = (cat: string) => {
  if (!cat) return 'News'
  if (cat.toLowerCase() === 'general news') return 'World'
  return cat
}

export default async function Home() {
  const { data: articles, error } = await getLatestArticles()

  if (error) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-2xl p-8 max-w-2xl">
          <h2 className="text-2xl font-black text-red-600 dark:text-red-400 mb-4 uppercase tracking-widest">Hygraph Connection Error</h2>
          <p className="text-gray-700 dark:text-gray-300 font-mono text-sm bg-white dark:bg-black p-4 rounded break-words">{error}</p>
        </div>
      </div>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Stories Available</h2>
      </div>
    )
  }

  const heroArticle = articles[0]
  const sideArticles = articles.slice(1, 4)
  const gridArticles = articles.slice(4)

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 mb-16">
        
        {/* Hero Story */}
        <Link href={`/news/${heroArticle.slug}`} className="lg:w-2/3 group relative block overflow-hidden rounded-2xl shadow-xl bg-gray-900">
          <div className="relative h-[400px] md:h-[550px] w-full">
            <Image 
              src={heroArticle.image?.url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167"} 
              fill 
              className="object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-80" 
              alt={heroArticle.title} 
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full max-w-3xl">
              <span className="bg-[#C8102E] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-md mb-4 inline-block">
                {getDisplayCategory(heroArticle.category)}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 group-hover:text-gray-300 transition-colors">
                {heroArticle.title}
              </h1>
              <p className="text-gray-300 text-base md:text-lg line-clamp-2 leading-relaxed">
                {heroArticle.summary}
              </p>
            </div>
          </div>
        </Link>

        {/* Sidebar */}
        <div className="lg:w-1/3 flex flex-col gap-6 bg-white dark:bg-[#1a1b23] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest border-b-2 border-[#C8102E] pb-2 inline-block">Trending Now</h2>
          <div className="flex flex-col gap-6 mt-2">
            {sideArticles.map((article: any) => (
              <Link href={`/news/${article.slug}`} key={article.id} className="group flex gap-4 items-center border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                <div className="relative h-20 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <Image src={article.image?.url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167"} fill className="object-cover group-hover:scale-110 transition-transform duration-500" alt="thumb" />
                </div>
                <div className="flex-grow">
                  <span className="text-[#C8102E] text-[9px] font-black uppercase tracking-widest block mb-1">
                    {getDisplayCategory(article.category)}
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-3 group-hover:text-[#C8102E] transition-colors leading-snug">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {gridArticles.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-800 pt-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Latest Updates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridArticles.map((article: any) => (
              <NewsCard 
                key={article.id}
                title={article.title}
                slug={article.slug}
                excerpt={article.summary || "Click to read the full story and dive deep into the analysis."}
                imageUrl={article.image?.url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80"}
                category={getDisplayCategory(article.category)}
                date={article.publishedDate || article.publishedAt}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}