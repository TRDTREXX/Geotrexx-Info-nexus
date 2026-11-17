import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

export const revalidate = 60;

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

const SECTION_CONFIG: Record<
  string,
  {
    title: string;
    sanityCats: string[];
    titleFallback: string[];
    defaultSubsections: { name: string; slug: string }[];
  }
> = {
  ghana: {
    title: 'Ghana & National Affairs',
    sanityCats: ['ghana', 'national', 'entertainment'],
    titleFallback: ['accra', 'kumasi', 'tamale', 'uds', 'ghana'],
    defaultSubsections: [
      { name: 'National', slug: 'national' },
      { name: 'Crime & Justice', slug: 'crime-justice' },
      { name: 'Education', slug: 'education' },
      { name: 'Regions', slug: 'regions' },
    ],
  },
  politics: {
    title: 'Politics, Elections & Policy',
    sanityCats: ['politics', 'policy', 'opinion', 'governance'],
    titleFallback: ['parliament', 'speaker', 'bagbin', 'npp', 'ndc', 'election', 'delegate', 'minority', 'majority'],
    defaultSubsections: [
      { name: 'Elections', slug: 'elections' },
      { name: 'Parliament', slug: 'parliament' },
      { name: 'Public Policy', slug: 'policy' },
      { name: 'Governance', slug: 'governance' },
    ],
  },
  world: {
    title: 'World, Africa & Diaspora',
    sanityCats: ['world', 'africa', 'international', 'diaspora'],
    titleFallback: ['london', 'bronx', 'uk', 'usa', 'ecowas', 'nigeria', 'diaspora', 'american'],
    defaultSubsections: [
      { name: 'Africa', slug: 'africa' },
      { name: 'Diaspora', slug: 'diaspora' },
      { name: 'Global Affairs', slug: 'global' },
    ],
  },
  business: {
    title: 'Business, Economy & Tech',
    sanityCats: ['business', 'stem', 'tech', 'economy', 'finance'],
    titleFallback: ['bank of ghana', 'bog', 'cedi', 'inflation', 'imf', 'gprtu', 'fare', 'economy', 'market', 'tech', 'ai ', 'software', 'telecom'],
    defaultSubsections: [
      { name: 'Economy & Markets', slug: 'economy' },
      { name: 'Tech & STEM', slug: 'stem' },
      { name: 'Corporate & Energy', slug: 'corporate' },
    ],
  },
  sports: {
    title: 'TREXXfield Sports',
    sanityCats: ['sports', 'trexxfield', 'football'],
    titleFallback: ['barca', 'barcelona', 'arsenal', 'liverpool', 'ucl', 'premier league', 'black stars', 'gfa', 'football'],
    defaultSubsections: [
      { name: 'European Football', slug: 'european-football' },
      { name: 'Black Stars & Africa', slug: 'african-football' },
      { name: 'Tactics & Transfers', slug: 'tactics' },
    ],
  },
  trexxfield: {
    title: 'TREXXfield Sports',
    sanityCats: ['sports', 'trexxfield', 'football'],
    titleFallback: ['barca', 'barcelona', 'arsenal', 'liverpool', 'ucl', 'premier league', 'black stars', 'gfa', 'football'],
    defaultSubsections: [
      { name: 'European Football', slug: 'european-football' },
      { name: 'Black Stars & Africa', slug: 'african-football' },
      { name: 'Tactics & Transfers', slug: 'tactics' },
    ],
  },
};

const SECTION_QUERY = `*[_type in ["article", "post"] && defined(slug.current) && defined(mainImage.asset)] {
  _id,
  title,
  "slug": slug.current,
  summary,
  body,
  "authorName": coalesce(author->name, "Orpheus Grant-Essilfie"),
  "authorSlug": author->slug.current,
  "rawCategory": lower(coalesce(category->title, category, section, "")),
  "rawSubsection": lower(coalesce(subGhana, subPolitics, subSports, subStem, subWorld, subBusiness, subsection, "")),
  publishedAt,
  publishDate,
  date,
  _createdAt,
  mainImage
}`;

