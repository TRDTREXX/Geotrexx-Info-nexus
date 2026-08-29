import { client } from '../../../sanity/lib/client';
import { urlFor } from '../../../sanity/lib/image';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

// 🔥 Kills the page cache so new articles show up instantly
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = resolvedParams.section.charAt(0).toUpperCase() + resolvedParams.section.slice(1);

  return {
    title: `${categoryName} News | GEOTREXX`,
    description: `Read the latest breaking news, in-depth analysis, and authoritative updates about ${categoryName} from the GEOTREXX desk.`,
  };
}

const query = `*[_type == "article" && category == $section] | order(publishedAt desc) {
  _id,
  title,
  summary,
  "slug": slug.current,
  publishedAt,
  mainImage
}`;

export default async function CategoryPage({ params }: { params: Promise<{ section: string }> }) {
  const resolvedParams = await params;
  // Safety check: force the URL param to lowercase (e.g., "World" becomes "world") to match the database exactly
  const safeSection = resolvedParams.section.toLowerCase(); 
  
  const articles = await client.fetch(
    query, 
    { section: safeSection },
    { cache: 'no-store' } // Bypass Sanity cache
  );
  
  const categoryTitle = safeSection.charAt(0).toUpperCase() + safeSection.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12 border-b-4 border-[#C8102E] pb-4 inline-block">
        <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tighter">
          {categoryTitle}
        </h1>
      </header>

      {articles.length === 0 ? (
        <p className="text-gray-500 font-medium text-lg">No articles published in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: any) => (
            <Link href={`/news/${article.slug}`} key={article._id} className="group flex flex-col gap-4">
              {article.mainImage && (
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={urlFor(article.mainImage).url()}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-[#C8102E] uppercase tracking-widest mb-2">
                  {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <h2 className="text-xl font-bold text-black dark:text-white group-hover:text-[#C8102E] transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-3">
                  {article.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}