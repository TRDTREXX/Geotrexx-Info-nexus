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

function resolveExactDate(post: any): { iso: string; timestamp: number; formatted: string } {
  const primaryCandidates = [post.publishedAt, post.publishDate, post.date, post._createdAt];
  let bestMs = 0;

  for (const raw of primaryCandidates) {
    if (raw && typeof raw === 'string' && raw.trim().length > 0) {
      const ms = Date.parse(raw);
      if (!Number.isNaN(ms)) {
        bestMs = ms;
        break;
      }
    }
  }

  if (bestMs === 0 && post._createdAt) {
    const fallbackMs = Date.parse(post._createdAt);
    if (!Number.isNaN(fallbackMs)) bestMs = fallbackMs;
  }

  if (bestMs > 0) {
    const d = new Date(bestMs);
    return {
      iso: d.toISOString(),
      timestamp: bestMs,
      formatted: d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'Africa/Accra',
      }),
    };
  }

  return { iso: '', timestamp: 0, formatted: '' };
}

const HOME_QUERY = `*[_type in ["article", "post"] && defined(slug.current) && defined(mainImage.asset) && !(_id in path("drafts.**"))] | order(coalesce(publishedAt, publishDate, date, _createdAt) desc) [0...100] {
  _id,
  title,
  "slug": slug.current,
  summary,
  body,
  "rawCategory": lower(coalesce(category->title, category, section, "")),
  "rawSubsection": coalesce(
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
  "authorName": coalesce(author->name, "Orpheus Grant-Essilfie"),
  "authorSlug": author->slug.current,
  "location": coalesce(location, dateline, "ACCRA"),
  publishedAt,
  publishDate,
  date,
  _createdAt,
  _updatedAt,
  mainImage
}`;

function mapSanityDesk(article: any) {
  const cat = (article.rawCategory || '').trim();
  const subRaw = String(article.rawSubsection || '').trim();
  const subLower = subRaw.toLowerCase();
  const title = (article.title || '').toLowerCase();
  const dateObj = resolveExactDate(article);

  let desk = 'ghana';
  let deskLabel = 'Ghana';
  let subLabel = subRaw ? subRaw.replace(/[-_]+/g, ' ') : 'National';

  if (cat.includes('sport') || cat.includes('trexxfield') || subLower.includes('sport')) {
    desk = 'sports';
    deskLabel = 'TREXXfield';
    subLabel = subRaw ? subRaw.replace(/[-_]+/g, ' ') : 'Football';
  } else if (cat.includes('stem') || cat.includes('tech') || subLower.includes('stem') || subLower.includes('tech')) {
    desk = 'business';
    deskLabel = 'Business & Tech';
    subLabel = subRaw ? subRaw.replace(/[-_]+/g, ' ') : 'Tech & STEM';
  } else if (cat.includes('business') || cat.includes('econom') || subLower.includes('business') || subLower.includes('econom')) {
    desk = 'business';
    deskLabel = 'Business & Tech';
    subLabel = subRaw ? subRaw.replace(/[-_]+/g, ' ') : 'Economy & Markets';
  } else if (cat.includes('politic') || cat.includes('opinion') || subLower.includes('politic')) {
    desk = 'politics';
    deskLabel = 'Politics';
    subLabel = subRaw ? subRaw.replace(/[-_]+/g, ' ') : 'Politics';
  } else if (cat.includes('world') || cat.includes('africa') || subLower.includes('world') || subLower.includes('diaspora')) {
    desk = 'world';
    deskLabel = 'World';
    subLabel = subRaw ? subRaw.replace(/[-_]+/g, ' ') : 'World & Diaspora';
  } else if (cat.includes('ghana') || cat.includes('entertainment')) {
    desk = 'ghana';
    deskLabel = 'Ghana';
    subLabel = subRaw ? subRaw.replace(/[-_]+/g, ' ') : 'National';
  } else {
    if (['barca', 'barcelona', 'arsenal', 'liverpool', 'ucl', 'premier league', 'black stars', 'gfa', 'football'].some((k) => title.includes(k))) {
      desk = 'sports';
      deskLabel = 'TREXXfield';
    } else if (['bank of ghana', 'cedi', 'inflation', 'imf', 'gprtu', 'fare', 'economy', 'market', 'ai ', 'software', 'telecom'].some((k) => title.includes(k))) {
      desk = 'business';
      deskLabel = 'Business & Tech';
    } else if (['parliament', 'speaker', 'bagbin', 'npp', 'ndc', 'election', 'delegate', 'minority', 'majority'].some((k) => title.includes(k))) {
      desk = 'politics';
      deskLabel = 'Politics';
    } else if (['london', 'bronx', 'uk', 'usa', 'ecowas', 'nigeria', 'diaspora'].some((k) => title.includes(k))) {
      desk = 'world';
      deskLabel = 'World';
    }
  }

  return {
    ...article,
    desk,
    deskLabel,
    subLabel,
    exactTimestamp: dateObj.timestamp,
    formattedDate: dateObj.formatted,
    resolvedAuthorSlug: article.authorSlug || toSlug(article.authorName || 'Orpheus Grant-Essilfie'),
    cleanSummary: toPlainText(article.summary).trim() || `${toPlainText(article.body).slice(0, 180)}...`,
    imageUrl: urlFor(article.mainImage).width(1200).height(750).fit('crop').auto('format').quality(85).url(),
  };
}

