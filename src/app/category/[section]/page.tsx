import { client } from '../../../sanity/lib/client';
import NewsCard from '../../../components/NewsCard';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const revalidate = 60;

const query = `*[_type == "article" && (lower(category) == lower($section) || lower(mainSection) == lower($section))] | order(publishedAt desc) {
  _id,
  title,
  slug,
  summary,
  publishedAt,
  "categoryName": category,
  "subsectionName": coalesce(subGhana, subPolitics, subSports, subStem, subEntertainment, subWorld, subOpinion, subBusiness),
  "authorName": author->name,
  "authorImage": author->image,
  mainImage
}`;

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const formattedTitle = section.charAt(0).toUpperCase() + section.slice(1);

  return {
    title: `${formattedTitle} News & Analysis | GEOTREXX`,
    description: `Read verified ${formattedTitle} journalism and reports from GEOTREXX Media Group.`,
    metadataBase: new URL('https://www.geotrexx.com'),
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const articles = await client.fetch(query, { section });

  // 404 Safety Net: Kill page for Google bots if category has 0 published articles
  if (!articles || articles.length === 0) {
    notFound();
  }

  const sectionTitle = section.toUpperCase();

  return (
    <main className="min-h-screen bg-white text-[#121826] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 border-b-2 border-gray-900 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C8102E] uppercase tracking-widest mb-2">
            <span>SECTION</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-black" style={{ fontFamily: 'Oswald, sans-serif' }}>
            {sectionTitle}
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: any) => (
            <NewsCard key={article._id} article={article} />
          ))}
        </div>
      </div>
    </main>
  );
}