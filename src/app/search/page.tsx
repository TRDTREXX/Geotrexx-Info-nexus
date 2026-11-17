import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function toPlainText(blocks: any) {
  if (!blocks) return '';
  if (typeof blocks === 'string') return blocks;
  if (Array.isArray(blocks)) {
    return blocks
      .map((block) => {
        if (block._type !== 'block' || !block.children) return '';
        return block.children.map((child: any) => child.text).join('');
      })
      .join(' ');
  }
  return '';
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function resolveExactDate(post: any): { timestamp: number; formatted: string } {
  const candidates = [post.publishedAt, post.publishDate, post.date, post._createdAt];
  for (const raw of candidates) {
    if (raw && typeof raw === 'string' && raw.trim().length > 0) {
      const ms = Date.parse(raw);
      if (!Number.isNaN(ms)) {
        const d = new Date(ms);
        return {
          timestamp: ms,
          formatted: d.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'Africa/Accra',
          }),
        };
      }
    }
  }
  return { timestamp: 0, formatted: '' };
}

const SEARCH_DATABASE_QUERY = `*[_type in ["article", "post"] && defined(slug.current) && defined(mainImage.asset) && !(_id in path("drafts.**"))] | order(coalesce(publishedAt, publishDate, date, _createdAt) desc) [0...150] {
  _id,
  title,
  "slug": slug.current,
  summary,
  body,
  "category": coalesce(category->title, category, section, "News"),
  "subsection": coalesce(
    subGhana,
    subPolitics,
    subSports,
    subStem,
    subEntertainment,
    subWorld,
    subOpinion,
    subBusiness,
    subsection
  ),
  "authorName": coalesce(author->name, "Orpheus Grant-Essilfie"),
  "authorSlug": author->slug.current,
  publishedAt,
  publishDate,
  date,
  _createdAt,
  mainImage
}`;

