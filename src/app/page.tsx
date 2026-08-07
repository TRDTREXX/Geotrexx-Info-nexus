import NewsCard from '../components/NewsCard'
import Image from 'next/image'
import Link from 'next/link'

const HYGRAPH_ENDPOINT = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master"

const getLatestPosts = async () => {
  const query = `
    query GetPosts {
      posts(orderBy: publishedDate_DESC, first: 7) {
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
      next: { revalidate: 0 } // Force fresh fetch for debugging
    })
    
    const json = await res.json()
    
    // Catch GraphQL Schema/Permission errors
    if (json.errors) {
      return { data: null, error: json.errors[0].message }
    }
    
    return { data: json.data?.posts || null, error: null }
  } catch (error: any) {
    // Catch Network errors
    return { data: null, error: error.message }
  }
}

export default async function Home() {
  const { data: posts, error } = await getLatestPosts()

  // 🚨 DIAGNOSTIC ERROR SCREEN 🚨
  if (error) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-2xl p-8 max-w-2xl">
          <h2 className="text-2xl font-black text-red-600 dark:text-red-400 mb-4 uppercase tracking-widest">Hygraph Connection Error</h2>
          <p className="text-gray-700 dark:text-gray-300 font-mono text-sm bg-white dark:bg-black p-4 rounded border border-gray-200 dark:border-gray-800 break-words shadow-inner">
            {error}
          </p>
          <p className="mt-6 text-sm text-gray-500 font-medium">Please copy or screenshot this exact error message!</p>
        </div>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">No Stories Available</h2>
      </div>
    )
  }

  const heroPost = posts[0]
  const sidePosts = posts.slice(1, 4)
  const gridPosts = posts.slice(4)

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Magazine Layout */}
      <div className="flex flex-col lg:flex-row gap-8 mb-16">
        <Link href={`/news/${heroPost.slug}`} className="lg:w-2/3 group relative block overflow-hidden rounded-2xl shadow-xl bg-gray-900">
          <div className="relative h-[400px] md:h-[550px] w-full">
            <Image 
              src={heroPost.image?.url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167"} 
              fill 
              className="object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-80" 
              alt={heroPost.title} 
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full max-w-3xl">
              <span className="bg-[#C8102E] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-md mb-4 inline-block">
                {heroPost.category || 'Featured'}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 group-hover:text-gray-300 transition-colors">
                {heroPost.title}
              </h1>
              <p className="text-gray-300 text-base md:text-lg line-clamp-2 leading-relaxed">
                {heroPost.summary}
              </p>
            </div>
          </div>
        </Link>

        {/* Sidebar */}
        <div className="lg:w-1/3 flex flex-col gap-6 bg-white dark:bg-[#1a1b23] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest border-b-2 border-[#C8102E] pb-2 inline-block">Trending Now</h2>
          <div className="flex flex-col gap-6 mt-2">
            {sidePosts.map((post: any) => (
              <Link href={`/news/${post.slug}`} key={post.id} className="group flex gap-4 items-center border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                <div className="relative h-20 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <Image src={post.image?.url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167"} fill className="object-cover group-hover:scale-110 transition-transform duration-500" alt="thumb" />
                </div>
                <div className="flex-grow">
                  <span className="text-[#C8102E] text-[9px] font-black uppercase tracking-widest block mb-1">
                    {post.category || 'News'}
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-3 group-hover:text-[#C8102E] transition-colors leading-snug">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {gridPosts.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-800 pt-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Latest Updates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post: any) => (
              <NewsCard 
                key={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.summary || "Click to read the full story and dive deep into the analysis."}
                imageUrl={post.image?.url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80"}
                category={post.category || "News"}
                date={post.publishedDate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}