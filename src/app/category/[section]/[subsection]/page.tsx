import Link from 'next/link';
import Image from 'next/image';
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

function formatSubLabel(raw: string) {
  return raw
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (l) => l.toUpperCase());
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

const SUBSECTION_QUERY = `*[_type in ["article", "post"] && defined(slug.current) && defined(mainImage.asset) && !(_id in path("drafts.**"))] | order(coalesce(publishedAt, publishDate, date, _createdAt) desc) {
  _id,
  title,
  "slug": slug.current,
  summary,
  body,
  "authorName": coalesce(author->name, "Orpheus Grant-Essilfie"),
  "authorSlug": author->slug.current,
  "category": lower(coalesce(category->title, category, section, "ghana")),
  "subsection": coalesce(
    subGhana,
    subPolitics,
    subSports,
    subStem,
    subEntertainment,
    subWorld,
    subOpinion,
    subBusiness,
    subsection->title,
    subCategory->title,
    subsection,
    subCategory,
    ""
  ),
  publishedAt,
  publishDate,
  date,
  _createdAt,
  mainImage
}`;

export default async function CategorySubsectionPage({
  params,
}: {
  params: Promise<{ section: string; subsection: string }>;
}) {
  const { section, subsection } = await params;
  const normalizedSection = decodeURIComponent(section).toLowerCase();
  const normalizedSub = decodeURIComponent(subsection).toLowerCase();

  const rawPosts: any[] = await client.fetch(SUBSECTION_QUERY, {}, { cache: 'no-store' });

  const allPosts = rawPosts
    .map((post) => {
      const bodyText = toPlainText(post.body);
      const cleanSummary = toPlainText(post.summary) || bodyText.slice(0, 180);
      const imageUrl = post.mainImage
        ? urlFor(post.mainImage).width(1000).height(625).fit('crop').auto('format').quality(85).url()
        : null;
      const rawSub = String(post.subsection || '').trim();
      const dateObj = resolveExactDate(post);

      return {
        ...post,
        bodyText,
        cleanSummary,
        imageUrl,
        cleanSub: rawSub ? formatSubLabel(rawSub) : '',
        subSlug: rawSub ? toSlug(rawSub) : '',
        exactTimestamp: dateObj.timestamp,
        formattedDate: dateObj.formatted,
        resolvedAuthorSlug: post.authorSlug || toSlug(post.authorName || 'Orpheus Grant-Essilfie'),
      };
    })
    .filter((p) => p.imageUrl && (p.bodyText.length >= 80 || p.cleanSummary.length >= 40))
    .sort((a, b) => b.exactTimestamp - a.exactTimestamp);

  const matchedSubArticles = allPosts.filter((post) => {
    if (post.subSlug === normalizedSub) return true;
    if (post.subSlug && (post.subSlug.includes(normalizedSub) || normalizedSub.includes(post.subSlug))) return true;
    return false;
  });

  const displayTitle = matchedSubArticles[0]?.cleanSub || formatSubLabel(normalizedSub);
  const leadStory = matchedSubArticles[0];
  const restStories = matchedSubArticles.slice(1);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white text-geotrexx-black">
      <div className="w-full border-t-[4px] border-geotrexx-black pt-3 mb-8 border-b-2 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest mb-1">
            <Link
              href={`/category/${normalizedSection}`}
              className="text-geotrexx-crimson hover:underline no-underline"
            >
              {normalizedSection}
            </Link>
            <span>/</span>
            <span className="text-geotrexx-black">{displayTitle}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-geotrexx-black">
            {displayTitle}
          </h1>
        </div>

        <Link
          href={`/category/${normalizedSection}`}
          className="px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border border-geotrexx-black bg-white text-geotrexx-black hover:bg-geotrexx-black hover:text-white no-underline transition-colors self-start sm:self-auto"
        >
          &larr; All {normalizedSection}
        </Link>
      </div>

      {matchedSubArticles.length === 0 ? (
        <div className="py-12 border border-geotrexx-black p-6 text-center">
          <p className="text-sm font-mono uppercase tracking-widest text-geotrexx-black">
            No verified reports filed under {displayTitle} yet.
          </p>
        </div>
      ) : (
        <>
          {leadStory && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 mb-10 border-b-2 border-geotrexx-black">
              {leadStory.imageUrl && (
                <div className="lg:col-span-7">
                  <Link
                    href={`/news/${leadStory.slug}`}
                    className="block relative aspect-[16/10] border border-geotrexx-black overflow-hidden bg-white"
                  >
                    <Image
                      src={leadStory.imageUrl}
                      alt={leadStory.title}
                      fill
                      className="object-cover object-top rounded-none"
                      priority
                    />
                  </Link>
                </div>
              )}
              <div className={leadStory.imageUrl ? 'lg:col-span-5 flex flex-col justify-center' : 'lg:col-span-12'}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-geotrexx-crimson text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest">
                    {displayTitle}
                  </span>
                  <span className="text-[11px] font-mono text-gray-600">
                    {leadStory.formattedDate}
                  </span>
                </div>
                <Link href={`/news/${leadStory.slug}`} className="group no-underline">
                  <h2 className="text-2xl md:text-4xl font-black leading-tight text-geotrexx-black group-hover:text-geotrexx-crimson transition-colors mb-3">
                    {leadStory.title}
                  </h2>
                </Link>
                {leadStory.cleanSummary && (
                  <p className="text-base font-serif text-geotrexx-black leading-relaxed mb-3">
                    {leadStory.cleanSummary}
                  </p>
                )}
                <Link
                  href={`/author/${leadStory.resolvedAuthorSlug}`}
                  className="text-[11px] font-mono font-bold uppercase text-geotrexx-black hover:text-geotrexx-crimson no-underline"
                >
                  By {leadStory.authorName} &rarr;
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {restStories.map((article) => (
              <div key={article._id} className="flex flex-col border-b border-geotrexx-black pb-5">
                <Link href={`/news/${article.slug}`} className="group block no-underline">
                  {article.imageUrl && (
                    <div className="relative w-full aspect-[16/10] mb-3 border border-geotrexx-black overflow-hidden bg-white">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover object-top rounded-none"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-geotrexx-crimson">
                      {article.cleanSub || displayTitle}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold leading-snug text-geotrexx-black group-hover:text-geotrexx-crimson transition-colors mb-2">
                    {article.title}
                  </h3>
                </Link>
                <div className="flex items-center justify-between text-[11px] font-mono text-geotrexx-black mt-auto pt-2">
                  <Link
                    href={`/author/${article.resolvedAuthorSlug}`}
                    className="font-bold text-geotrexx-black hover:text-geotrexx-crimson no-underline"
                  >
                    By {article.authorName}
                  </Link>
                  <span>{article.formattedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}