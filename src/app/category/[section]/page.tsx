import { client } from '../../../sanity/lib/client';
import { urlFor } from '../../../sanity/lib/image';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = resolvedParams.section.replace('-', ' ').toUpperCase();
  return {
    title: `${categoryName} News | GEOTREXX`,
    description: `Read the latest breaking news and in-depth analysis on ${categoryName}.`,
  };
}

// 🔥 THE ULTIMATE SEARCH QUERY: Aggressively checks exact matches AND fuzzy matches across all sections
const query = `*[_type == "article" && (
  category == $raw || category match $raw || category == $stripped || category match $stripped ||
  subGhana == $raw || subGhana match $raw || subGhana == $stripped || subGhana match $stripped ||
  subPolitics == $raw || subPolitics match $raw || subPolitics == $stripped || subPolitics match $stripped ||
  subSports == $raw || subSports match $raw || subSports == $stripped || subSports match $stripped ||
  subStem == $raw || subStem match $raw || subStem == $stripped || subStem match $stripped ||
  subEntertainment == $raw || subEntertainment match $raw || subEntertainment == $stripped || subEntertainment match $stripped ||
  subWorld == $raw || subWorld match $raw || subWorld == $stripped || subWorld match $stripped ||
  subOpinion == $raw || subOpinion match $raw || subOpinion == $stripped || subOpinion match $stripped ||
  subBusiness == $raw || subBusiness match $raw || subBusiness == $stripped || subBusiness match $stripped
)] | order(publishedAt desc) {
  _id,
  title,
  summary,
  "slug": slug.current,
  publishedAt,
  category,
  "subsection": coalesce(subGhana, subPolitics, subSports, subStem, subEntertainment, subWorld, subOpinion, subBusiness),
  mainImage
}`;

export default async function CategoryPage({ params }: { params: Promise<{ section: string }> }) {
  const resolvedParams = await params;
  const rawSection = resolvedParams.section.toLowerCase(); 
  
  let strippedSection = rawSection;
  const prefixes = ['world-', 'ghana-', 'sports-', 'stem-', 'entertainment-', 'opinion-', 'business-', 'politics-'];
  for (const prefix of prefixes) {
    if (strippedSection.startsWith(prefix) && strippedSection !== 'ghana-politics') {
      strippedSection = strippedSection.replace(prefix, '');
    }
  }
  
  const articles = await client.fetch(query, { raw: rawSection, stripped: strippedSection }, { cache: 'no-store' });
  const categoryTitle = rawSection.replace('-', ' ').toUpperCase();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12 border-b-4 border-[#C8102E] pb-4 inline-block">
        <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tighter">
          {categoryTitle}
        </h1>
      </header>

      {articles.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-[#1a1b23] rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 font-medium text-lg">Stories are currently being updated for this section.</p>
          <p className="text-xs text-gray-400 mt-4 font-mono">DEBUG: Next.js searched Sanity for: "{rawSection}" and "{strippedSection}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: any) => (
            <Link href={`/news/${article.slug}`} key={article._id} className="group flex flex-col gap-4">
              {article.mainImage?.asset && (
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <div className="absolute top-4 left-4 z-10 bg-[#C8102E] text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm shadow-sm">
                    {article.category || 'NEWS'}
                  </div>
                  <Image src={urlFor(article.mainImage).url()} alt={article.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-[#C8102E] uppercase tracking-widest mb-2">
                  {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <h2 className="text-xl font-bold text-black dark:text-white group-hover:text-[#C8102E] transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}