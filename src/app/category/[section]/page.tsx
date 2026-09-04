import { client } from '../../../sanity/lib/client';
import { urlFor } from '../../../sanity/lib/image';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = resolvedParams.section.replace('-', ' ').toUpperCase();
  return {
    title: `${categoryName} News | GEOTREXX`,
  };
}

// THE FIX: Directly matches the exact dropdown value you select in Sanity Studio
const query = `*[_type == "article" && category == $section] | order(publishedAt desc) {
  _id,
  title,
  summary,
  "slug": slug.current,
  publishedAt,
  "categoryName": category,
  mainImage
}`;

export default async function CategoryPage({ params }: { params: Promise<{ section: string }> }) {
  const resolvedParams = await params;
  const safeSection = resolvedParams.section.toLowerCase(); 
  
  const articles = await client.fetch(
    query, 
    { section: safeSection }, 
    { next: { tags: ['articles', `category-${safeSection}`] } }
  );
  
  const categoryTitle = safeSection.replace('-', ' ').toUpperCase();

  return (
    <div className="bg-white min-h-screen text-[#121826]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        <header className="mb-12 border-b-4 border-[#C8102E] pb-4 inline-block">
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter" style={{ fontFamily: 'Oswald, sans-serif' }}>
            {categoryTitle}
          </h1>
        </header>

        {articles.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-500 font-medium text-lg">Stories are currently being updated for this section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => (
              <Link href={`/news/${article.slug}`} key={article._id} className="group flex flex-col gap-4">
                {article.mainImage && (
                  <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden bg-gray-100 border border-gray-200">
                    <div className="absolute top-4 left-4 z-10 bg-[#C8102E] text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm shadow-sm">
                      {article.categoryName || categoryTitle}
                    </div>
                    <Image 
                      src={urlFor(article.mainImage).url()} 
                      alt={article.title} 
                      fill 
                      className="object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-[#C8102E] uppercase tracking-widest mb-2 font-mono">
                    {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h2 className="text-xl font-bold text-black group-hover:text-[#0b2545] transition-colors line-clamp-2 leading-snug" style={{ fontFamily: 'Oswald, sans-serif' }}>
                    {article.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3" style={{ fontFamily: 'Newsreader, Georgia, serif' }}>
                    {article.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}