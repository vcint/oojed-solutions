'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SEOSuggestion {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  suggestedKeywords: string[];
  quality?: {
    isOptimal: boolean;
    warnings: string[];
    suggestions: string[];
  };
}

export default function CreateBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    category_id: '',
    tags: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageWarning, setImageWarning] = useState('');
  const [seoGenerating, setSeoGenerating] = useState(false);
  const [seoSuggestion, setSeoSuggestion] = useState<SEOSuggestion | null>(null);
  const [seoError, setSeoError] = useState('');

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

  const handleGenerateSEO = async () => {
    setSeoError('');
    setSeoGenerating(true);

    if (!formData.title.trim() || !formData.content.trim()) {
      setSeoError('Title and content are required to generate SEO metadata');
      setSeoGenerating(false);
      return;
    }

    try {
      const response = await fetch('/api/blogs/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSeoError(data.error || 'Failed to generate SEO metadata');
        return;
      }

      setSeoSuggestion(data.data);
    } catch (error) {
      setSeoError('Failed to generate SEO metadata. Please try again.');
      console.error(error);
    } finally {
      setSeoGenerating(false);
    }
  };

  const handleApplySEO = (suggestion: SEOSuggestion) => {
    setFormData(prev => ({
      ...prev,
      seo_title: suggestion.seo_title,
      seo_description: suggestion.seo_description,
      seo_keywords: suggestion.seo_keywords,
    }));
    setSeoSuggestion(null);
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          status: publish ? 'published' : 'draft',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create blog');
        return;
      }

      router.push('/admin/dashboard');
    } catch (error) {
      setError('Failed to create blog. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8 pb-8 border-b border-slate-700 mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Create New Blog Post</h1>
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

        <div className="bg-blue-600/20 border border-blue-500 text-blue-300 px-6 py-4 rounded-lg mb-8">
          <p>
            <strong>Note:</strong> Writers must submit blogs for admin approval before publishing.
            Admins can publish blogs immediately.
          </p>
        </div>

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
              Excerpt (Short Summary)
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="Short description of your blog (max 160 characters)"
            />
          </div>

          {/* Main Content */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Blog Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={15}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
              placeholder="Write your blog content here... (You can use HTML tags for formatting)"
            />
            <p className="text-sm text-slate-400 mt-2">
              💡 Tip: You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;,
              etc. for formatting
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="solar, energy, renewable, efficiency"
            />
          </div>

          {/* SEO Section */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">SEO Settings</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Automatically generate SEO-friendly metadata or customize manually
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateSEO}
                disabled={seoGenerating || !formData.title.trim() || !formData.content.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg transition text-sm"
              >
                {seoGenerating ? 'Generating...' : '✨ Auto-Generate SEO'}
              </button>
            </div>

            {seoError && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4">
                {seoError}
              </div>
            )}

            {seoSuggestion && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-green-400">✓ SEO Suggestions Generated</h4>
                  <button
                    type="button"
                    onClick={() => setSeoSuggestion(null)}
                    className="text-slate-400 hover:text-white text-xl"
                  >
                    ✕
                  </button>
                </div>

                {seoSuggestion.quality && (
                  <div className="mb-4 space-y-2">
                    {seoSuggestion.quality.warnings.length > 0 && (
                      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded p-2">
                        <p className="text-sm font-semibold text-yellow-300 mb-1">⚠️ Warnings:</p>
                        <ul className="text-sm text-yellow-200 space-y-1">
                          {seoSuggestion.quality.warnings.map((w, i) => (
                            <li key={i}>• {w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {seoSuggestion.quality.suggestions.length > 0 && (
                      <div className="bg-blue-500/20 border border-blue-500/30 rounded p-2">
                        <p className="text-sm font-semibold text-blue-300 mb-1">💡 Suggestions:</p>
                        <ul className="text-sm text-blue-200 space-y-1">
                          {seoSuggestion.quality.suggestions.map((s, i) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-slate-800 rounded p-3 mb-4 space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">Suggested Title:</p>
                    <p className="text-sm text-white break-words">{seoSuggestion.seo_title}</p>
                    <p className="text-xs text-slate-500">{seoSuggestion.seo_title.length}/60 characters</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">Suggested Description:</p>
                    <p className="text-sm text-white break-words">{seoSuggestion.seo_description}</p>
                    <p className="text-xs text-slate-500">{seoSuggestion.seo_description.length}/160 characters</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">Suggested Keywords:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {seoSuggestion.suggestedKeywords.map((kw, i) => (
                        <span key={i} className="bg-blue-600/30 text-blue-300 text-xs px-2 py-1 rounded">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleApplySEO(seoSuggestion)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
                >
                  ✓ Apply Suggestions
                </button>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  SEO Title
                  <span className="text-slate-400 font-normal text-xs ml-2">
                    ({formData.seo_title.length}/60)
                  </span>
                </label>
                <input
                  type="text"
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="Max 60 characters"
                  maxLength={60}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  SEO Description
                  <span className="text-slate-400 font-normal text-xs ml-2">
                    ({formData.seo_description.length}/160)
                  </span>
                </label>
                <textarea
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="Max 160 characters"
                  maxLength={160}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  name="seo_keywords"
                  value={formData.seo_keywords}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="button"
              onClick={e => handleSubmit(e, true)}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Processing...' : 'Publish / Submit for Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
