import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const categorySlug = body?.category?.slug?.current;
    
    // 1. Purge the global articles cache (updates the homepage)
    revalidateTag('articles');
    
    // 2. Purge the specific category cache (updates the specific tab)
    if (categorySlug) {
      revalidateTag(`category-${categorySlug}`);
    }
    
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating cache' }, { status: 500 });
  }
}