export default async function Home() {
  let rawPosts: any[] = [];
  try {
    rawPosts = await client.fetch(HOME_QUERY, {}, { cache: 'no-store' });
  } catch (err) {
    console.error('Sanity fetch error:', err);
  }

  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();

  const allUnique = rawPosts
    .filter((a) => Boolean(a.mainImage?.asset) && (toPlainText(a.body).trim().length >= 80 || toPlainText(a.summary).trim().length >= 40))
    .map(mapSanityDesk)
    .sort((a, b) => b.exactTimestamp - a.exactTimestamp)
    .filter((item) => {
      const titleKey = item.title.toLowerCase().trim();
      if (seenIds.has(item._id) || seenTitles.has(titleKey)) return false;
      seenIds.add(item._id);
      seenTitles.add(titleKey);
      return true;
    });

  const displayedIds = new Set<string>();
  const claim = (pool: any[], count: number) => {
    const picked: any[] = [];
    for (const item of pool) {
      if (picked.length >= count) break;
      if (!displayedIds.has(item._id)) {
        displayedIds.add(item._id);
        picked.push(item);
      }
    }
    return picked;
  };

  const [leadArticle] = claim(allUnique, 1);
  const relatedToLead = claim(allUnique, 3);
  const sidebarArticles = claim(allUnique, 5);

  const ghanaPoliticsPool = allUnique.filter((a) => a.desk === 'ghana' || a.desk === 'politics');
  const [ghanaLead] = claim(ghanaPoliticsPool, 1);
  const ghanaStories = claim(ghanaPoliticsPool, 4);

  const worldBusinessPool = allUnique.filter((a) => a.desk === 'world' || a.desk === 'business');
  const [worldLead] = claim(worldBusinessPool, 1);
  const worldStories = claim(worldBusinessPool, 4);

  const sportsPool = allUnique.filter((a) => a.desk === 'sports');
  const trexxfieldBriefs = claim(sportsPool, 4);

  const feedArticles = claim(allUnique, 8);

  if (!leadArticle) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white text-geotrexx-black">
        <div className="border-2 border-geotrexx-black p-8 text-center">
          <h1 className="text-2xl font-black uppercase tracking-widest mb-2">News Desk Syncing</h1>
          <p className="text-sm font-serif">Verified reports with media are being synchronized.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white text-geotrexx-black">
      <div className="w-full border-t-[3px] border-geotrexx-black mb-6 pt-2 flex justify-between items-center">
        <h2 className="font-black text-xs md:text-sm uppercase tracking-widest text-geotrexx-black">
          Top Stories
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-12">
        <div className="lg:col-span-8 flex flex-col lg:border-r lg:border-geotrexx-black lg:pr-10">
          <Link href={`/news/${leadArticle.slug}`} className="group block cursor-pointer no-underline">
            <div className="relative w-full aspect-[16/10] mb-4 bg-white border border-geotrexx-black overflow-hidden">
              <Image src={leadArticle.imageUrl} alt={leadArticle.title} fill className="object-cover object-top rounded-none" priority />
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-geotrexx-crimson">
                {leadArticle.deskLabel}
              </span>
              <span className="text-xs text-geotrexx-black">/</span>
              <span className="text-[11px] font-mono font-bold uppercase text-geotrexx-black">
                {leadArticle.subLabel}
              </span>
              <span className="text-xs text-geotrexx-black">•</span>
              <span className="text-[11px] font-mono text-geotrexx-black uppercase font-bold">
                {leadArticle.formattedDate}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-3 text-geotrexx-black group-hover:text-geotrexx-crimson transition-colors">
              {leadArticle.title}
            </h1>

            <p className="text-base md:text-lg font-serif text-geotrexx-black leading-relaxed mb-3">
              {leadArticle.cleanSummary}
            </p>
          </Link>

          <div className="text-[11px] font-mono uppercase tracking-wider text-gray-600 mb-4">
            By{' '}
            <Link
              href={`/author/${leadArticle.resolvedAuthorSlug}`}
              className="font-bold text-geotrexx-black hover:text-geotrexx-crimson underline no-underline"
            >
              {leadArticle.authorName}
            </Link>
          </div>

          {relatedToLead.length > 0 && (
            <div className="border-t border-geotrexx-black pt-4 mt-2">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-geotrexx-black mb-3">
                Related Coverage
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedToLead.map((item) => (
                  <Link key={item._id} href={`/news/${item.slug}`} className="group flex flex-col no-underline">
                    <div className="relative w-full aspect-[16/10] mb-2 border border-geotrexx-black overflow-hidden bg-white">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover object-top rounded-none" />
                    </div>
                    <span className="text-[10px] font-mono text-gray-600 mb-0.5">
                      {item.formattedDate}
                    </span>
                    <span className="text-xs font-bold text-geotrexx-black group-hover:text-geotrexx-crimson leading-snug line-clamp-2">
                      {item.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <div className="pb-2 mb-2 border-b-2 border-geotrexx-black flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-geotrexx-black">
              Latest Dispatches
            </span>
          </div>
          <div className="flex flex-col divide-y divide-gray-300">
            {sidebarArticles.map((article) => (
              <Link key={article._id} href={`/news/${article.slug}`} className="py-3.5 group flex items-start gap-3.5 cursor-pointer no-underline">
                <div className="relative w-24 h-16 shrink-0 border border-geotrexx-black overflow-hidden bg-white mt-0.5">
                  <Image src={article.imageUrl} alt={article.title} fill className="object-cover object-top rounded-none" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-geotrexx-crimson truncate">
                      {article.deskLabel}
                    </span>
                    <span className="text-[10px] font-mono text-gray-600 shrink-0 ml-2">
                      {article.formattedDate}
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold leading-snug text-geotrexx-black group-hover:text-geotrexx-crimson transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {(ghanaLead || worldLead) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-14">
          {ghanaLead && (
            <div>
              <div className="w-full border-t-[3px] border-geotrexx-black mb-4 pt-2 flex flex-wrap justify-between items-center gap-2">
                <h2 className="font-black text-xs md:text-sm uppercase tracking-widest text-geotrexx-black">
                  Ghana & Politics
                </h2>
                <div className="flex items-center gap-3 text-[10px] font-mono font-bold uppercase">
                  <Link href="/category/ghana" className="text-geotrexx-black hover:text-geotrexx-crimson no-underline">Ghana</Link>
                  <span>•</span>
                  <Link href="/category/politics" className="text-geotrexx-black hover:text-geotrexx-crimson no-underline">Politics</Link>
                </div>
              </div>

              <Link href={`/news/${ghanaLead.slug}`} className="group block no-underline bg-white border border-geotrexx-black border-l-4 border-l-geotrexx-black mb-5">
                <div className="relative w-full aspect-[16/10] border-b border-geotrexx-black overflow-hidden bg-white">
                  <Image src={ghanaLead.imageUrl} alt={ghanaLead.title} fill className="object-cover object-top rounded-none" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-geotrexx-crimson">
                      {ghanaLead.deskLabel} • {ghanaLead.subLabel}
                    </span>
                    <span className="text-[10px] font-mono text-gray-600">
                      {ghanaLead.formattedDate}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black leading-snug text-geotrexx-black group-hover:text-geotrexx-crimson transition-colors mb-2">
                    {ghanaLead.title}
                  </h3>
                  <p className="text-sm font-serif text-geotrexx-black leading-relaxed line-clamp-3">
                    {ghanaLead.cleanSummary}
                  </p>
                </div>
              </Link>

              <div className="divide-y divide-gray-300 border-t border-geotrexx-black">
                {ghanaStories.map((item) => (
                  <Link key={item._id} href={`/news/${item.slug}`} className="py-3.5 group flex items-start gap-4 no-underline">
                    <div className="relative w-28 h-20 shrink-0 border border-geotrexx-black overflow-hidden bg-white">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover object-top rounded-none" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-geotrexx-crimson">
                          {item.deskLabel}
                        </span>
                        <span className="text-[10px] font-mono text-gray-600">
                          {item.formattedDate}
                        </span>
                      </div>
                      <h4 className="text-sm md:text-base font-bold text-geotrexx-black group-hover:text-geotrexx-crimson transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {worldLead && (
            <div>
              <div className="w-full border-t-[3px] border-geotrexx-black mb-4 pt-2 flex flex-wrap justify-between items-center gap-2">
                <h2 className="font-black text-xs md:text-sm uppercase tracking-widest text-geotrexx-black">
                  World, Business & Tech
                </h2>
                <div className="flex items-center gap-3 text-[10px] font-mono font-bold uppercase">
                  <Link href="/category/world" className="text-geotrexx-black hover:text-geotrexx-crimson no-underline">World</Link>
                  <span>•</span>
                  <Link href="/category/business" className="text-geotrexx-black hover:text-geotrexx-crimson no-underline">Business & Tech</Link>
                </div>
              </div>

              <Link href={`/news/${worldLead.slug}`} className="group block no-underline bg-white border border-geotrexx-black border-l-4 border-l-geotrexx-crimson mb-5">
                <div className="relative w-full aspect-[16/10] border-b border-geotrexx-black overflow-hidden bg-white">
                  <Image src={worldLead.imageUrl} alt={worldLead.title} fill className="object-cover object-top rounded-none" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-geotrexx-crimson">
                      {worldLead.deskLabel} • {worldLead.subLabel}
                    </span>
                    <span className="text-[10px] font-mono text-gray-600">
                      {worldLead.formattedDate}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black leading-snug text-geotrexx-black group-hover:text-geotrexx-crimson transition-colors mb-2">
                    {worldLead.title}
                  </h3>
                  <p className="text-sm font-serif text-geotrexx-black leading-relaxed line-clamp-3">
                    {worldLead.cleanSummary}
                  </p>
                </div>
              </Link>

              <div className="divide-y divide-gray-300 border-t border-geotrexx-black">
                {worldStories.map((item) => (
                  <Link key={item._id} href={`/news/${item.slug}`} className="py-3.5 group flex items-start gap-4 no-underline">
                    <div className="relative w-28 h-20 shrink-0 border border-geotrexx-black overflow-hidden bg-white">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover object-top rounded-none" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-geotrexx-crimson">
                          {item.deskLabel}
                        </span>
                        <span className="text-[10px] font-mono text-gray-600">
                          {item.formattedDate}
                        </span>
                      </div>
                      <h4 className="text-sm md:text-base font-bold text-geotrexx-black group-hover:text-geotrexx-crimson transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {trexxfieldBriefs.length > 0 && (
        <div className="w-full border-t-[3px] border-geotrexx-black pt-2 mb-14">
          <div className="flex flex-wrap justify-between items-center mb-5 gap-2">
            <h2 className="font-black text-xs md:text-sm uppercase tracking-widest text-geotrexx-black">
              TREXXfield Sports
            </h2>
            <Link href="/category/sports" className="text-[10px] font-mono font-bold uppercase text-geotrexx-crimson no-underline hover:underline">
              All Sports &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trexxfieldBriefs.map((item) => (
              <Link key={item._id} href={`/news/${item.slug}`} className="group flex flex-col no-underline border-b border-geotrexx-black pb-4 sm:border-b-0 sm:pb-0">
                <div className="relative w-full aspect-[16/10] mb-2.5 border border-geotrexx-black overflow-hidden bg-white">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover object-top rounded-none" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-geotrexx-crimson font-bold">
                    {item.subLabel}
                  </span>
                  <span className="text-[10px] font-mono text-gray-600">
                    {item.formattedDate}
                  </span>
                </div>
                <h5 className="text-base font-bold text-geotrexx-black group-hover:text-geotrexx-crimson transition-colors leading-snug">
                  {item.title}
                </h5>
              </Link>
            ))}
          </div>
        </div>
      )}

      {feedArticles.length > 0 && (
        <>
          <div className="w-full border-t-[3px] border-geotrexx-black mb-6 pt-2 flex justify-between items-center">
            <h2 className="font-black text-xs md:text-sm uppercase tracking-widest text-geotrexx-black">
              More News & Analysis
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10">
            {feedArticles.map((article) => (
              <Link key={article._id} href={`/news/${article.slug}`} className="group flex flex-col h-full no-underline border-b border-geotrexx-black pb-4 sm:border-b-0 sm:pb-0">
                <div className="relative w-full aspect-[16/10] mb-3 bg-white border border-geotrexx-black overflow-hidden">
                  <Image src={article.imageUrl} alt={article.title} fill className="object-cover object-top rounded-none" />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-geotrexx-crimson">
                    {article.deskLabel}
                  </span>
                  <span className="text-[10px] font-mono text-gray-600">
                    {article.formattedDate}
                  </span>
                </div>
                <h4 className="text-base md:text-lg font-bold leading-snug text-geotrexx-black group-hover:text-geotrexx-crimson transition-colors mb-2">
                  {article.title}
                </h4>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}