export default async function CategorySectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const normalizedSection = decodeURIComponent(section).toLowerCase();

  const rawPosts: any[] = await client.fetch(SECTION_QUERY);

  const config = SECTION_CONFIG[normalizedSection] || {
    title: section.replace(/-/g, ' '),
    sanityCats: [normalizedSection],
    titleFallback: [normalizedSection],
    defaultSubsections: [],
  };

  const matchedArticles = rawPosts
    .filter((post) => {
      if (!post.mainImage?.asset || toPlainText(post.body).length < 300) return false;
      const cat = (post.rawCategory || '').trim();
      const sub = (post.rawSubsection || '').trim();
      const title = (post.title || '').toLowerCase();

      if (cat || sub) {
        return config.sanityCats.some((c) => cat.includes(c) || sub.includes(c));
      }

      return config.titleFallback.some((kw) => title.includes(kw));
    })
    .map((post) => {
      const dateObj = resolveExactDate(post);
      return {
        ...post,
        exactTimestamp: dateObj.timestamp,
        formattedDate: dateObj.formatted,
        resolvedAuthorSlug: post.authorSlug || toSlug(post.authorName || 'Orpheus Grant-Essilfie'),
        cleanSummary: toPlainText(post.summary).trim() || `${toPlainText(post.body).slice(0, 180)}...`,
        imageUrl: urlFor(post.mainImage).width(900).height(600).url(),
      };
    })
    .sort((a, b) => b.exactTimestamp - a.exactTimestamp);

  const leadStory = matchedArticles[0];
  const restStories = matchedArticles.slice(1);
  const subsections = config.defaultSubsections;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white text-geotrexx-black">
      <div className="w-full border-t-[4px] border-geotrexx-black pt-3 mb-8 border-b-2 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-geotrexx-crimson block mb-1">
              GEOTREXX Desk Coverage
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-geotrexx-black">
              {config.title}
            </h1>
          </div>

          {subsections.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/category/${normalizedSection}`}
                className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border border-geotrexx-black bg-geotrexx-black text-white no-underline"
              >
                All ({matchedArticles.length})
              </Link>
              {subsections.map((subItem) => (
                <Link
                  key={subItem.slug}
                  href={`/category/${normalizedSection}/${subItem.slug}`}
                  className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border border-geotrexx-black bg-white text-geotrexx-black hover:bg-geotrexx-crimson hover:text-white hover:border-geotrexx-crimson no-underline transition-colors"
                >
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {matchedArticles.length === 0 ? (
        <div className="py-12 border border-geotrexx-black p-6 text-center">
          <p className="text-sm font-mono uppercase tracking-widest text-geotrexx-black">
            No verified reports filed under {config.title} yet.
          </p>
        </div>
      ) : (
        <>
          {leadStory && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 mb-10 border-b-2 border-geotrexx-black">
              {leadStory.imageUrl && (
                <div className="lg:col-span-7">
                  <Link href={`/news/${leadStory.slug}`} className="block relative aspect-video border border-geotrexx-black overflow-hidden bg-white">
                    <Image src={leadStory.imageUrl} alt={leadStory.title} fill className="object-cover rounded-none" priority />
                  </Link>
                </div>
              )}
              <div className={leadStory.imageUrl ? 'lg:col-span-5 flex flex-col justify-center' : 'lg:col-span-12'}>
                <span className="text-[11px] font-mono font-bold uppercase text-geotrexx-crimson mb-2 block">
                  {leadStory.formattedDate}
                </span>
                <Link href={`/news/${leadStory.slug}`} className="group no-underline">
                  <h2 className="text-2xl md:text-4xl font-black leading-tight text-geotrexx-black group-hover:text-geotrexx-crimson transition-colors mb-3">
                    {leadStory.title}
                  </h2>
                </Link>
                <p className="text-base font-serif text-geotrexx-black leading-relaxed mb-3">
                  {leadStory.cleanSummary}
                </p>
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
                    <div className="relative w-full aspect-[3/2] mb-3 border border-geotrexx-black overflow-hidden bg-white">
                      <Image src={article.imageUrl} alt={article.title} fill className="object-cover rounded-none" />
                    </div>
                  )}
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