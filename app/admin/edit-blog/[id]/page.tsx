'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image_url: string;
  category_id: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  status: string;
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<Blog>({
    id: '',
    title: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    category_id: '',
    tags: [],
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageWarning, setImageWarning] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${id}`);
      if (!response.ok) {
        setError('Blog not found');
        return;
      }
      const data = await response.json();
      setFormData(data);
      
      // Check if featured image is external
      if (data.featured_image_url) {
        try {
          const url = new URL(data.featured_image_url);
          const isExternal = !url.hostname.includes('localhost');
          if (isExternal) {
            setImageWarning(
              `ℹ️ External image detected (${url.hostname}). This requires configuration in next.config.js. If you see image errors, the domain needs to be whitelisted.`
            );
          }
        } catch {
          // Invalid URL
        }
      }
    } catch (error) {
      setError('Failed to load blog');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Check for external image URLs
    if (name === 'featured_image_url' && value) {
      try {
        const url = new URL(value);
        const isExternal = !url.hostname.includes('localhost');
        if (isExternal) {
          setImageWarning(
            `ℹ️ External image detected (${url.hostname}). This requires configuration in next.config.js. If you see image errors, the domain needs to be whitelisted.`
          );
        } else {
          setImageWarning('');
        }
      } catch {
        setImageWarning('⚠️ Invalid URL format');
      }
    } else if (name === 'featured_image_url' && !value) {
      setImageWarning('');
    }
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags,
          status: publish ? 'published' : formData.status,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to update blog');
        return;
      }

      router.push('/admin/dashboard');
    } catch (error) {
      setError('Failed to update blog. Please try again.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8 pb-8 border-b border-slate-700 mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Edit Blog Post</h1>
        <Link
          href="/admin/dashboard"
          className="text-slate-400 hover:text-white transition px-4 py-2 rounded hover:bg-slate-700"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        <form onSubmit={e => handleSubmit(e, false)} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Blog Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter blog title"
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Featured Image URL
            </label>
            <input
              type="url"
              name="featured_image_url"
              value={formData.featured_image_url}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
            />
            {imageWarning && (
              <p className={`text-sm mt-2 px-3 py-2 rounded ${
                imageWarning.includes('⚠️') 
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500' 
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500'
              }`}>
                {imageWarning}
              </p>
            )}
            <p className="text-sm text-slate-400 mt-2">
              Supported: Unsplash, Pexels, Pixabay, Imgur, Cloudinary. Or upload and use the direct link.
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="Short description"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={15}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
              placeholder="Blog content"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="tag1, tag2, tag3"
            />
          </div>

          {/* SEO Section */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500"
                  maxLength={60}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  SEO Description
                </label>
                <textarea
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500"
                  maxLength={160}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  name="seo_keywords"
                  value={formData.seo_keywords}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {formData.status === 'draft' && (
              <button
                type="button"
                onClick={e => handleSubmit(e, true)}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
              >
                {saving ? 'Processing...' : 'Publish / Submit for Approval'}
              </button>
            )}
            {formData.status === 'pending_approval' && (
              <div className="flex-1 bg-yellow-600/30 border border-yellow-600 text-yellow-300 px-4 py-3 rounded-lg flex items-center justify-center">
                Waiting for admin approval
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
