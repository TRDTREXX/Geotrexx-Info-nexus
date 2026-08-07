import Image from 'next/image'
import Link from 'next/link'

const CMS_URL = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master"

// Safe Fetcher
async function getArticles() {
  try {
    const query = `
      query { 
        articles(orderBy: publishedAt_DESC) { 
          id title slug summary category
          image { url } 
        } 
      }
    `
    const res = await fetch(CMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      next: { revalidate: 60 } // ISR: Revalidate every 60 seconds
    })
    const json = await res.json()
    return json.data?.articles || []
  } catch (error) {
    return []
  }
}

export default async function Home() {
  const articles = await getArticles()
  const heroArticle = articles[0]
  const trendingArticles = articles.slice(1, 7)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Hero Section */}
      {heroArticle && (
        <section className="mb-16 animate-fade-in-up">
          <Link href={`/news/${heroArticle?.slug}`} className="group relative block w-full h-[60vh] min-h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src={heroArticle?.image?.url || '/fallback.jpg'} 
              alt={heroArticle?.title || 'News'}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-geo-dark via-geo-dark/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-3/4">
              <span className="bg-geo-red text-white text-xs font-black uppercase px-3 py-1 rounded shadow-lg mb-4 inline-block">
                {heroArticle?.category || 'Breaking'}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 group-hover:text-geo-red transition-colors">
                {heroArticle?.title}
              </h1>
              <p className="text-gray-300 text-lg line-clamp-2 md:line-clamp-3 font-serif">
                {heroArticle?.summary}
              </p>
            </div>
          </Link>
        </section>
      )}

      {/* Trending Grid */}
      <section>
        <h2 className="text-3xl font-black uppercase tracking-tight mb-8 border-b-2 border-gray-200 dark:border-gray-800 pb-4">
          Trending Now
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingArticles.map((article: any) => (
            <Link key={article.id} href={`/news/${article?.slug}`} className="group flex flex-col bg-white dark:bg-geo-gray rounded-xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none dark:border dark:border-gray-800 transition-all duration-300 hover:-translate-y-1">
              <div className="w-full aspect-video relative overflow-hidden bg-gray-200 dark:bg-gray-800">
                {article?.image?.url && (
                  <Image 
                    src={article.image.url} 
                    alt={article.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                )}
                <div className="absolute top-4 left-4 bg-geo-red text-white text-[10px] font-black uppercase px-3 py-1 rounded shadow-sm">
                  {article?.category || 'News'}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-snug mb-3 group-hover:text-geo-red transition-colors line-clamp-3">
                  {article?.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mt-auto font-serif">
                  {article?.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}