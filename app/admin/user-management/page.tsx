'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Author {
  id: string;
  email: string;
  name: string;
  role: string;
  is_approved: boolean;
  created_at: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function UserManagementPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
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
        router.push('/admin/login');
      }
    } catch (e) {
      router.push('/admin/login');
    }
  }, [router]);

  // Load authors on mount
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAuthors();
    }
  }, [user]);

  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/authors');
      const data = await response.json();
      setAuthors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
      setError('Failed to load authors');
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

  const updateAuthor = async (authorId: string, updates: Partial<Author>) => {
    try {
      const response = await fetch(`/api/authors/${authorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Update failed');
      setAuthors(prev => prev.map(a => a.id === authorId ? { ...a, ...updates } : a));
    } catch (e) {
      alert('Failed to update author');
      console.error(e);
    }
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
          <h1 className="text-3xl font-bold text-white">User Management</h1>
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
        {/* Authors List */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 bg-slate-700">
            <h3 className="text-lg font-semibold text-white">All Users</h3>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-6">
              {error}
            </div>
          )}

          {authors.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 text-xl">No users found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {authors.map(author => (
                <div
                  key={author.id}
                  className="px-6 py-4 hover:bg-slate-700/50 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-semibold">{author.name}</h4>
                      <p className="text-slate-400 text-sm">{author.email}</p>
                      <p className="text-slate-500 text-xs">
                        Role: {author.role} | Status: {author.is_approved ? 'Approved' : 'Pending'} | Joined: {new Date(author.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {!author.is_approved && (
                        <button
                          onClick={() => updateAuthor(author.id, { is_approved: true })}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition"
                        >
                          Approve
                        </button>
                      )}
                      {author.is_approved && author.role === 'writer' && (
                        <button
                          onClick={() => updateAuthor(author.id, { role: 'admin' })}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition"
                        >
                          Make Admin
                        </button>
                      )}
                      {author.role === 'admin' && author.email !== user.email && (
                        <button
                          onClick={() => updateAuthor(author.id, { role: 'writer' })}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition"
                        >
                          Demote to Writer
                        </button>
                      )}
                      {author.email !== user.email && (
                        <button
                          onClick={() => {
                            if (confirm('Delete this user? This will also delete their blogs.')) {
                              // Implement delete
                            }
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}