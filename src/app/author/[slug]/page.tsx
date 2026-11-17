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

const AUTHOR_ARCHIVE_QUERY = `{
  "authors": *[_type == "author"] {
    _id,
    name,
    "slug": slug.current,
    role,
    bio,
    image
  },
  "articles": *[_type in ["article", "post"] && defined(slug.current) && defined(mainImage.asset) && !(_id in path("drafts.**"))] | order(coalesce(publishedAt, publishDate, date, _createdAt) desc) {
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
    "authorId": author->_id,
    "authorName": author->name,
    "authorSlug": author->slug.current,
    publishedAt,
    publishDate,
    date,
    _createdAt,
    mainImage
  }
}`;

export default async function AuthorDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const normalizedSlug = decodeURIComponent(slug).toLowerCase();

  const data = await client.fetch(AUTHOR_ARCHIVE_QUERY, {}, { cache: 'no-store' });
  const authors: any[] = data?.authors || [];
  const allArticles: any[] = data?.articles || [];

  const matchedAuthor = authors.find((a) => (a.slug && a.slug.toLowerCase() === normalizedSlug) || (a.name && toSlug(a.name) === normalizedSlug));

  const authorArticles = allArticles
    .filter((art) => {
      const bodyLen = toPlainText(art.body).trim().length;
      const sumLen = toPlainText(art.summary).trim().length;
      if (bodyLen < 80 && sumLen < 40) return false;
      if (matchedAuthor && art.authorId === matchedAuthor._id) return true;
      if (art.authorSlug && art.authorSlug.toLowerCase() === normalizedSlug) return true;
      if (art.authorName && toSlug(art.authorName) === normalizedSlug) return true;
      return false;
    })
    .map((art) => {
      const dateObj = resolveExactDate(art);
      return {
        ...art,
        exactTimestamp: dateObj.timestamp,
        formattedDate: dateObj.formatted,
        cleanSummary: toPlainText(art.summary).trim() || `${toPlainText(art.body).slice(0, 180)}...`,
        imageUrl: urlFor(art.mainImage).width(900).height(600).url(),
      };
    })
    .sort((a, b) => b.exactTimestamp - a.exactTimestamp);

  const displayName = matchedAuthor?.name || authorArticles[0]?.authorName || normalizedSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const authorBio = toPlainText(matchedAuthor?.bio);
  const fallbackAvatar = normalizedSlug.includes('quist') ? '/quist.jpg.jpeg' : '/orpheus.jpg.jpeg';
  const avatarUrl = matchedAuthor?.image ? urlFor(matchedAuthor.image).width(400).height(400).url() : fallbackAvatar;

  const desksCovered = Array.from(new Set(authorArticles.map((a) => String(a.category || '').toUpperCase()).filter(Boolean)));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white text-geotrexx-black">
      <div className="border-t-[4px] border-geotrexx-black border-b-2 pb-8 pt-6 mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-geotrexx-black p-0.5 bg-white shrink-0 overflow-hidden">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover object-top rounded-full"
              />
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-geotrexx-crimson block mb-1">
                GEOTREXX Correspondent Archive
              </span>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-geotrexx-black leading-none">
                {displayName}
              </h1>
              {authorBio && (
                <p className="text-sm md:text-base font-serif text-gray-800 max-w-2xl mt-2.5 leading-relaxed">
                  {authorBio}
                </p>
              )}
            </div>
          </div>

          <div className="border-2 border-geotrexx-black bg-white p-4 flex items-center gap-6 shrink-0">
            <div>
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500">
                Published Reports
              </span>
              <span className="text-2xl md:text-3xl font-black font-mono text-geotrexx-black">
                {authorArticles.length}
              </span>
            </div>
            <div className="h-10 w-[1px] bg-gray-300" />
            <div>
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500">
                Desks Covered
              </span>
              <span className="text-xs font-mono font-bold uppercase text-geotrexx-crimson block mt-1">
                {desksCovered.length > 0 ? desksCovered.join(' • ') : 'NEWSROOM'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs md:text-sm font-black uppercase tracking-widest text-geotrexx-black">
          All Reports by {displayName}
        </h2>
        <span className="text-[11px] font-mono uppercase text-gray-600">
          Sorted by Exact Publication Date
        </span>
      </div>

      {authorArticles.length === 0 ? (
        <div className="border border-geotrexx-black p-10 text-center">
          <p className="text-sm font-mono uppercase tracking-widest">
            No published reports found for {displayName}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authorArticles.map((article) => (
            <Link
              key={article._id}
              href={`/news/${article.slug}`}
              className="group flex flex-col no-underline border-b border-geotrexx-black pb-6"
            >
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
                  {article.subsection ? ` • ${String(article.subsection).replace(/-/g, ' ').toUpperCase()}` : ''}
                </span>
                <span className="text-[10px] font-mono font-bold text-geotrexx-black">
                  {article.formattedDate}
                </span>
              </div>

              <h3 className="text-lg font-bold leading-snug text-geotrexx-black group-hover:text-geotrexx-crimson transition-colors mb-2">
                {article.title}
              </h3>

              <p className="text-sm font-serif text-gray-700 line-clamp-2 leading-relaxed">
                {article.cleanSummary}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}