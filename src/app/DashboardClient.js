/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DashboardClient({ serverArticles }) {
  const [articles] = useState(serverArticles || []);
  const [activeCategory, setActiveCategory] = useState('All News');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlip, setActiveSlip] = useState(null);

  const navigation = ['All News', 'Politics', 'Sports', 'Entertainment', 'STEM', 'General News', 'Codes of the Day'];

  const displayedArticles = articles.filter(article => {
    const searchMatch = searchQuery === '' || 
      article?.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) || 
      article?.summary?.toLowerCase()?.includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'All News') return searchMatch;
    if (activeCategory === 'Codes of the Day') return searchMatch && article?.category?.toLowerCase() === 'codes of the day';
    
    return searchMatch && article?.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  const featuredArticle = displayedArticles.length > 0 ? displayedArticles[0] : null;
  const gridArticles = displayedArticles.length > 1 ? displayedArticles.slice(1) : [];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f9fa] w-full font-sans">
      
      {/* ELITE SIDEBAR */}
      <aside className="w-full md:w-72 bg-geo-dark text-white md:sticky md:top-0 md:h-screen shrink-0 shadow-2xl z-50 flex flex-col">
        <div className="p-8 flex flex-col items-center border-b border-gray-800">
          <div className="w-20 h-20 rounded-full border-2 border-geo-red overflow-hidden mb-4 shadow-[0_0_15px_rgba(200,16,46,0.5)]">
            <img src="/icon.png" alt="GEOTREXX" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-black text-3xl tracking-widest uppercase">GEO<span className="text-geo-red">TREXX</span></h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Info Nexus</p>
        </div>

        <div className="p-6">
          <input 
            type="text" 
            placeholder="Search intel..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded text-sm focus:border-geo-red focus:ring-1 focus:ring-geo-red outline-none transition-all placeholder-gray-600"
          />
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-2">
          {navigation.map(cat => (
            <button 
              key={cat}
              onClick={() => { setActiveCategory(cat); setSearchQuery(''); window.scrollTo(0,0); }}
              className={`text-left px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat 
                ? 'bg-geo-red text-white shadow-lg translate-x-2' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white hover:translate-x-1'
              }`}
            >
              {cat === 'Codes of the Day' ? '🔥 ' + cat : cat}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT ARENA */}
      <main className="flex-1 p-4 md:p-10 lg:p-14 w-full max-w-7xl mx-auto overflow-hidden">
        
        <div className="mb-10 flex items-center justify-between border-b-2 border-gray-200 pb-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900 animate-fade-in-up">
            {activeCategory}
          </h2>
        </div>

        {displayedArticles.length === 0 ? (
          <div className="w-full h-64 flex items-center justify-center bg-white rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-gray-400 font-bold tracking-widest uppercase">No intel found in this sector.</p>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            
            {/* BETTING SLIPS UI (Conditional) */}
            {activeCategory === 'Codes of the Day' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedArticles.map(article => (
                  <div key={article.id} className="bg-geo-dark rounded-xl p-1 relative overflow-hidden group hover:shadow-[0_10px_30px_rgba(200,16,46,0.2)] transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-geo-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="bg-gray-900 h-full w-full rounded-lg p-6 relative z-10 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-geo-red/20 text-geo-red text-xs font-black uppercase px-3 py-1 rounded-full border border-geo-red/30">Live Market</span>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2 leading-snug">{article.title}</h3>
                      <p className="text-gray-400 text-sm mb-6 flex-1">{article.summary}</p>
                      
                      <button 
                        onClick={() => setActiveSlip(activeSlip === article.id ? null : article.id)}
                        className="w-full bg-white text-black font-black uppercase tracking-widest py-3 rounded-lg hover:bg-geo-red hover:text-white transition-colors"
                      >
                        {activeSlip === article.id ? 'Hide Data' : 'Reveal Code'}
                      </button>

                      {activeSlip === article.id && (
                        <div className="mt-4 bg-black border border-geo-red rounded-lg p-4 text-center animate-fade-in-up">
                           <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Booking Code</p>
                           <p className="text-3xl font-black text-white tracking-widest">{article?.content?.text || 'N/A'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* NEWS MAGAZINE UI */
              <>
                {/* Featured Hero Article */}
                {featuredArticle && (
                  <Link href={`/news/${featuredArticle.slug || featuredArticle.id}`} className="block mb-10 group">
                    <div className="relative w-full h-[60vh] min-h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                      {featuredArticle.image ? (
                        <img src={featuredArticle.image.url} alt={featuredArticle.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-gray-800"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-3/4">
                        <span className="bg-geo-red text-white text-xs font-black uppercase px-3 py-1 rounded-sm shadow-lg mb-4 inline-block">{featuredArticle.category || 'Breaking'}</span>
                        <h3 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 group-hover:text-geo-red transition-colors">{featuredArticle.title}</h3>
                        <p className="text-gray-300 text-lg line-clamp-2">{featuredArticle.summary}</p>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Article Grid */}
                {gridArticles.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {gridArticles.map(article => (
                      <Link key={article.id} href={`/news/${article.slug || article.id}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                        <div className="w-full h-56 bg-gray-200 overflow-hidden relative">
                          {article.image && <img src={article.image.url} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-black text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm">{article.category || 'News'}</div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <h4 className="text-xl font-black text-gray-900 leading-snug mb-3 group-hover:text-geo-red transition-colors line-clamp-3">{article.title}</h4>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mt-auto">{article.summary}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}