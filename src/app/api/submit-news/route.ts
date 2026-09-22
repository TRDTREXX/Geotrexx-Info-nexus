import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

// 1. Initialize Sanity Write Client
const writeClient = createClient({
  projectId: 'x0tpoga9',
  dataset: 'production',
  apiVersion: '2024-03-01',
  useCdn: false,
  // Hardcoded to bypass Vercel cache completely
  token: 'sk9kldaFOmZNWrhN7bQzYi1AZT7E5OpCEoPj2px5ggL6YEh52ehVvMKyiIo4BPl1hbj4t2xItWfHZGYdzJ9lU7dyxN8uNIpd94LfEAYOJlssN4qFuP5DFouqrJWOGuokD8nR4OuB7X1EhaxxKRz2u3mWqYUkuz0SJHjASD4qF8Wfjw68rEVT', 
});

export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

function toPortableText(text: string) {
  return text.split(/\n\s*\n/).filter((para) => para.trim().length > 0).map((para, index) => ({
    _key: `block_${Date.now()}_${index}`,
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{ _key: `span_${Date.now()}_${index}`, _type: 'span', marks: [], text: para.trim() }],
  }));
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const passcode = formData.get('passcode') as string;
    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const bodyText = formData.get('body') as string;
    const authorId = formData.get('authorId') as string;
    const imageFile = formData.get('image') as File | null;
    
    // Extract the new Section IDs
    const mainSectionId = formData.get('mainSectionId') as string;
    const subSectionId = formData.get('subSectionId') as string;

    const EDITORIAL_PASSCODE = process.env.WRITER_PORTAL_PASSCODE || 'geotrexx2026';
    if (passcode !== EDITORIAL_PASSCODE) {
      return NextResponse.json({ error: 'Unauthorized: Invalid editorial passcode.' }, { status: 401 });
    }

    if (!title || !bodyText || !authorId || !mainSectionId) {
      return NextResponse.json({ error: 'Missing required article fields (title, body, author, or main section).' }, { status: 400 });
    }

    if (!imageFile || !(imageFile instanceof File) || imageFile.size === 0) {
      return NextResponse.json({ error: 'A valid main image file is required.' }, { status: 400 });
    }

    if (imageFile.size > 4.5 * 1024 * 1024) {
      return NextResponse.json({ error: `Image too large (${(imageFile.size / 1024 / 1024).toFixed(1)}MB). Vercel limit is 4.5MB.` }, { status: 413 });
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    const imageAsset = await writeClient.assets.upload('image', imageBuffer, {
      filename: imageFile.name || 'article-main-image.jpg',
      contentType: imageFile.type || 'image/jpeg',
    });

    if (!imageAsset?._id) {
      throw new Error('Sanity image asset upload failed: no asset ID returned.');
    }

    const uniqueSlug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;
    const portableTextBody = toPortableText(bodyText);

    // Build the final document
    const docPayload: any = {
      _type: 'article', 
      title: title.trim(),
      slug: { _type: 'slug', current: uniqueSlug },
      publishedAt: new Date().toISOString(),
      summary: summary ? summary.trim() : '',
      author: { _type: 'reference', _ref: authorId },
      mainImage: { _type: 'image', asset: { _type: 'reference', _ref: imageAsset._id } },
      body: portableTextBody,
    };

    // Safely attach references if they exist
    if (mainSectionId) {
      docPayload.mainSection = { _type: 'reference', _ref: mainSectionId };
    }
    if (subSectionId) {
      docPayload.subSection = { _type: 'reference', _ref: subSectionId };
    }

    const createdArticle = await writeClient.create(docPayload);

    return NextResponse.json({
      success: true,
      articleId: createdArticle._id,
      slug: uniqueSlug,
      message: 'Article and image successfully published live to Sanity!',
    });
  } catch (error: any) {
    console.error('API /api/submit-news Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error during publication', details: error.response?.body || error.stack }, { status: 500 });
  }
}