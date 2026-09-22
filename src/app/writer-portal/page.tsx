'use client';
import { useState, useEffect } from 'react';
import { createClient } from 'next-sanity';

const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'x0tpoga9',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-01',
  useCdn: true,
});

export default function WriterPortal() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [mainSections, setMainSections] = useState<any[]>([]);
  const [subSections, setSubSections] = useState<any[]>([]);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

  useEffect(() => {
    async function fetchSanityData() {
      try {
        const [authorsData, mainData, subData] = await Promise.all([
          readClient.fetch(`*[_type == "author"]{_id, name}`),
          // Change "mainSection" below if your Sanity schema uses a different name for this document type
          readClient.fetch(`*[_type == "mainSection"]{_id, title}`),
          // Change "subSection" below if your Sanity schema uses a different name for this document type
          readClient.fetch(`*[_type == "subSection"]{_id, title}`)
        ]);
        setAuthors(authorsData || []);
        setMainSections(mainData || []);
        setSubSections(subData || []);
      } catch (error) {
        console.error("Failed to fetch Sanity dropdown data", error);
      }
    }
    fetchSanityData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 4.2 * 1024 * 1024) {
        setStatus({
          type: 'error',
          message: `Image is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Vercel allows up to 4.2MB. Please compress or resize before submitting.`,
        });
        e.target.value = '';
        setImageFile(null);
        return;
      }
      setImageFile(file);
      setStatus({ type: 'idle', message: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Publishing article to Sanity...' });

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (imageFile) {
      formData.set('image', imageFile);
    }

    try {
      const response = await fetch('/api/submit-news', {
        method: 'POST',
        body: formData, 
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit article.');
      }

      setStatus({ type: 'success', message: result.message });
      form.reset();
      setImageFile(null);
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-6 uppercase tracking-wide">Writer Portal</h1>
      <p className="mb-8 text-gray-600">Articles submitted here bypass the draft queue and auto-publish directly to the live site.</p>
      
      {status.message && (
        <div className={`p-4 mb-6 rounded ${status.type === 'error' ? 'bg-red-100 text-red-700' : status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 border border-gray-200 rounded shadow-sm">
        
        {/* PASSCODE & AUTHOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold tracking-widest text-gray-700 mb-2 uppercase">Editorial Passcode *</label>
            <input type="password" name="passcode" required className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700" />
          </div>
          
          <div>
            <label className="block text-sm font-bold tracking-widest text-gray-700 mb-2 uppercase">Author Profile *</label>
            <select name="authorId" required className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700 font-bold text-red-800">
              <option value="">SELECT AUTHOR...</option>
              {authors.map((author) => (
                <option key={author._id} value={author._id}>{author.name?.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* HEADLINE */}
        <div>
          <label className="block text-sm font-bold tracking-widest text-gray-700 mb-2 uppercase">Headline *</label>
          <input type="text" name="title" required className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700" />
        </div>

        {/* MAIN SECTION & SUB-SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold tracking-widest text-gray-700 mb-2 uppercase">Main Section *</label>
            <select name="mainSectionId" required className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700">
              <option value="">SELECT MAIN SECTION...</option>
              {mainSections.map((sec) => (
                <option key={sec._id} value={sec._id}>{sec.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold tracking-widest text-gray-700 mb-2 uppercase">Sub-Section</label>
            <select name="subSectionId" className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700">
              <option value="">SELECT SUB-SECTION...</option>
              {subSections.map((sub) => (
                <option key={sub._id} value={sub._id}>{sub.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="bg-gray-50 p-6 rounded border border-gray-200">
          <label className="block text-sm font-bold tracking-widest text-gray-700 mb-2 uppercase">Main Article Image * <span className="font-normal text-gray-500 normal-case tracking-normal">(Required for Auto-Publish)</span></label>
          <input type="file" accept="image/*" onChange={handleImageChange} required className="w-full" />
        </div>

        {/* TEXT CONTENT */}
        <div>
          <label className="block text-sm font-bold tracking-widest text-gray-700 mb-2 uppercase">Summary *</label>
          <textarea name="summary" rows={2} required className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"></textarea>
        </div>

        <div>
          <label className="block text-sm font-bold tracking-widest text-gray-700 mb-2 uppercase">Full Article Body *</label>
          <textarea name="body" rows={10} required className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700" placeholder="Separate paragraphs by pressing Enter twice..."></textarea>
        </div>

        <button type="submit" disabled={status.type === 'loading'} className="w-full bg-red-700 text-white font-bold tracking-widest uppercase p-4 rounded hover:bg-red-800 disabled:opacity-50 transition-colors">
          {status.type === 'loading' ? 'Publishing...' : 'Publish Article'}
        </button>
      </form>
    </main>
  );
}