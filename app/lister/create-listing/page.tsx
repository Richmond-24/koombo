'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type FormData = {
  title: string;
  description: string;
  category: string;
  price: string;
  location: string;
  sellerEmail: string;
  sellerName: string;
  sellerPhone: string;
  imageUrls: string[];
  videoUrls: string[];
};

export default function CreateListing() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('connector_token') : null;
    setToken(savedToken);
  }, []);

  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    category: 'Electronics',
    price: '',
    location: 'Accra',
    sellerEmail: '',
    sellerName: '',
    sellerPhone: '',
    imageUrls: [],
    videoUrls: [],
  });

  const categories = [
    'Electronics',
    'Fashion',
    'Books',
    'Home & Furniture',
    'Food',
    'Beauty',
    'Services',
    'Sports',
    'Other'
  ];

  const normalizeAIResultCategory = (value?: string) => {
    const normalized = (value || '').toLowerCase();
    const map: Record<string, string> = {
      electronics: 'Electronics',
      fashion: 'Fashion',
      books: 'Books',
      'home & furniture': 'Home & Furniture',
      'home and furniture': 'Home & Furniture',
      food: 'Food',
      beauty: 'Beauty',
      services: 'Services',
      sports: 'Sports',
      other: 'Other',
      'phones & accessories': 'Electronics',
    };

    return map[normalized] || value || 'Electronics';
  };

  const handleAnalyzeImage = async (file: File | null) => {
    if (!file) {
      setAiError('Please choose an image to analyze.');
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const fd = new FormData();
      fd.append('image', file);

      const response = await fetch('/api/listings', {
        method: 'POST',
        body: fd,
      });

      const json = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(json?.error || 'AI analysis failed.');
      }

      const aiListing = json?.listing || {};
      const nextCategory = normalizeAIResultCategory(aiListing.category || aiListing.productCategory);

      setForm((prev) => ({
        ...prev,
        title: aiListing.title || prev.title,
        description: aiListing.description || prev.description,
        category: nextCategory,
        price: aiListing.price ? String(aiListing.price) : prev.price,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI analysis failed.';
      setAiError(message);
    } finally {
      setAiLoading(false);
    }
  };

  const locations = [
    'Accra',
    'Kumasi',
    'Tamale',
    'Takoradi',
    'Cape Coast',
    'Sunyani',
    'Other'
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!form.title.trim() || !form.description.trim() || !form.price.trim() || !form.sellerEmail.trim()) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Determine API base URL with fallback to localhost:5000 in dev
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 
        (typeof window !== 'undefined' && window.location.hostname.includes('localhost') ? 'http://localhost:5000' : '');
      
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${apiBase}/api/listings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          status: 'pending',
          isActive: false,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const errMsg = json?.error || json?.message || `Failed to create listing (${res.status})`;
        throw new Error(errMsg);
      }

      setSuccess(true);
      setTimeout(() => {
        const connectorId = typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('connector') || localStorage.getItem('connector_id')
          : null;
        router.push(`/lister/connectors/dashboard${connectorId ? `?connector=${connectorId}` : ''}`);
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-bold text-gray-900 tracking-tight">Create Business Link</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a New Business Link</h1>
            <p className="text-gray-600">List your products or services and start earning through your referral network.</p>
          </div>

          <div className="mb-6 rounded-2xl border border-purple-200 bg-purple-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-purple-800">AI product draft</p>
                <p className="text-sm text-purple-700">Upload a clear product photo and let the existing Koombo AI analysis fill in the listing draft.</p>
              </div>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-purple-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-800">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedImage(file);
                    void handleAnalyzeImage(file);
                  }}
                />
                {aiLoading ? 'Analyzing...' : 'Upload product photo'}
              </label>
            </div>

            {selectedImage && (
              <p className="mt-3 text-xs text-purple-700">Selected file: {selectedImage.name}</p>
            )}

            {aiError && (
              <p className="mt-3 text-sm font-medium text-red-700">{aiError}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g., Premium Wireless Headphones"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                placeholder="Provide detailed information about your product or service..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                disabled={loading}
                rows={5}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (GHS) <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50"
                  required
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Seller Phone */}
              <div>
                <label htmlFor="sellerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="sellerPhone"
                  type="tel"
                  placeholder="+233 20 123 4567"
                  value={form.sellerPhone}
                  onChange={(e) => setForm({ ...form, sellerPhone: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Seller Name */}
              <div>
                <label htmlFor="sellerName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="sellerName"
                  type="text"
                  placeholder="Full name"
                  value={form.sellerName}
                  onChange={(e) => setForm({ ...form, sellerName: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50"
                  required
                />
              </div>

              {/* Seller Email */}
              <div>
                <label htmlFor="sellerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="sellerEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={form.sellerEmail}
                  onChange={(e) => setForm({ ...form, sellerEmail: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Business link created successfully! Redirecting...
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Business Link
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
