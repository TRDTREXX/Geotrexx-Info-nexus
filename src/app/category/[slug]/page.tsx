import NewsCard from '../../../components/NewsCard'

const HYGRAPH_ENDPOINT = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master"

// Utility to capitalize the category name (e.g., "sports" -> "Sports")
const formatCategory = (slug: string) => slug.charAt(0).toUpperCase() + slug.slice(1)

// Fetch posts filtered by category
async function getCategoryPosts(category: string) {
  const query = `
    query GetCategoryPosts($category: String!) {
      posts(where: { category: $category }, orderBy: createdAt_DESC) {
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
      body: JSON.stringify({ query, variables: { category } }),
      next: { revalidate: 60 } // Enterprise edge caching
    })
    const json = await res.json()
    return json.data?.posts || []
  } catch (error) {
    console.error("Failed to fetch category posts:", error)
    return []
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = formatCategory(params.slug)
  const posts = await getCategoryPosts(categoryName)

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Premium Category Hero Banner */}
      <div className="bg-[#1a1b23] text-white rounded-2xl p-10 mb-12 shadow-2xl border-l-8 border-[#C8102E] relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-4">{categoryName}</h1>
          <p className="text-gray-400 text-lg max-w-2xl">The latest breaking news, deep analytics, and exclusive reports on {categoryName}.</p>
        </div>
        {/* Subtle background element for luxury feel */}
        <div className="absolute -right-20 -top-20 opacity-5 text-[15rem] font-black uppercase pointer-events-none">
          {categoryName}
        </div>
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
              category={post.category || categoryName}
              date={post.createdAt}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-[#1a1b23] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Stories in {categoryName}</h2>
          <p className="text-gray-500">Our editorial team is currently updating this section. Check back shortly.</p>
        </div>
      )}
      
    </div>
  )
}