import Link from 'next/link';

export default function Header() {
  const currentDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  const categories = [
    { name: 'Ghana', slug: 'ghana' },
    { name: 'World', slug: 'world' },
    { name: 'Politics', slug: 'politics' },
    { name: 'Business', slug: 'business' },
    { name: 'Sports', slug: 'sports' }, // Football and general athletics coverage
    { name: 'STEM', slug: 'stem' },
    { name: 'Entertainment', slug: 'entertainment' },
    { name: 'Opinion', slug: 'opinion' }
  ];

  return (
    <header className="w-full bg-[#faf9f6] text-[#121826] border-b-2 border-gray-900">
      {/* Top Utility Strip */}
      <div className="bg-[#0b2545] text-gray-200 text-[11px] py-1.5 px-6 font-mono tracking-widest uppercase">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-white font-bold">
              <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse"></span>
              LIVE DISPATCH
            </span>
            <span className="text-gray-500">|</span>
            <span>Accra, Ghana</span>
            <span className="text-gray-500">|</span>
            <span>{currentDate}</span>
          </div>
          <div className="hidden md:block">
            GEOTREXX MEDIA GROUP • INDEPENDENT JOURNALISM
          </div>
        </div>
      </div>

      {/* Main Masthead */}
      <div className="max-w-7xl mx-auto px-6 py-6 md:py-8 text-center border-b border-gray-300">
        <Link href="/" className="inline-block group">
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl font-black text-[#0b2545] uppercase tracking-tighter group-hover:text-[#C8102E] transition-colors leading-none" 
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            GEOTREXX
          </h1>
          <p className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-gray-500 mt-2">
            Unbiased • Accurate • Authoritative
          </p>
        </Link>
      </div>

      {/* Category Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-6 overflow-x-auto scrollbar-none">
        <ul className="flex items-center justify-center min-w-max md:min-w-0 space-x-6 lg:space-x-8 py-3 text-xs md:text-sm font-bold uppercase tracking-widest text-gray-800">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link 
                href={`/category/${cat.slug}`} 
                className="hover:text-[#C8102E] transition-colors pb-1 border-b-2 border-transparent hover:border-[#C8102E]"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}