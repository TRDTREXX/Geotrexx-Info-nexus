import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

export const revalidate = 60;

export default async function FoundersPage() {
  const authors = await client.fetch(
    `*[_type == "author"]{ name, "slug": slug.current, image }`
  );

  const orpheusDoc = authors?.find((a: any) =>
    (a.name || '').toLowerCase().includes('orpheus')
  );
  const quistDoc = authors?.find((a: any) =>
    (a.name || '').toLowerCase().includes('quist')
  );

  const orpheusPhoto = orpheusDoc?.image
    ? urlFor(orpheusDoc.image).width(800).height(1000).url()
    : '/orpheus.jpg.jpeg';

  const quistPhoto = quistDoc?.image
    ? urlFor(quistDoc.image).width(800).height(1000).url()
    : '/quist.jpg.jpeg';

  const orpheusSlug = orpheusDoc?.slug || 'orpheus-grant-essilfie';
  const quistSlug = quistDoc?.slug || 'ebenezer-quist-assan';

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white text-geotrexx-black">
      <div className="w-full border-t-[4px] border-geotrexx-black pt-4 mb-10 border-b-2 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-geotrexx-crimson block mb-2">
            Executive Leadership & Masthead
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-geotrexx-black uppercase">
            Meet the Founders
          </h1>
        </div>
        <Link
          href="/"
          aria-label="Back to GEOTREXX Home"
          className="group shrink-0 flex items-center gap-3 no-underline cursor-pointer"
        >
          <div className="relative w-14 h-14 rounded-full border-2 border-geotrexx-black p-1 bg-white flex items-center justify-center transition-colors group-hover:border-geotrexx-crimson">
            <div className="relative w-full h-full rounded-full border-2 border-geotrexx-crimson overflow-hidden bg-white">
              <Image
                src="/geotrexx-logo.png"
                alt="GEOTREXX Official Seal"
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>
          </div>
        </Link>
      </div>

      <section className="border-2 border-geotrexx-black border-l-[10px] border-l-geotrexx-crimson bg-white p-6 md:p-10 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <Link href={`/author/${orpheusSlug}`} className="block no-underline">
              <div className="relative w-full aspect-[4/5] border-2 border-geotrexx-black bg-white overflow-hidden">
                <img
                  src={orpheusPhoto}
                  alt="Orpheus Grant-Essilfie — Co-Founder, CEO & Editor-in-Chief"
                  className="w-full h-full object-cover object-top block"
                />
              </div>
            </Link>
            <div className="border-x-2 border-b-2 border-geotrexx-black p-2.5 bg-white flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-geotrexx-crimson">
                  CEO & Editor-in-Chief
                </span>
                <span className="block text-xs font-mono font-bold uppercase text-geotrexx-black">
                  Orpheus Grant-Essilfie
                </span>
              </div>
              <Link
                href={`/author/${orpheusSlug}`}
                className="px-2.5 py-1 bg-geotrexx-black text-white hover:bg-geotrexx-crimson text-[10px] font-mono font-bold uppercase no-underline transition-colors"
              >
                Articles &rarr;
              </Link>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-geotrexx-black pb-4 mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span className="inline-block bg-geotrexx-crimson text-white text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1">
                      Chief Executive Officer (CEO)
                    </span>
                    <span className="inline-block bg-geotrexx-black text-white text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1">
                      Co-Founder & Editor-in-Chief
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-geotrexx-black">
                    <Link
                      href={`/author/${orpheusSlug}`}
                      className="text-geotrexx-black hover:text-geotrexx-crimson no-underline transition-colors"
                    >
                      Orpheus Grant-Essilfie
                    </Link>
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-geotrexx-black">
                  Accra, Ghana
                </span>
              </div>

              <div className="space-y-4 font-serif text-base md:text-lg text-geotrexx-black leading-relaxed">
                <p>
                  <strong>I’m Orpheus Grant-Essilfie, Co-Founder and Editor-in-Chief of GEOTREXX.</strong>
                </p>
                <p>
                  Everything in our world is connected. The decisions in politics affect your money, the latest tech changes your daily routine, and our sports, history, and culture bring us together. Because my knowledge spans across all these fields, I see the big picture.
                </p>
                <p>
                  But knowing the whole story means nothing if it is too complicated to read. I started GEOTREXX because I believe the news belongs to the people. When you read a story here, you are getting the facts straight from the source. We cut out the heavy grammar and the confusing words.
                </p>
                <p>
                  My job is to make sure every article we publish hits hard, tells the truth, and speaks directly to you. Welcome to a news platform that actually respects you.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-geotrexx-black flex flex-wrap items-center justify-between gap-3 text-xs font-mono font-bold uppercase tracking-wider text-geotrexx-black">
              <span>Desks: Politics, Business, Tech, Sports & Geotrexx Consortium</span>
              <Link
                href={`/author/${orpheusSlug}`}
                className="text-geotrexx-crimson hover:underline no-underline"
              >
                View All Articles by Orpheus &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-2 border-geotrexx-black border-l-[10px] border-l-geotrexx-black bg-white p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <Link href={`/author/${quistSlug}`} className="block no-underline">
              <div className="relative w-full aspect-[4/5] border-2 border-geotrexx-black bg-white overflow-hidden">
                <img
                  src={quistPhoto}
                  alt="Ebenezer Quist Assan — Co-Founder & Managing Editor"
                  className="w-full h-full object-cover object-top block"
                />
              </div>
            </Link>
            <div className="border-x-2 border-b-2 border-geotrexx-black p-2.5 bg-white flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-geotrexx-crimson">
                  Co-Founder & Editor
                </span>
                <span className="block text-xs font-mono font-bold uppercase text-geotrexx-black">
                  Ebenezer Quist Assan
                </span>
              </div>
              <Link
                href={`/author/${quistSlug}`}
                className="px-2.5 py-1 bg-geotrexx-black text-white hover:bg-geotrexx-crimson text-[10px] font-mono font-bold uppercase no-underline transition-colors"
              >
                Articles &rarr;
              </Link>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-geotrexx-black pb-4 mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span className="inline-block bg-geotrexx-black text-white text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1">
                      Co-Founder & Managing Editor
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black tracking-tight text-geotrexx-black">
                    <Link
                      href={`/author/${quistSlug}`}
                      className="text-geotrexx-black hover:text-geotrexx-crimson no-underline transition-colors"
                    >
                      Ebenezer Quist Assan
                    </Link>
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-geotrexx-black">
                  Accra, Ghana
                </span>
              </div>

              <div className="space-y-4 font-serif text-base md:text-lg text-geotrexx-black leading-relaxed">
                <p>
                  <strong>Ebenezer Quist Assan</strong> is the Co-Founder and Managing Editor of GEOTREXX. In his editorial role, he coordinates newsroom assignments, story verification, and daily desk publications across national affairs, governance, and regional reporting.
                </p>
                <p>
                  Working alongside the Chief Executive Officer, Assan drives editorial workflows, institutional partnerships, and coverage execution to ensure every report meets the publication’s standards for accuracy, clarity, and direct reporting.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-geotrexx-black flex flex-wrap items-center justify-between gap-3 text-xs font-mono font-bold uppercase tracking-wider text-geotrexx-black">
              <span>Divisions: Newsroom Operations & Desk Coordination</span>
              <Link
                href={`/author/${quistSlug}`}
                className="text-geotrexx-crimson hover:underline no-underline"
              >
                View All Articles by Quist &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}