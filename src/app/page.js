/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All News');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlip, setActiveSlip] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const CMS_URL = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master";

  const fallbackArticles = [
    {
      id: '1',
      title: "NPP Bantama Constituency Executive Elections Suspended Indefinitely",
      slug: "npp-bantama-suspended",
      category: "Politics",
      publishedDate: "2026-07-16",
      readTime: "3 min read",
      summary: "The highly anticipated internal elections have been halted following sudden disruptions at the polling venue.",
      content: { html: "The highly anticipated internal elections have been halted following sudden disruptions at the polling venue." },
      image: { url: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=800&auto=format&fit=crop" }
    },
    {
      id: '2',
      title: "La Liga Postpones FC Barcelona's Opening Fixtures",
      slug: "la-liga-barcelona-postponed",
      category: "Sports",
      publishedDate: "2026-07-15",
      readTime: "4 min read",
      summary: "Due to multiple star players participating in the deep stages of the World Cup, La Liga has granted Barcelona a delayed start.",
      content: { html: "Due to multiple star players participating in the deep stages of the 2026 World Cup, La Liga has granted Barcelona a delayed start." },
      image: { url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop" }
    },
    {
      id: '3',
      title: "Weekend VIP Acca",
      slug: "weekend-vip-acca",
      category: "Codes of the Day",
      publishedDate: "2026-07-18",
      readTime: "SportyBet",
      summary: "12.50",
      content: { text: "BC98765", html: "BC98765" },
      image: null
    }
  ];

  // Sync state with dynamic parameters for Admin
  useEffect(() => {
    const adminStatus = searchParams.get('admin');

    if (adminStatus === '1') {
      localStorage.setItem('geotrexx_admin', 'true');
      setIsAdmin(true);
    } else if (adminStatus === '0') {
      localStorage.removeItem('geotrexx_admin');
      setIsAdmin(false);
    } else if (typeof window !== 'undefined' && localStorage.getItem('geotrexx_admin') === 'true') {
      setIsAdmin(true);
    }
  }, [searchParams]);

  // Fetch articles from Hygraph CMS
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const query = `query GetArticles { articles(orderBy: publishedDate_DESC) { id title slug category publishedDate readTime summary content { html text } image { url } } }`;

        const response = await fetch(CMS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        if (result.data && result.data.articles && result.data.articles.length > 0) {
          setArticles(result.data.articles);
        } else {
          setArticles(fallbackArticles);
        }
        setLoading(false);
      } catch (err) {
        console.error("Connection Error:", err);
        setError("Database link down. Loading offline fallback news.");
        setArticles(fallbackArticles);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const navigation = ['All News', 'Politics', 'Sports', 'Entertainment', 'STEM', 'General News'];

  const displayedArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.summary && article.summary.toLowerCase().includes(searchQuery.toLowerCase()));

    const activeCat = activeCategory.toLowerCase().trim();
    const articleCat = article.category ? article.category.toLowerCase().trim() : '';

    const matchesCategory = activeCategory === 'All News' || 
      articleCat === activeCat || 
      (activeCat === 'general news' && articleCat === 'general');
      
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setSearchQuery('');
    setActiveSlip(null);
    setIsSidebarOpen(false);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  const handleHomeClick = () => {
    setActiveCategory('All News');
    setIsSidebarOpen(false);
    setSearchQuery('');
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  const handleCopyCode = (code, id) => {
    const textArea = document.createElement("textarea");
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 w-full">
      {/* MOBILE HEADER */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b-4 border-[#C8102E] sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleHomeClick}>
          <div className="w-10 h-10 rounded-full border-2 border-[#C8102E] overflow-hidden bg-white">
            <img src="/geotrexx-logo.png" alt="GEOTREXX Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-xl tracking-widest uppercase">GEO<span className="text-[#C8102E]">TREXX</span></span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-3xl font-bold text-gray-800 focus:outline-none">
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`${isSidebarOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-72 bg-white fixed md:sticky top-0 h-screen z-50 overflow-y-auto border-r border-gray-200 shadow-xl md:shadow-none shrink-0`}>
        <div className="p-8 text-center border-b border-gray-100 relative bg-gray-50">
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute top-4 right-6 text-2xl text-gray-500 hover:text-gray-900">✕</button>
          
          <div className="w-24 h-24 mx-auto rounded-full border-4 border-[#C8102E] overflow-hidden bg-white mb-4 shadow-lg cursor-pointer hover:scale-105 transition-transform" onClick={handleHomeClick}>
            <img src="/geotrexx-logo.png" alt="GEOTREXX Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-black text-2xl tracking-widest text-gray-900 cursor-pointer" onClick={handleHomeClick}>GEO<span className="text-[#C8102E]">TREXX</span></h1>
          <p className="text-xs font-bold text-gray-500 uppercase mt-2 tracking-widest mb-6">Info Nexus</p>
          
          {/* SEARCH BAR */}
          <div className="w-full relative">
            <input 
              type="text" 
              placeholder="Search news..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); }}
              className="w-full px-4 py-2.5 text-sm font-bold bg-white border-2 border-gray-200 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C8102E] transition-all shadow-inner"
            />
          </div>
        </div>
        
        <nav className="flex flex-col py-6">
          {navigation.map(cat => {
            const isSportsGroupActive = cat === 'Sports' && (activeCategory === 'Sports' || activeCategory === 'Codes of the Day');
            const isActive = activeCategory === cat || isSportsGroupActive;

            return (
              <div key={cat} className="flex flex-col">
                <button 
                  onClick={() => handleCategoryClick(cat)} 
                  className={`text-left px-8 py-4 font-bold text-sm tracking-wider uppercase transition-all duration-200 border-l-4 ${isActive ? 'border-[#C8102E] bg-gray-50 text-[#C8102E]' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-[#C8102E]'}`}
                >
                  {cat}
                </button>
                {cat === 'Sports' && (
                  <div className={`overflow-hidden transition-all duration-300 flex flex-col bg-gray-50 ${isSportsGroupActive ? 'max-h-32 border-l-4 border-[#C8102E]' : 'max-h-0 border-l-4 border-transparent'}`}>
                     <button
                       onClick={() => handleCategoryClick('Codes of the Day')}
                       className={`w-full text-left pl-14 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeCategory === 'Codes of the Day' ? 'text-[#C8102E] bg-gray-200' : 'text-gray-500 hover:text-[#C8102E] hover:bg-gray-100'}`}
                     >
                       ↳ Codes of the Day
                     </button>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="grow w-full flex flex-col min-h-screen relative overflow-hidden">
        
        {/* TICKER */}
        <div className="bg-[#111111] text-white flex items-center border-b-4 border-[#C8102E] overflow-hidden relative md:sticky md:top-0 z-40 w-full shadow-sm">
          <div className="bg-[#C8102E] font-black uppercase tracking-widest text-xs px-4 py-3 shrink-0 flex items-center gap-2 z-10 shadow-[5px_0_15px_-5px_rgba(0,0,0,0.5)]">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            Just In
          </div>
          <div className="grow overflow-hidden whitespace-nowrap">
            <div className="animate-ticker inline-block text-sm font-semibold tracking-wide">
              {articles.map((article, index) => (
                <Link key={index} href={`/post/${article.slug || article.id}`} className="mx-8 hover:text-[#C8102E] cursor-pointer transition-colors">
                  {article.title} <span className="text-gray-600 mx-2">•</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grow p-4 md:p-8 w-full max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-600 text-red-800 p-4 rounded text-sm font-bold shadow-sm">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[#C8102E] font-bold uppercase tracking-widest">Loading Feed...</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 w-full">
              
              {/* LEFT COLUMN: MAIN NEWS GRID */}
              <div className="w-full lg:w-8/12 xl:w-9/12">
                <div className="animate-fade-in w-full">
                  <div className="flex items-center gap-4 mb-8 border-b-2 border-gray-200 pb-4">
                    <div className="w-12 h-12 rounded-full border-2 border-[#C8102E] overflow-hidden bg-white shadow-sm shrink-0">
                      <img src="/image_4dfcc5.jpg" alt="Category Icon" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-gray-900">
                      {searchQuery ? `Search: ${searchQuery}` : activeCategory}
                    </h2>
                  </div>

                  {activeCategory === 'Codes of the Day' && !searchQuery ? (
                    /* --- DYNAMIC BETTING SLIPS UI --- */
                    <div className="mb-8 bg-gradient-to-br from-gray-900 to-black text-white rounded-lg p-6 shadow-xl border border-gray-800 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8102E] opacity-20 blur-3xl rounded-full"></div>
                      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-3">
                        <h3 className="font-black text-lg tracking-widest uppercase text-white flex items-center gap-2">
                          <span className="text-[#C8102E]">🎯</span> GEOTREXX Live Odds
                        </h3>
                        <span className="bg-[#C8102E] text-white text-[10px] px-2 py-1 rounded font-black uppercase tracking-wider animate-pulse">Live Slips</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                          {displayedArticles.length > 0 ? (
                            displayedArticles.map(article => (
                              <div key={article.id} className="bg-gray-800/80 p-4 rounded border border-gray-700 backdrop-blur-sm transition-all hover:border-gray-500 flex flex-col">
                                <p className="text-gray-400 text-xs font-bold uppercase mb-1">Market</p>
                                <p className="font-bold text-sm mb-2">{article.title}</p>
                                <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-700">
                                  <span className="text-gray-400 text-xs">Odds: <span className="text-green-400 font-black text-base">{article.summary || 'N/A'}</span></span>
                                  <button 
                                    onClick={() => setActiveSlip(activeSlip === article.id ? null : article.id)}
                                    className="bg-white text-black text-xs font-bold px-4 py-2 rounded hover:bg-gray-200 transition-colors shadow-sm"
                                  >
                                    {activeSlip === article.id ? 'Hide Code' : 'Reveal Slip'}
                                  </button>
                                </div>
                                {activeSlip === article.id && (
                                  <div className="mt-4 bg-black p-3 text-sm text-gray-200 rounded border border-gray-600 animate-fade-in text-center font-mono shadow-inner">
                                      Booking Code: <span className="text-[#C8102E] font-black text-xl tracking-widest ml-2">{article.content?.text || 'N/A'}</span>
                                      <button 
                                        onClick={() => handleCopyCode(article.content?.text, article.id)}
                                        className="ml-3 bg-gray-800 hover:bg-[#C8102E] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider transition-colors inline-flex items-center align-middle"
                                      >
                                        {copiedCode === article.id ? 'Copied! ✓' : 'Copy'}
                                      </button>
                                      <div className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider border-t border-gray-800 pt-2">
                                        Valid on {article.readTime || 'Select Platforms'}
                                      </div>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full py-10 text-center">
                              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">No active betting codes right now.</p>
                              <p className="text-gray-600 text-xs mt-2">Check back later for new live odds.</p>
                            </div>
                          )}
                      </div>
                    </div>
                  ) : (
                    /* --- REGULAR NEWS GRID --- */
                    displayedArticles.length === 0 ? (
                      <div className="bg-white p-10 text-center rounded border border-gray-200">
                        <p className="text-gray-500 text-lg font-bold">No articles currently published here.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {displayedArticles.map(article => (
                          <Link 
                            key={article.id} 
                            href={`/post/${article.slug || article.id}`}
                            className="group flex flex-col bg-white shadow-sm hover:shadow-lg transition-all duration-300 rounded overflow-hidden border border-gray-100"
                          >
                            <div className="w-full h-52 bg-gray-100 overflow-hidden relative">
                              {article.image ? (
                                <img src={article.image.url} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">No Image</div>
                              )}
                              <div className="absolute top-3 left-3 bg-[#C8102E] text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 shadow-md">
                                {article.category}
                              </div>
                            </div>
                            <div className="p-5 flex flex-col grow">
                              <h3 className="text-xl font-black text-gray-900 leading-tight mb-3 group-hover:text-[#C8102E] transition-colors line-clamp-3">{article.title}</h3>
                              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 font-serif">{article.summary}</p>
                              <div className="mt-auto flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest border-t border-gray-50 pt-3">
                                <span>{article.publishedDate ? new Date(article.publishedDate).toLocaleDateString() : 'New'}</span>
                                <span className="text-[#C8102E] group-hover:underline">Read →</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: TRENDING SIDEBAR */}
              <div className="w-full lg:w-4/12 xl:w-3/12">
                <div className="bg-white border-t-4 border-black p-5 shadow-sm rounded sticky top-24">
                  <h3 className="font-black text-xl text-gray-900 uppercase tracking-tight mb-5 flex items-center gap-2">
                    <span className="text-[#C8102E]">🔥</span> Trending Now
                  </h3>
                  <div className="flex flex-col gap-4">
                    {articles.slice(0, 4).map((trend) => (
                      <Link 
                        key={trend.id} 
                        href={`/post/${trend.slug || trend.id}`}
                        className="flex gap-3 group cursor-pointer border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="w-20 h-20 shrink-0 bg-gray-100 rounded overflow-hidden">
                           {trend.image && <img src={trend.image.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="thumb"/>}
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="text-[10px] text-[#C8102E] font-black uppercase tracking-widest mb-1">{trend.category}</span>
                          <h4 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#C8102E] transition-colors line-clamp-3">{trend.title}</h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* Ad Space Placeholder */}
                  <div className="mt-6 bg-gray-100 w-full h-[250px] border border-gray-200 flex flex-col items-center justify-center text-gray-400 rounded">
                    <span className="text-xs font-bold uppercase tracking-widest mb-1">Advertisement</span>
                    <span className="text-sm">300 x 250</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="bg-[#111111] text-white border-t-8 border-[#C8102E] w-full mt-auto shrink-0">
          <div className="max-w-7xl mx-auto p-10 md:p-14 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-[#C8102E] font-black uppercase tracking-widest mb-4">About Geotrexx</h3>
              <p className="text-gray-400 leading-relaxed text-sm">Your premium digital destination for global news, sports analytics, and deep editorial coverage across Ghana and the world.</p>
            </div>
            <div>
              <h3 className="text-[#C8102E] font-black uppercase tracking-widest mb-4">Contact Us</h3>
              <p className="text-gray-300 font-bold">GEOTREXX Media Group</p>
              <a href="mailto:info@grotrexx.com" className="block text-gray-400 hover:text-white transition-colors mt-2 text-sm">info@grotrexx.com</a>
              <a href="tel:+233535531860" className="block text-gray-400 hover:text-white transition-colors mt-1 text-sm">+233535531860</a>
            </div>
            <div>
              <h3 className="text-[#C8102E] font-black uppercase tracking-widest mb-4">Follow Us</h3>
              <div className="flex flex-col gap-3">
                <a href="https://www.facebook.com/Geotrexx1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-[#C8102E] transition-colors">
                   <span>📘</span> Facebook (Geotrexx)
                </a>
                <a href="https://x.com/FullyBarcaX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-[#C8102E] transition-colors">
                   <span>𝕏</span> X (Twitter)
                </a>
                <a href="https://www.instagram.com/totally.barca" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-[#C8102E] transition-colors">
                   <span>📸</span> Instagram (Totally Barca)
                </a>
              </div>
            </div>
          </div>
          <div className="text-center py-6 border-t border-gray-800 text-xs font-bold text-gray-500 uppercase tracking-widest bg-black">
            &copy; 2026 GEOTREXX INFO NEXUS. All Rights Reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}

// THIS IS THE REQUIRED NEXT.JS WRAPPER
export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50 w-full">
        <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}