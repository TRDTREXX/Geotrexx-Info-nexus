import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import crypto from 'crypto';

// 1. This connects to your Sanity database using your secret token
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'x0tpoga9',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN, 
});

// 2. This cleans up the title to make a clean URL slug
function slugify(text: string) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').slice(0, 100);
}

// 3. This is the actual tunnel that receives the data from your writer's form
export async function POST(req: Request) {
  try {
    const { passcode, title, category, summary, body } = await req.json();

    // Check if the writer typed the correct passcode
    const validPasscode = process.env.WRITER_PORTAL_PASSCODE || 'geotrexx2026';
    if (!passcode || passcode !== validPasscode) {
      return NextResponse.json({ error: 'Invalid access passcode.' }, { status: 401 });
    }

    if (!title || !category || !summary || !body) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Convert their plain text into Sanity's block format
    const paragraphs = body.split(/\n\s*\n/).map((p: string) => p.trim()).filter((p: string) => p.length > 0);
    const portableTextBody = paragraphs.map((text: string) => ({
      _type: 'block',
      _key: crypto.randomBytes(6).toString('hex'),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: crypto.randomBytes(6).toString('hex'), marks: [], text }],
    }));

    const cleanSlug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;
    const documentId = `drafts.${crypto.randomUUID()}`;

    // Package the article and send it to Sanity as a Draft
    const doc = {
      _id: documentId,
      _type: 'article',
      title,
      slug: { _type: 'slug', current: cleanSlug },
      category: category.toLowerCase(),
      summary,
      body: portableTextBody,
      publishedAt: new Date().toISOString(),
    };

    await writeClient.create(doc);
    return NextResponse.json({ success: true, message: 'Draft submitted successfully.' });

  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to submit article.' }, { status: 500 });
  }
}