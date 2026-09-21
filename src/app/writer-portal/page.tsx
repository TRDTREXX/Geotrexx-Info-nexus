'use client';

import React, { useState } from 'react';

const CATEGORIES = ['Ghana', 'Politics', 'Business', 'Sports', 'STEM', 'Entertainment', 'World', 'Opinion'];

export default function WriterPortalPage() {
  const [form, setForm] = useState({ passcode: '', title: '', category: 'Ghana', summary: '', body: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/submit-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setStatus({ type: 'success', message: 'Story submitted! It is now in the Sanity editorial queue as a draft.' });
      setForm((prev) => ({ ...prev, title: '', summary: '', body: '' })); // Clear form after success
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
        </div>

        {status && (
          <div className={`p-4 rounded-sm mb-6 text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-[#C8102E]'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 font-mono">Editorial Passcode *</label>
            <input type="password" name="passcode" required value={form.passcode} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-sm" />
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
              {loading ? 'Transmitting Draft...' : 'Submit to Editorial Queue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}