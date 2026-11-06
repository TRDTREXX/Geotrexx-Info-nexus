'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface ShareBarProps {
  title: string;
  slug?: string;
  url?: string;
  className?: string;
}

export default function ShareBar({ title, slug, url, className = '' }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  
  // Safely construct the share URL using the slug, or fallback to the window URL
  const currentUrl = url || (slug ? `https://www.geotrexx.com/news/${slug}` : (typeof window !== 'undefined' ? window.location.href : 'https://geotrexx.com'));
  
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: currentUrl });
      } catch (err) {
        console.error('Share failed', err);
      }
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 py-4 my-4 border-y border-stone-200 bg-white sticky top-[100px] z-30 ${className}`}>
      <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 font-sans mr-2 flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5 text-[#C8102E]" /> Share:
      </span>
      
      <button onClick={handleNativeShare} className="md:hidden min-h-[38px] px-3 py-1.5 bg-[#C8102E] text-white text-xs font-bold uppercase rounded-sm flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5" /> Native
      </button>

      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="min-h-[38px] px-3 py-1.5 flex items-center gap-2 border border-stone-200 text-xs font-medium text-stone-700 hover:bg-black hover:text-white transition-colors">
        {/* Custom X (Twitter) SVG */}
        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <span className="hidden sm:inline">Tweet</span>
      </a>
      
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="min-h-[38px] px-3 py-1.5 flex items-center gap-2 border border-stone-200 text-xs font-medium text-stone-700 hover:bg-[#1877F2] hover:text-white transition-colors">
        {/* Custom Facebook SVG */}
        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
        </svg>
        <span className="hidden sm:inline">Share</span>
      </a>

      <button onClick={handleCopyLink} className="min-h-[38px] px-3 py-1.5 flex items-center gap-2 border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-900 hover:text-white transition-colors">
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Link'}</span>
      </button>
    </div>
  );
}