'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Blog {
  id: string;
  slug?: string;
  title: string;
  status: string;
  author_id?: string;
  created_at: string;
  published_at?: string;
  submitted_at?: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user from session cookie on mount
  useEffect(() => {
    try {
      const cookie = document.cookie.split('; ').find(c => c.startsWith('author_session='));
      if (cookie) {
        const val = decodeURIComponent(cookie.split('=')[1]);
        const decoded = JSON.parse(atob(val));
        setUser({ id: decoded.authorId, email: decoded.email, name: decoded.name, role: decoded.role });
      } else {
        router.push('/admin/login'); // Redirect to login if no session
      }
    } catch (e) {
      console.error('Failed to decode session:', e);
      router.push('/admin/login'); // Redirect on decode error
    }
  }, [router]);

  // Load blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs?status=all_by_author');
      const data = await response.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      setError('Failed to load your blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout API failed:', e);
    }
    setUser(null); // Clear local state
    router.push('/');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      draft: { bg: 'bg-slate-500/20', text: 'text-slate-300', label: 'Draft' },
      pending_approval: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', label: 'Pending Approval' },
      published: { bg: 'bg-green-500/20', text: 'text-green-300', label: 'Published' },
      rejected: { bg: 'bg-red-500/20', text: 'text-red-300', label: 'Rejected' },
    };
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-3 py-1 rounded text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
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
      {/* Dashboard Header */}
      <div className="max-w-6xl mx-auto px-4 pb-8 border-b border-slate-700 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Dashboard</h1>
          {user ? (
            <p className="text-green-400 text-lg font-bold mt-2 bg-slate-800 p-2 rounded">
              ✅ Logged in as: {user.email} (Role: {user.role})
            </p>
          ) : (
            <p className="text-red-400 text-lg font-bold mt-2 bg-slate-800 p-2 rounded">
              ❌ No user session loaded
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-white transition px-4 py-2 rounded hover:bg-slate-700"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Welcome Back!</h2>
          <p className="text-slate-400 text-lg mb-8">
            Manage your blog posts and create new content
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/admin/create-blog"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition"
            >
              + Create New Blog Post
            </Link>
            {/* Admin-only button */}
            {/* We'll add role check in a future update, for now check via API response */}
          </div>
        </div>

        {/* Blogs List Header */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 bg-slate-700">
            <h3 className="text-lg font-semibold text-white">
              {user?.role === 'admin' ? 'All Blog Posts' : 'Your Blog Posts'}
            </h3>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-6">
              {error}
            </div>
          )}

          {blogs.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 text-xl mb-4">
                No blog posts yet
              </p>
              <Link
                href="/admin/create-blog"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Create your first blog post →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {blogs.map(blog => (
                <div
                  key={blog.id}
                  className="px-6 py-4 hover:bg-slate-700/50 transition flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-white font-semibold mb-2">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      {getStatusBadge(blog.status)}
                      <span>
                        Created {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                      {blog.status === 'published' && (
                        <span className="text-green-400">
                          Published {new Date(blog.published_at!).toLocaleDateString()}
                        </span>
                      )}
                      {blog.status === 'pending_approval' && (
                        <span className="text-yellow-400">
                          Pending since {new Date(blog.submitted_at!).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {(user?.role === 'admin' || user?.id === blog.author_id) && (
                      <Link
                        href={`/admin/edit-blog/${blog.id}`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
                      >
                        Edit
                      </Link>
                    )}
                    {blog.status === 'published' && (
                      <Link
                        href={`/blog/${blog.slug || blog.id}`}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition"
                      >
                        View
                      </Link>
                    )}
                    {(user?.role === 'admin' || user?.id === blog.author_id) && blog.status === 'published' && (
                      <button
                        onClick={async () => {
                          if (!confirm('Revert this blog to draft? It will no longer be visible to the public.')) return;
                          try {
                            const res = await fetch(`/api/blogs/${blog.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ ...blog, status: 'draft' }),
                            });
                            if (!res.ok) throw new Error('Revert failed');
                            setBlogs(prev =>
                              prev.map(b => b.id === blog.id ? { ...b, status: 'draft', published_at: undefined } : b)
                            );
                          } catch (e) {
                            alert('Failed to revert blog to draft');
                            console.error(e);
                          }
                        }}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition"
                      >
                        Revert to Draft
                      </button>
                    )}
                    {(user?.role === 'admin' || user?.id === blog.author_id) && (
                      <button
                        onClick={async () => {
                          if (!confirm('Delete this blog? This action cannot be undone.')) return;
                          try {
                            const res = await fetch(`/api/blogs/${blog.id}`, { method: 'DELETE' });
                            if (!res.ok) {
                              const errorData = await res.json();
                              throw new Error(errorData.error || 'Delete failed');
                            }
                            setBlogs(prev => prev.filter(b => b.id !== blog.id));
                          } catch (e) {
                            alert(`Failed to delete blog: ${e}`);
                            console.error(e);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Section - Only for admins */}
        {user?.role === 'admin' && (
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Admin Tools</h3>
            <p className="text-purple-100 mb-6">
              Manage your blog system and content
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/admin/approve-blogs"
                className="block bg-white text-blue-600 px-6 py-4 rounded-lg font-semibold hover:bg-slate-100 transition text-center"
              >
                Review Pending Blogs →
              </Link>
              <Link
                href="/admin/user-management"
                className="block bg-white text-green-600 px-6 py-4 rounded-lg font-semibold hover:bg-slate-100 transition text-center"
              >
                User Management →
              </Link>
              <Link
                href="/admin/category-management"
                className="block bg-white text-orange-600 px-6 py-4 rounded-lg font-semibold hover:bg-slate-100 transition text-center"
              >
                Category Management →
              </Link>
              <Link
                href="/admin/seo-settings"
                className="block bg-white text-purple-600 px-6 py-4 rounded-lg font-semibold hover:bg-slate-100 transition text-center"
              >
                SEO Settings →
              </Link>
              <Link
                href="/admin/analytics"
                className="block bg-white text-red-600 px-6 py-4 rounded-lg font-semibold hover:bg-slate-100 transition text-center"
              >
                Analytics →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
