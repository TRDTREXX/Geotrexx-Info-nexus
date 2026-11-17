'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ShareBarProps {
  title: string;
  slug?: string;
  url?: string;
  authorName?: string;
  authorSlug?: string;
  authorAvatar?: string;
  publishedAt?: string;
  className?: string;
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function ShareBar({
  title,
  slug,
  url,
  authorName = 'Orpheus Grant-Essilfie',
  authorSlug,
  authorAvatar,
  publishedAt,
  className = '',
}: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl =
    url ||
    (slug
      ? `https://www.geotrexx.com/news/${slug}`
      : typeof window !== 'undefined'
      ? window.location.href
      : 'https://www.geotrexx.com');

  const resolvedAuthorSlug = authorSlug || toSlug(authorName);
  const lowerAuthor = authorName.toLowerCase();
  const fallbackAvatar = lowerAuthor.includes('quist')
    ? '/quist.jpg.jpeg'
    : '/orpheus.jpg.jpeg';

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div
      className={`w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3.5 my-6 border-y border-geotrexx-black bg-white ${className}`}
    >
      <Link
        href={`/author/${resolvedAuthorSlug}`}
        className="group flex items-center gap-3 no-underline"
      >
        <img
          src={authorAvatar || fallbackAvatar}
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.endsWith('/orpheus.png') && !target.src.endsWith('/quist.png')) {
              target.src = lowerAuthor.includes('quist') ? '/quist.png' : '/orpheus.png';
            }
          }}
          alt={authorName}
          className="w-10 h-10 rounded-full object-cover object-top border border-geotrexx-black group-hover:border-[#C8102E] shrink-0 transition-colors"
        />
        <div className="leading-tight">
          <div className="text-xs font-mono uppercase tracking-wider text-geotrexx-black">
            <span className="text-gray-500 mr-1.5">By</span>
            <span className="font-black text-geotrexx-black group-hover:text-[#C8102E] underline decoration-gray-300 group-hover:decoration-[#C8102E] underline-offset-4 transition-colors">
              {authorName}
            </span>
          </div>
          {publishedAt && (
            <span className="block text-[11px] font-mono text-gray-600 mt-0.5">
              {publishedAt}
            </span>
          )}
        </div>
      </Link>

      <div className="flex items-center divide-x divide-gray-300 text-[11px] font-mono font-bold uppercase tracking-widest">
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
            `${title} — ${currentUrl}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pr-3 text-geotrexx-black hover:text-[#C8102E] transition-colors no-underline"
        >
          WhatsApp
        </a>

        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 text-geotrexx-black hover:text-[#C8102E] transition-colors no-underline"
        >
          X
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            currentUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 text-geotrexx-black hover:text-[#C8102E] transition-colors no-underline"
        >
          Facebook
        </a>

        <button
          onClick={handleCopyLink}
          className="pl-3 text-geotrexx-black hover:text-[#C8102E] transition-colors cursor-pointer bg-transparent border-0 uppercase font-mono text-[11px] font-bold tracking-widest"
        >
          {copied ? 'Copied' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}