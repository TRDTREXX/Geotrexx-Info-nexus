'use client';

import React, { useState, useEffect } from 'react';
import { client } from '../../sanity/lib/client';

const CATEGORIES = ['Ghana', 'Politics', 'Business', 'Sports', 'STEM', 'Entertainment', 'World', 'Opinion'];

export default function WriterPortalPage() {
  const [authors, setAuthors] = useState<{ _id: string, name: string }[]>([]);
  const [form, setForm] = useState({ passcode: '', title: '', category: 'Ghana', summary: '', body: '', authorId: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Automatically fetch all current authors from Sanity when the page loads
  useEffect(() => {
    async function fetchAuthors() {
      try {
        const authorData = await client.fetch('*[_type == "author"]{_id, name} | order(name asc)');
        setAuthors(authorData);
      } catch (err) {
        console.error('Failed to fetch authors:', err);
      }
    }
    fetchAuthors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    if (!form.authorId) {
      setStatus({ type: 'error', message: 'You must select an Author Profile.' });
      setLoading(false);
      return;
    }

    if (!imageFile) {
      setStatus({ type: 'error', message: 'You must upload a Main Image to publish directly.' });
      setLoading(false);
      return;
    }

    // We must use FormData instead of JSON so we can securely transmit the image file
    const formData = new FormData();
    formData.append('passcode', form.passcode);
    formData.append('title', form.title);
    formData.append('category', form.category);
    formData.append('summary', form.summary);
    formData.append('body', form.body);
    formData.append('authorId', form.authorId);
    formData.append('image', imageFile);

    try {
      const res = await fetch('/api/submit-news', {
        method: 'POST',
        body: formData, // Next.js automatically sets the correct headers for FormData
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setStatus({ type: 'success', message: 'SUCCESS: Story and image published live to GEOTREXX!' });
      
      // Clear out the form for the next article
      setForm((prev) => ({ ...prev, title: '', summary: '', body: '' }));
      setImageFile(null);
      const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#ffffff', color: '#121826' }}>
      <div className="max-w-3xl mx-auto border border-gray-200 rounded-sm shadow-sm p-6 sm:p-10">
        <div className="border-b-2 border-gray-900 pb-4 mb-8">
          <span className="text-xs font-black text-[#C8102E] uppercase tracking-widest font-mono">GEOTREXX Editorial Desk</span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mt-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
            Staff Article Submission
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-serif">
            Articles submitted here bypass the draft queue and auto-publish directly to the live site.
          </p>
        </div>

        {status && (
          <div className={`p-4 rounded-sm mb-6 text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-[#C8102E]'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-200 pb-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 font-mono">Editorial Passcode *</label>
              <input type="password" name="passcode" required value={form.passcode} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 font-mono">Author Profile *</label>
              <select name="authorId" required value={form.authorId} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-white font-bold text-[#C8102E]">
                <option value="">Select Writer...</option>
                {authors.map((author) => (
                  <option key={author._id} value={author._id}>{author.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 font-mono">Headline *</label>
              <input type="text" name="title" required value={form.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-sm font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 font-mono">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-white">
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 font-mono">
              Main Article Image * <span className="text-gray-400 font-normal">(Required for Auto-Publish)</span>
            </label>
            <input 
              id="imageUpload"
              type="file" 
              accept="image/*" 
              required 
              onChange={handleImageChange} 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:bg-[#C8102E] file:text-white hover:file:bg-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 font-mono">Summary *</label>
            <textarea name="summary" required rows={2} value={form.summary} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-sm" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 font-mono">Body Copy *</label>
            <textarea name="body" required rows={12} value={form.body} onChange={handleChange} placeholder="Separate paragraphs with an empty line..." className="w-full px-4 py-2 border border-gray-300 rounded-sm font-serif" />
          </div>

          <div className="border-t border-gray-200 pt-4 flex justify-end">
            <button type="submit" disabled={loading} className="px-8 py-3 bg-[#C8102E] text-white font-bold uppercase text-xs tracking-widest hover:bg-black transition-colors disabled:opacity-50" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {loading ? 'Publishing Live...' : 'Publish Live to GEOTREXX'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}