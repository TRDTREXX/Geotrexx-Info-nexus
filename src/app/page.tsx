import NewsCard from '../components/NewsCard'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const HYGRAPH_ENDPOINT = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master"

async function getLatestArticles() {
  const query = `
    query GetHomepageArticles {
      articles(first: 21, orderBy: publishedAt_DESC) {
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
    const res = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      cache: 'no-store'
    })
    
    const json = await res.json()
    if (json.errors) return { data: [], error: json.errors[0].message }
    return { data: json.data?.articles || [], error: null }
  } catch (error: any) {
    return { data: [], error: error.message }
  }
}

export default async function HomePage() {
  const { data: articles, error } = await getLatestArticles()

  if (error) {
    return (
      <div className="w-full py-32 flex justify-center text-center px-4">
        <p className="text-red-500 font-bold border-2 border-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
          Database Connection Error: {error}
        </p>
      </div>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="w-full py-40 flex flex-col items-center justify-center text-center px-4 min-h-[70vh]">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">
          No News Published Yet
        </h1>
        <p className="text-gray-500 text-lg">
          Publish an article in Hygraph to see it here!
        </p>
      </div>
    )
  }

  const heroArticle = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-4 w-4 bg-[#C8102E] animate-pulse rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-widest">
            Latest Headlines
          </h2>
        </div>
        
        <Link href={`/news/${heroArticle.slug}`} className="group relative block w-full h-[50vh] md:h-[60vh] min-h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
          <Image 
            src={heroArticle.image?.url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167"} 
            alt={heroArticle.title}
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-5xl">
            <span className="inline-block bg-[#C8102E] text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest mb-4">
              {heroArticle.category || 'General News'}
            </span>
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight group-hover:text-gray-300 transition-colors">
              {heroArticle.title}
            </h3>
            <p className="text-gray-300 text-lg md:text-xl line-clamp-2 md:line-clamp-3 font-light max-w-3xl">
              {heroArticle.summary}
            </p>
          </div>
        </Link>
      </div>

      {gridArticles.length > 0 && (
        <>
          <div className="border-b-2 border-gray-200 dark:border-gray-800 mb-8 pb-4">
             <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest">
               More News
             </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {gridArticles.map((article: any) => (
              <NewsCard 
                key={article.id}
                title={article.title}
                slug={article.slug}
                excerpt={article.summary || "Click to read the full story and dive deep into the analysis."}
                imageUrl={article.image?.url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167"}
                category={article.category || 'General'}
                date={article.publishedDate || article.publishedAt}
              />
            ))}
          </div>
        </>
      )}
    </main>
  )
}