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

interface Stats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  pendingBlogs: number;
  totalAuthors: number;
  approvedAuthors: number;
  adminCount: number;
  writerCount: number;
  totalCategories: number;
  recentBlogs: Array<{
    title: string;
    status: string;
    author: string;
    category: string;
    published_at: string | null;
  }>;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Load stats on mount
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Total Blogs</h3>
            <p className="text-3xl font-bold text-blue-400">{stats?.totalBlogs || 0}</p>
            <p className="text-slate-400 text-sm mt-2">
              {stats?.publishedBlogs || 0} published, {stats?.draftBlogs || 0} drafts
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Published Blogs</h3>
            <p className="text-3xl font-bold text-green-400">{stats?.publishedBlogs || 0}</p>
            <p className="text-slate-400 text-sm mt-2">
              {stats?.totalBlogs ? Math.round((stats.publishedBlogs / stats.totalBlogs) * 100) : 0}% of total
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Pending Approval</h3>
            <p className="text-3xl font-bold text-orange-400">{stats?.pendingBlogs || 0}</p>
            <p className="text-slate-400 text-sm mt-2">
              Awaiting review
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Total Authors</h3>
            <p className="text-3xl font-bold text-purple-400">{stats?.totalAuthors || 0}</p>
            <p className="text-slate-400 text-sm mt-2">
              {stats?.approvedAuthors || 0} approved, {stats?.adminCount || 0} admins
            </p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Categories</h3>
            <p className="text-3xl font-bold text-cyan-400">{stats?.totalCategories || 0}</p>
            <p className="text-slate-400 text-sm mt-2">Content categories</p>
          </div>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Writers</h3>
            <p className="text-3xl font-bold text-yellow-400">{stats?.writerCount || 0}</p>
            <p className="text-slate-400 text-sm mt-2">Content creators</p>
          </div>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Admins</h3>
            <p className="text-3xl font-bold text-red-400">{stats?.adminCount || 0}</p>
            <p className="text-slate-400 text-sm mt-2">System administrators</p>
          </div>
        </div>

        {/* Content Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Content Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Published</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${stats?.totalBlogs ? (stats.publishedBlogs / stats.totalBlogs) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-green-400 font-semibold w-8 text-right">{stats?.publishedBlogs || 0}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Drafts</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${stats?.totalBlogs ? (stats.draftBlogs / stats.totalBlogs) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-yellow-400 font-semibold w-8 text-right">{stats?.draftBlogs || 0}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Pending</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${stats?.totalBlogs ? (stats.pendingBlogs / stats.totalBlogs) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-orange-400 font-semibold w-8 text-right">{stats?.pendingBlogs || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Author Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Approved</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${stats?.totalAuthors ? (stats.approvedAuthors / stats.totalAuthors) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-green-400 font-semibold w-8 text-right">{stats?.approvedAuthors || 0}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Pending</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${stats?.totalAuthors ? ((stats.totalAuthors - stats.approvedAuthors) / stats.totalAuthors) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-red-400 font-semibold w-8 text-right">{(stats?.totalAuthors || 0) - (stats?.approvedAuthors || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Recent Blog Activity</h3>
          {stats?.recentBlogs && stats.recentBlogs.length > 0 ? (
            <div className="space-y-3">
              {stats.recentBlogs.map((blog, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-700 rounded">
                  <div>
                    <h4 className="text-white font-semibold">{blog.title}</h4>
                    <p className="text-slate-400 text-sm">
                      By {blog.author} • {blog.category} • {blog.status}
                    </p>
                  </div>
                  <div className="text-right">
                    {blog.published_at && (
                      <p className="text-slate-400 text-sm">
                        {new Date(blog.published_at).toLocaleDateString()}
                      </p>
                    )}
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      blog.status === 'published' ? 'bg-green-500/20 text-green-300' :
                      blog.status === 'draft' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-orange-500/20 text-orange-300'
                    }`}>
                      {blog.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No recent blog activity</p>
          )}
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <p className="text-slate-400 mb-6">
            Common administrative tasks and shortcuts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/approve-blogs"
              className="block bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-semibold text-center transition"
            >
              Review Pending Blogs ({stats?.pendingBlogs || 0})
            </Link>
            <Link
              href="/admin/user-management"
              className="block bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-semibold text-center transition"
            >
              Manage Users ({stats?.totalAuthors || 0})
            </Link>
            <Link
              href="/admin/category-management"
              className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold text-center transition"
            >
              Manage Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}