export default async function SearchDatabasePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; desk?: string }>;
}) {
  const resolvedParams = await searchParams;
  const rawQuery = (resolvedParams?.q || '').trim();
  const selectedDesk = (resolvedParams?.desk || '').trim().toLowerCase();
  const normalizedQuery = rawQuery.toLowerCase();

  let rawPosts: any[] = [];
  try {
    rawPosts = await client.fetch(SEARCH_DATABASE_QUERY, {}, { cache: 'no-store' });
  } catch (err) {
    console.error('Search fetch error:', err);
  }

  const allArticles = rawPosts
    .map((post) => {
      const bodyText = toPlainText(post.body).trim();
      const summaryText = toPlainText(post.summary).trim();
      const dateObj = resolveExactDate(post);

      return {
        ...post,
        bodyText,
        cleanSummary: summaryText || `${bodyText.slice(0, 180)}...`,
        exactTimestamp: dateObj.timestamp,
        formattedDate: dateObj.formatted,
        resolvedAuthorSlug: post.authorSlug || toSlug(post.authorName || 'Orpheus Grant-Essilfie'),
        imageUrl: urlFor(post.mainImage).width(900).height(600).url(),
      };
    })
    .filter((p) => p.bodyText.length >= 80 || p.cleanSummary.length >= 40)
    .sort((a, b) => b.exactTimestamp - a.exactTimestamp);

  const filteredResults = allArticles.filter((art) => {
    const haystack = `${art.title} ${art.cleanSummary} ${art.bodyText} ${art.category} ${art.subsection || ''} ${art.authorName}`.toLowerCase();

    if (selectedDesk && !haystack.includes(selectedDesk)) {
      return false;
    }

    if (!normalizedQuery) return true;

    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    return terms.every((term) => haystack.includes(term));
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white text-geotrexx-black min-h-screen">
      <div className="w-full border-t-[4px] border-geotrexx-black pt-4 pb-6 mb-8 border-b-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-geotrexx-crimson block mb-1">
          GEOTREXX Intelligence Archive
        </span>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-geotrexx-black mb-6">
          Search News Database
        </h1>

        <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="q"
            defaultValue={rawQuery}
            placeholder="Search by headline, keyword, politician, institution, or author..."
            className="flex-1 px-4 py-3 text-sm md:text-base font-mono border-2 border-geotrexx-black bg-white text-geotrexx-black focus:outline-none focus:border-geotrexx-crimson"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-geotrexx-crimson text-white text-xs md:text-sm font-mono font-black uppercase tracking-widest border-2 border-geotrexx-black hover:bg-geotrexx-black transition-colors cursor-pointer"
          >
            Search Database
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-[11px] font-mono font-bold uppercase text-gray-600 mr-1">
            Filter Desk:
          </span>
          {[
            { label: 'All Archive', value: '' },
            { label: 'Ghana', value: 'ghana' },
            { label: 'Politics', value: 'politics' },
            { label: 'World', value: 'world' },
            { label: 'Business & Tech', value: 'business' },
            { label: 'TREXXfield Sports', value: 'sports' },
          ].map((pill) => {
            const active = selectedDesk === pill.value;
            const href = pill.value
              ? `/search?q=${encodeURIComponent(rawQuery)}&desk=${pill.value}`
              : `/search?q=${encodeURIComponent(rawQuery)}`;
            return (
              <Link
                key={pill.label}
                href={href}
                className={`px-3 py-1 text-[11px] font-mono font-bold uppercase border border-geotrexx-black no-underline transition-colors ${
                  active
                    ? 'bg-geotrexx-black text-white'
                    : 'bg-white text-geotrexx-black hover:bg-geotrexx-crimson hover:text-white'
                }`}
              >
                {pill.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs md:text-sm font-black uppercase tracking-widest text-geotrexx-black">
          {rawQuery
            ? `Showing ${filteredResults.length} Result${filteredResults.length === 1 ? '' : 's'} for "${rawQuery}"`
            : `Complete Chronological Database (${filteredResults.length} Reports)`}
        </h2>
      </div>

      {filteredResults.length === 0 ? (
        <div className="border-2 border-geotrexx-black p-12 text-center">
          <p className="text-base font-mono font-bold uppercase tracking-widest text-geotrexx-black mb-2">
            No matching articles found in the database
          </p>
          <p className="text-sm font-serif text-gray-700 mb-4">
            Try searching a broader keyword or clearing the desk filter.
          </p>
          <Link
            href="/search"
            className="inline-block px-4 py-2 bg-geotrexx-black text-white text-xs font-mono font-bold uppercase no-underline"
          >
            Reset Search
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResults.map((article) => (
            <div
              key={article._id}
              className="flex flex-col border-b border-geotrexx-black pb-6"
            >
              <Link href={`/news/${article.slug}`} className="group block no-underline">
                <div className="relative w-full aspect-[3/2] mb-3 border border-geotrexx-black overflow-hidden bg-white">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover rounded-none"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-geotrexx-crimson">
                    {String(article.category).toUpperCase()}
                    {article.subsection
                      ? ` • ${String(article.subsection).replace(/-/g, ' ').toUpperCase()}`
                      : ''}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-geotrexx-black">
                    {article.formattedDate}
                  </span>
                </div>

                <h3 className="text-lg font-bold leading-snug text-geotrexx-black group-hover:text-geotrexx-crimson transition-colors mb-2">
                  {article.title}
                </h3>

                <p className="text-sm font-serif text-gray-700 line-clamp-2 leading-relaxed mb-3">
                  {article.cleanSummary}
                </p>
              </Link>

              <div className="mt-auto pt-2 flex items-center justify-between text-[11px] font-mono">
                <Link
                  href={`/author/${article.resolvedAuthorSlug}`}
                  className="font-bold text-geotrexx-black hover:text-geotrexx-crimson no-underline"
                >
                  By {article.authorName}
                </Link>
                <Link
                  href={`/news/${article.slug}`}
                  className="text-geotrexx-crimson font-bold uppercase no-underline hover:underline"
                >
                  Read &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}