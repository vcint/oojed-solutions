'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface SEOSettings {
  siteName: string;
  siteDescription: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  twitterHandle: string;
  facebookPage: string;
  googleAnalyticsId: string;
  robotsTxt: string;
  sitemapEnabled: boolean;
}

export default function SEOSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [settings, setSettings] = useState<SEOSettings>({
    siteName: '',
    siteDescription: '',
    defaultTitle: '',
    defaultDescription: '',
    defaultImage: '',
    twitterHandle: '',
    facebookPage: '',
    googleAnalyticsId: '',
    robotsTxt: 'User-agent: *\nAllow: /',
    sitemapEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // Load settings on mount
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/seo-settings');
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded SEO settings:', data);
        setSettings({ ...settings, ...data });
      } else {
        console.log('Failed to load SEO settings, using defaults');
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/seo-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        alert('SEO settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout API failed:', e);
    }
    setUser(null);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Access Denied</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pb-8 border-b border-slate-700 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">SEO Settings</h1>
          {user && (
            <p className="text-green-400 text-lg font-bold mt-2 bg-slate-800 p-2 rounded">
              ✅ Logged in as: {user.email} (Role: {user.role})
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/dashboard"
            className="text-slate-400 hover:text-white transition px-4 py-2 rounded hover:bg-slate-700"
          >
            Back to Dashboard
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
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Global SEO Configuration</h3>
            <div className="flex items-center gap-4">
              {!loading && (
                <span className="text-green-400 text-sm">
                  ✓ Settings loaded
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white px-6 py-2 rounded font-semibold transition"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>

          <p className="text-slate-400 mb-6">
            Configure global SEO settings for your blog. These settings affect meta tags, social sharing, and search engine crawling.
          </p>
          <div className="bg-slate-700 p-4 rounded mb-6">
            <p className="text-slate-300 text-sm">
              <strong>Note:</strong> Robots.txt is served at <code className="bg-slate-600 px-1 rounded">/api/robots.txt</code> and 
              XML sitemap at <code className="bg-slate-600 px-1 rounded">/api/sitemap.xml</code> (if enabled).
              Submit your sitemap to Google Search Console and Bing Webmaster Tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Site Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Site Information</h4>
              
              <div>
                <label className="block text-slate-300 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
                  placeholder="Your Website Name"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Site Description</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white h-24"
                  placeholder="Brief description of your website"
                />
              </div>
            </div>

            {/* Default Meta Tags */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Default Meta Tags</h4>
              
              <div>
                <label className="block text-slate-300 mb-2">Default Page Title</label>
                <input
                  type="text"
                  value={settings.defaultTitle}
                  onChange={(e) => setSettings({ ...settings, defaultTitle: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
                  placeholder="Default title for pages without custom title"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Default Description</label>
                <textarea
                  value={settings.defaultDescription}
                  onChange={(e) => setSettings({ ...settings, defaultDescription: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white h-24"
                  placeholder="Default meta description"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Default Social Image URL</label>
                <input
                  type="url"
                  value={settings.defaultImage}
                  onChange={(e) => setSettings({ ...settings, defaultImage: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
                  placeholder="https://example.com/default-image.jpg"
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Social Media</h4>
              
              <div>
                <label className="block text-slate-300 mb-2">Twitter Handle</label>
                <input
                  type="text"
                  value={settings.twitterHandle}
                  onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
                  placeholder="@yourtwitterhandle"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Facebook Page URL</label>
                <input
                  type="url"
                  value={settings.facebookPage}
                  onChange={(e) => setSettings({ ...settings, facebookPage: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
            </div>

            {/* Analytics & Technical */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Analytics & Technical</h4>
              
              <div>
                <label className="block text-slate-300 mb-2">Google Analytics ID</label>
                <input
                  type="text"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
                  placeholder="GA-XXXXXXXXXX"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sitemapEnabled"
                  checked={settings.sitemapEnabled}
                  onChange={(e) => setSettings({ ...settings, sitemapEnabled: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="sitemapEnabled" className="text-slate-300">Enable XML Sitemap</label>
              </div>
            </div>
          </div>

          {/* Robots.txt */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-white mb-4">Robots.txt Configuration</h4>
            <textarea
              value={settings.robotsTxt}
              onChange={(e) => setSettings({ ...settings, robotsTxt: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white font-mono h-32"
              placeholder="User-agent: *&#10;Allow: /"
            />
            <p className="text-slate-400 text-sm mt-2">
              Configure how search engines crawl your site. Changes take effect immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}