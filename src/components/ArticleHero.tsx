import React from 'react';
import { Article } from '../types/article';
import { ArrowLeft, Clock, Calendar, ShieldCheck } from 'lucide-react';

interface ArticleHeroProps {
  article: Article;
  onBack: () => void;
}

export const ArticleHero: React.FC<ArticleHeroProps> = ({ article, onBack }) => {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="relative w-full">
      <div className="absolute top-4 left-4 z-20">
        <button onClick={onBack} className="min-h-[44px] px-3.5 py-1.5 bg-black/75 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider font-sans rounded flex items-center gap-1.5 backdrop-blur-sm shadow-lg">
          <ArrowLeft className="w-4 h-4" /> <span>Back</span>
        </button>
      </div>

      {/* Responsive aspect ratio to prevent forcing unnatural crops */}
      <div className="relative w-full min-h-[350px] sm:aspect-video md:aspect-[21/9] bg-stone-900 overflow-hidden flex flex-col justify-end">
        <img src={article.imageUrl} alt={article.imageAlt} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover object-center opacity-85" />
        
        <div className="relative z-10 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-32 pb-6 px-4 sm:px-6 md:px-10 w-full">
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-[#C8102E] text-white font-headline text-xs font-bold tracking-widest uppercase px-3 py-1 shadow-md">{article.category}</span>
              <span className="bg-white/20 backdrop-blur-md text-white text-xs px-2.5 py-1 font-sans font-medium">{article.subCategory}</span>
              <div className="hidden sm:flex items-center gap-1 text-emerald-400 text-xs font-sans bg-black/40 px-2 py-0.5 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> <span>{article.factCheckStatus}</span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-white tracking-tight leading-[1.1] mb-4 text-balance">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-200 font-sans">
              <div className="flex items-center gap-2">
                <img src={article.author.avatarUrl} alt={article.author.name} className="w-7 h-7 rounded-full object-cover border border-white/40" />
                <span className="font-semibold text-white">By {article.author.name}</span>
              </div>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formattedDate}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readingTime}</span>
            </div>
          </div>
        </div>
      </div>

      {article.imageCaption && (
        <div className="w-full bg-stone-100 border-b border-stone-200 px-4 py-2">
          <div className="max-w-4xl mx-auto text-xs text-stone-600 font-serif italic">
            {article.imageCaption}
          </div>
        </div>
      )}
    </div>
  );
};