import NewsCard from '../components/NewsCard'

// Your live Hygraph Endpoint
const HYGRAPH_ENDPOINT = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master"

// GraphQL Query to fetch latest posts
const getLatestPosts = async () => {
  const query = `
    query GetPosts {
      posts(orderBy: createdAt_DESC, first: 6) {
        id
        title
        slug
        excerpt
        createdAt
        category
        coverImage {
          url
        }
      }
    }
  `

  try {
    const res = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      next: { revalidate: 60 } // Revalidate cache every 60 seconds (Enterprise performance)
    })
    
    const json = await res.json()
    return json.data.posts
  } catch (error) {
    console.error("Failed to fetch posts:", error)
    return []
  }
}

export default async function Home() {
  const posts = await getLatestPosts()

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Enterprise Section Header */}
      <div className="flex items-end justify-between border-b-2 border-gray-200 dark:border-gray-800 pb-4 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Top Stories</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">The latest updates from around the globe.</p>
        </div>
        <span className="hidden md:block text-sm font-bold uppercase text-[#C8102E] tracking-widest cursor-pointer hover:opacity-80">View All News &rarr;</span>
      </div>

      {/* Grid Layout based on 8px system */}
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <NewsCard 
              key={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt || "Click to read the full story and dive deep into the analysis."}
              imageUrl={post.coverImage?.url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80"}
              category={post.category || "News"}
              date={post.createdAt}
            />
          ))}
        </div>
      ) : (
        /* Empty State / Error Fallback */
        <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-[#1a1b23] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Stories Available</h2>
          <p className="text-gray-500">Our editorial team is currently updating the news desk. Check back shortly.</p>
        </div>
      )}
      
    </div>
  )
}