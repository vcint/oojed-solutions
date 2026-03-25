'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  status: string;
  submitted_at: string;
  author: { name: string };
}

export default function ApproveBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approvalLoading, setApprovalLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPendingBlogs();
  }, []);

  const fetchPendingBlogs = async () => {
    try {
      const response = await fetch('/api/blogs?status=pending_approval');
      if (!response.ok) {
        if (response.status === 403) {
          setError('You do not have permission to approve blogs (admin only)');
          router.push('/admin/dashboard');
          return;
        }
        throw new Error('Failed to fetch pending blogs');
      }
      const data = await response.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load pending blogs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (blogId: string, action: 'approve' | 'reject', notes?: string) => {
    setApprovalLoading(prev => ({ ...prev, [blogId]: true }));

    try {
      const response = await fetch(`/api/blogs/${blogId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || `Failed to ${action} blog`);
        return;
      }

      // Remove from list
      setBlogs(blogs.filter(b => b.id !== blogId));
      alert(`Blog ${action}d successfully!`);
    } catch (err) {
      alert('Failed to process approval');
      console.error(err);
    } finally {
      setApprovalLoading(prev => ({ ...prev, [blogId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading pending blogs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 py-8 pb-8 border-b border-slate-700 mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Review Pending Blogs</h1>
        <div className="flex gap-4 items-center">
          <Link
            href="/admin/dashboard"
            className="text-slate-400 hover:text-white transition px-4 py-2 rounded hover:bg-slate-700"
          >
            Dashboard
          </Link>
          <span className="text-blue-400 font-semibold">
            {blogs.length} Pending
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold text-white mb-4">All Caught Up!</h2>
            <p className="text-slate-400 mb-8">
              No pending blogs to review.
            </p>
            <Link
              href="/admin/dashboard"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.map(blog => (
              <div
                key={blog.id}
                className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500 transition"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-slate-400 mb-3">
                        By <span className="font-semibold">{blog.author?.name}</span>
                        {' • '}
                        Submitted{' '}
                        {new Date(blog.submitted_at).toLocaleDateString()}
                      </p>
                      <p className="text-slate-300 line-clamp-2">
                        {blog.excerpt}
                      </p>
                    </div>
                    <span className="ml-4 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-semibold whitespace-nowrap">
                      Pending
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-slate-700">
                    <Link
                      href={`/blog/${blog.id}`}
                      className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-center transition"
                    >
                      Preview
                    </Link>
                    <button
                      onClick={() => handleApproval(blog.id, 'approve')}
                      disabled={approvalLoading[blog.id]}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded font-semibold transition"
                    >
                      {approvalLoading[blog.id] ? 'Approving...' : '✓ Approve'}
                    </button>
                    <button
                      onClick={() => {
                        const notes = prompt('Rejection reason (optional):');
                        handleApproval(blog.id, 'reject', notes || undefined);
                      }}
                      disabled={approvalLoading[blog.id]}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded font-semibold transition"
                    >
                      {approvalLoading[blog.id] ? 'Rejecting...' : '✗ Reject'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
