import React from 'react';

export type AdSlotType = 'leaderboard' | 'medium-rectangle' | 'half-page-sidebar' | 'in-article-banner' | 'mobile-anchor';

interface AdSenseSlotProps {
  type: AdSlotType;
  slotId?: string;
  className?: string;
}

export const AdSenseSlot: React.FC<AdSenseSlotProps> = ({ type, slotId = 'geotrexx-adsense-preview', className = '' }) => {
  switch (type) {
    case 'leaderboard':
      return (
        <aside aria-label="Advertisement" className={`w-full my-6 flex flex-col items-center justify-center bg-stone-50 border border-stone-200 overflow-hidden ${className}`}>
          <div className="w-full flex items-center justify-between px-3 py-1 bg-stone-100 border-b border-stone-200 text-[10px] uppercase tracking-widest text-stone-500 font-sans">
            <span>Advertisement</span>
          </div>
          {/* Responsive min-height protects against CLS without forcing a fixed crop */}
          <div className="w-full flex items-center justify-center p-2 min-h-[50px] md:min-h-[90px] max-w-[728px]">
            <div className="w-full h-full min-h-[50px] md:min-h-[90px] flex flex-col items-center justify-center border border-dashed border-stone-300 rounded bg-white text-center p-3">
              <span className="text-xs font-semibold text-stone-700 font-headline uppercase tracking-wide">AdSense Leaderboard</span>
            </div>
          </div>
        </aside>
      );
    case 'medium-rectangle':
      return (
        <aside aria-label="Advertisement" className={`w-full max-w-[336px] mx-auto my-6 flex flex-col items-center justify-center bg-stone-50 border border-stone-200 overflow-hidden ${className}`}>
          <div className="w-full flex items-center justify-between px-3 py-1 bg-stone-100 border-b border-stone-200 text-[10px] uppercase tracking-widest text-stone-500 font-sans">
            <span>Advertisement</span>
          </div>
          <div className="w-full min-h-[250px] aspect-[1.2] flex flex-col items-center justify-center border border-dashed border-stone-300 rounded bg-white text-center p-4 m-2">
            <span className="text-xs font-semibold text-stone-800 font-headline uppercase tracking-wide">AdSense MPU</span>
          </div>
        </aside>
      );
    case 'half-page-sidebar':
      return (
        <aside aria-label="Advertisement" className={`w-full max-w-[300px] flex flex-col items-center bg-stone-50 border border-stone-200 overflow-hidden shrink-0 ${className}`}>
          <div className="w-full flex items-center justify-between px-3 py-1 bg-stone-100 border-b border-stone-200 text-[10px] uppercase tracking-widest text-stone-500 font-sans">
            <span>Sponsored Showcase</span>
          </div>
          <div className="w-full min-h-[600px] flex flex-col items-center justify-between border border-dashed border-stone-300 rounded bg-white text-center p-6 m-2">
            <div className="pt-8">
              <div className="w-12 h-1 bg-[#C8102E] mx-auto mb-4" />
              <span className="text-sm font-semibold text-stone-800 font-headline uppercase tracking-wider block">GEOTREXX Partner Network</span>
            </div>
          </div>
        </aside>
      );
    case 'in-article-banner':
      return (
        <aside aria-label="Advertisement" className={`w-full my-8 py-2 bg-stone-50 border-y border-stone-200 flex flex-col items-center justify-center ${className}`}>
          <span className="text-[9px] uppercase tracking-widest text-stone-400 mb-1 font-sans">Advertisement</span>
          <div className="w-full max-w-[728px] min-h-[90px] flex flex-col items-center justify-center border border-dashed border-stone-300 bg-white p-3 rounded text-center">
            <span className="text-xs font-semibold text-stone-700 font-headline uppercase tracking-wide">In-Article Responsive Banner</span>
          </div>
        </aside>
      );
    default:
      return null;
  }
};