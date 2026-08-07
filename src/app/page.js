import { Suspense } from 'react';
import DashboardClient from './DashboardClient';

const CMS_URL = "https://eu-west-2.cdn.hygraph.com/content/cmrms81py00mq07w07a3zcs1e/master";

async function getEliteArticles() {
  try {
    const query = `
      query { 
        articles(orderBy: publishedAt_DESC) { 
          id 
          title 
          slug 
          summary 
          category
          image { url } 
        } 
      }
    `;
    const response = await fetch(CMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      cache: 'no-store'
    });
    const result = await response.json();
    return result.data?.articles || [];
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const articles = await getEliteArticles();
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-geo-dark flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-800 border-t-geo-red rounded-full animate-spin mb-4"></div>
        <h1 className="text-white font-black tracking-widest uppercase animate-pulse">Initializing Nexus...</h1>
      </div>
    }>
      <DashboardClient serverArticles={articles} />
    </Suspense>
  );
}