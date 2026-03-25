'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Save, Eye, Edit3, Trash2 } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface PageSeoData {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noindex?: boolean;
  nofollow?: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

interface PageRoute {
  route: string;
  name: string;
  description: string;
}

const availablePages: PageRoute[] = [
  { route: '/', name: 'Home', description: 'Homepage' },
  { route: '/about', name: 'About', description: 'About Us page' },
  { route: '/contact', name: 'Contact', description: 'Contact page' },
  { route: '/locations', name: 'Locations', description: 'Locations page' },
  { route: '/products', name: 'Products', description: 'Products page' },
  { route: '/services', name: 'Services', description: 'Services page' },
  { route: '/why-us', name: 'Why Us', description: 'Why Choose Us page' },
];

export default function PageSeoManagement() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [pageSeoData, setPageSeoData] = useState<Record<string, PageSeoData>>({});
  const [selectedRoute, setSelectedRoute] = useState<string>('/');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentData, setCurrentData] = useState<PageSeoData>({});
  const [activeTab, setActiveTab] = useState('basic');

  // Load user from session cookie on mount
  useEffect(() => {
    try {
      const cookie = document.cookie.split('; ').find(c => c.startsWith('author_session='));
      if (cookie) {
        const val = decodeURIComponent(cookie.split('=')[1]);
        const decoded = JSON.parse(atob(val));
        setUser({ id: decoded.authorId, email: decoded.email, name: decoded.name, role: decoded.role });
      } else {
        router.push('/admin/login');
      }
    } catch (e) {
      router.push('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadPageSeoData();
    }
  }, [user]);

  useEffect(() => {
    setCurrentData(pageSeoData[selectedRoute] || {});
  }, [selectedRoute, pageSeoData]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout API failed:', e);
    }
    setUser(null);
    router.push('/');
  };

  const loadPageSeoData = async () => {
    try {
      const response = await fetch('/api/page-seo');
      if (response.ok) {
        const data = await response.json();
        setPageSeoData(data);
        console.log('Page SEO data loaded:', Object.keys(data));
      } else {
        console.error('Failed to load page SEO data');
      }
    } catch (error) {
      console.error('Error loading page SEO data:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePageSeo = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/page-seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: selectedRoute,
          seoData: currentData,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: 'success', text: result.message });
        await loadPageSeoData(); // Reload data
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to save SEO settings' });
      }
    } catch (error) {
      console.error('Error saving page SEO:', error);
      setMessage({ type: 'error', text: 'Failed to save SEO settings' });
    } finally {
      setSaving(false);
    }
  };

  const deletePageSeo = async () => {
    if (!confirm(`Are you sure you want to delete SEO settings for ${selectedRoute}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/page-seo/${encodeURIComponent(selectedRoute)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'SEO settings deleted successfully' });
        await loadPageSeoData();
        setCurrentData({});
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to delete SEO settings' });
      }
    } catch (error) {
      console.error('Error deleting page SEO:', error);
      setMessage({ type: 'error', text: 'Failed to delete SEO settings' });
    }
  };

  const updateCurrentData = (field: keyof PageSeoData, value: string | boolean) => {
    setCurrentData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectedPage = availablePages.find(p => p.route === selectedRoute);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">
          {loading ? 'Loading page SEO data...' : 'Authenticating...'}
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-2xl mb-4">Access Denied</div>
          <div className="text-slate-400 mb-8">You need admin privileges to access this page.</div>
          <Link href="/admin/dashboard" className="text-blue-400 hover:text-blue-300">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pb-8 border-b border-slate-700 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Page SEO Management</h1>
          <p className="text-green-400 text-lg font-bold mt-2 bg-slate-800 p-2 rounded">
            ✅ Logged in as: {user.email} (Role: {user.role})
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/dashboard"
            className="text-slate-400 hover:text-white transition px-4 py-2 rounded hover:bg-slate-700"
          >
            ← Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-white transition px-4 py-2 rounded hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-slate-400 text-lg mb-8">
            Configure custom SEO settings for individual pages. These settings will override global SEO defaults.
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-md ${message.type === 'error' ? 'border border-red-200 bg-red-50 text-red-800' : 'border border-green-200 bg-green-50 text-green-800'}`}>
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span>{message.text}</span>
            </div>
          </div>
        )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page Selection Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Pages</h3>
              <p className="text-slate-400 text-sm">Select a page to configure SEO</p>
            </div>
            <div className="space-y-2">
              {availablePages.map((page) => (
                <button
                  key={page.route}
                  onClick={() => setSelectedRoute(page.route)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedRoute === page.route
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'hover:bg-slate-700 border-slate-600 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{page.name}</div>
                      <div className="text-sm opacity-75">{page.route}</div>
                    </div>
                    {pageSeoData[page.route] && (
                      <Badge variant="secondary" className="text-xs">
                        <Edit3 className="w-3 h-3 mr-1" />
                        Custom
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SEO Configuration */}
        <div className="lg:col-span-3">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-white text-xl font-semibold">
                <Eye className="w-5 h-5" />
                SEO Settings for {selectedPage?.name}
              </h2>
              <p className="text-slate-400 mt-1">
                {selectedPage?.description} - Route: {selectedRoute}
                {pageSeoData[selectedRoute] && (
                  <span className="ml-2 text-green-400">
                    ✓ Custom SEO configured
                  </span>
                )}
              </p>
            </div>
            <div>
              <div className="flex space-x-1 mb-6 bg-slate-700 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`px-4 py-2 rounded text-sm font-medium transition ${
                    activeTab === 'basic'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-600'
                  }`}
                >
                  Basic SEO
                </button>
                <button
                  onClick={() => setActiveTab('social')}
                  className={`px-4 py-2 rounded text-sm font-medium transition ${
                    activeTab === 'social'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-600'
                  }`}
                >
                  Social Media
                </button>
                <button
                  onClick={() => setActiveTab('advanced')}
                  className={`px-4 py-2 rounded text-sm font-medium transition ${
                    activeTab === 'advanced'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-600'
                  }`}
                >
                  Advanced
                </button>
              </div>

              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">Page Title</label>
                      <input
                        type="text"
                        value={currentData.title || ''}
                        onChange={(e) => updateCurrentData('title', e.target.value)}
                        placeholder="Enter page title"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-slate-400">
                        Recommended: 50-60 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">Canonical URL</label>
                      <input
                        type="text"
                        value={currentData.canonical || ''}
                        onChange={(e) => updateCurrentData('canonical', e.target.value)}
                        placeholder={`https://oojed.com${selectedRoute}`}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Meta Description</label>
                    <textarea
                      value={currentData.description || ''}
                      onChange={(e) => updateCurrentData('description', e.target.value)}
                      placeholder="Enter meta description"
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-400">
                      Recommended: 150-160 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Keywords</label>
                    <input
                      type="text"
                      value={currentData.keywords || ''}
                      onChange={(e) => updateCurrentData('keywords', e.target.value)}
                      placeholder="keyword1, keyword2, keyword3"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-400">
                      Comma-separated keywords
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Open Graph (Facebook)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">OG Title</label>
                        <input
                          type="text"
                          value={currentData.ogTitle || ''}
                          onChange={(e) => updateCurrentData('ogTitle', e.target.value)}
                          placeholder="Open Graph title"
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">OG Image URL</label>
                        <input
                          type="text"
                          value={currentData.ogImage || ''}
                          onChange={(e) => updateCurrentData('ogImage', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">OG Description</label>
                      <textarea
                        value={currentData.ogDescription || ''}
                        onChange={(e) => updateCurrentData('ogDescription', e.target.value)}
                        placeholder="Open Graph description"
                        rows={2}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Twitter Cards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">Twitter Title</label>
                        <input
                          type="text"
                          value={currentData.twitterTitle || ''}
                          onChange={(e) => updateCurrentData('twitterTitle', e.target.value)}
                          placeholder="Twitter card title"
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">Twitter Image URL</label>
                        <input
                          type="text"
                          value={currentData.twitterImage || ''}
                          onChange={(e) => updateCurrentData('twitterImage', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">Twitter Description</label>
                      <textarea
                        value={currentData.twitterDescription || ''}
                        onChange={(e) => updateCurrentData('twitterDescription', e.target.value)}
                        placeholder="Twitter card description"
                        rows={2}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Search Engine Directives</h3>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="noindex"
                        checked={currentData.noindex || false}
                        onChange={(e) => updateCurrentData('noindex', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="noindex" className="text-sm text-slate-300">
                        No Index - Prevent search engines from indexing this page
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="nofollow"
                        checked={currentData.nofollow || false}
                        onChange={(e) => updateCurrentData('nofollow', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="nofollow" className="text-sm text-slate-300">
                        No Follow - Prevent search engines from following links on this page
                      </label>
                    </div>
                  </div>

                  {pageSeoData[selectedRoute] && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">Management</h3>
                      <div className="text-sm text-slate-400">
                        Last updated: {new Date(pageSeoData[selectedRoute].updatedAt || '').toLocaleString()}
                      </div>
                      <button
                        onClick={deletePageSeo}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Custom SEO
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-slate-700">
                <button
                  onClick={() => setCurrentData(pageSeoData[selectedRoute] || {})}
                  disabled={!pageSeoData[selectedRoute]}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset Changes
                </button>
                <button
                  onClick={savePageSeo}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save SEO Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}