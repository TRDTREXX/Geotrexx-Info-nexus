export const dynamic = 'force-dynamic'
export const revalidate = 0

// Switched back to exact relative paths to fix the Vercel build error
import { client } from '../../../../sanity/lib/client'
import { urlFor } from '../../../../sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'

export default async function SubsectionPage({ params }: { params: Promise<{ section: string; subsection: string }> }) {
  const { section, subsection } = await params

  // Fetch articles that perfectly match the URL's section and subsection
  const articles = await client.fetch(
    `*[_type in ["post", "article", "news"] && category == $section && subsection == $subsection && !(_id in path("drafts.**"))] | order(_updatedAt desc){
      _id,
      title,
      "slug": slug.current,
      "summary": coalesce(summary, description),
      mainImage,
      publishedAt,
      "authorName": coalesce(author->name, writer->name, byline, authorName, "GEOTREXX MEDIA GROUP")
    }`,
    { section, subsection },
    { cache: 'no-store' }
  )

  // Formats the URL text (like "ghana-politics") into a clean Header (like "GHANA POLITICS")
  const formattedTitle = subsection.replace(/-/g, ' ').toUpperCase()

  return (
    <main className="w-full bg-white dark:bg-[#0a0b10] min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-b-2 border-gray-100 dark:border-gray-900 pb-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="w-2 h-2 bg-[#dc143c] rounded-full"></span>
            <span className="text-[#dc143c] font-black uppercase tracking-widest text-sm">
              {section.toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black dark:text-white uppercase tracking-tight">
            {formattedTitle}
          </h1>
        </header>

        {articles.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-gray-300 dark:border-gray-800 rounded-lg">
            <p className="text-xl md:text-2xl text-gray-500 font-medium">Stories are currently being updated for this section.</p>
            <p className="text-sm text-gray-400 mt-2">Check back soon for the latest {formattedTitle} coverage.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => (
              <Link href={`/news/${article.slug}`} key={article._id} className="group flex flex-col h-full bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative w-full aspect-[16/9] bg-gray-100 dark:bg-gray-900 overflow-hidden">
                  {article.mainImage?.asset ? (
                    <Image
                      src={urlFor(article.mainImage).width(600).height(400).url()}
                      alt={article.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a]">
                      <span className="text-[#dc143c] font-black text-3xl opacity-20">GEOTREXX</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-3 group-hover:text-[#dc143c] transition-colors leading-snug">
                    {article.title}
                  </h2>
                  
                  {article.summary && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">
                      {article.summary}
                    </p>
                  )}
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                      {article.authorName}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}