'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Blog {
  id: string;
  title: string;
  content: string;
  featured_image_url?: string;
  category: { name: string; slug: string };
  author: { name: string; bio: string; avatar_url: string };
  tags: string[];
  reading_time_minutes: number;
  published_at: string;
  view_count: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      // Try fetching by slug first
      const slugResponse = await fetch(`/api/blogs/slug?slug=${slug}`);
      
      if (slugResponse.ok) {
        const data = await slugResponse.json();
        setBlog(data);
        return;
      }

      // Fallback: try fetching by ID
      const idResponse = await fetch(`/api/blogs/${slug}`);
      if (idResponse.ok) {
        const data = await idResponse.json();
        setBlog(data);
        return;
      }

      setError('Blog not found');
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      setError('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Blog Not Found</h1>
          <p className="text-xl text-slate-400 mb-8">{error}</p>
          <Link
            href="/blog"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* SEO Meta Tags */}
      <head>
        <title>{blog.seo_title || blog.title}</title>
        <meta name="description" content={blog.seo_description || blog.content.substring(0, 160)} />
        <meta name="keywords" content={blog.seo_keywords || ''} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.seo_description || ''} />
        {blog.featured_image_url && (
          <meta property="og:image" content={blog.featured_image_url} />
        )}
      </head>

      {/* Hero Section */}
      {blog.featured_image_url && (
        <div className="relative h-96 w-full overflow-hidden">
          <Image
            src={blog.featured_image_url}
            alt={blog.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        </div>
      )}

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-20">
        {/* Header */}
        <header className="mb-12">
          {blog.category && (
            <div className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-full mb-4">
              {blog.category.name}
            </div>
          )}
          <h1 className="text-5xl font-bold text-white mb-6">{blog.title}</h1>
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-slate-400 border-t border-b border-slate-700 py-6">
            <div className="flex items-center gap-4">
              {blog.author.avatar_url && (
                <Image
                  src={blog.author.avatar_url}
                  alt={blog.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-semibold text-white">{blog.author.name}</p>
                {blog.author.bio && (
                  <p className="text-sm text-slate-400">{blog.author.bio}</p>
                )}
              </div>
            </div>
            <div className="text-sm">
              <p className="text-slate-400">
                {new Date(blog.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="text-sm">
              <p className="text-slate-400">
                {blog.reading_time_minutes} min read
              </p>
            </div>
            <div className="text-sm">
              <p className="text-slate-400">
                {blog.view_count} views
              </p>
            </div>
          </div>
        </header>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-12 flex flex-wrap gap-3">
            {blog.tags.map(tag => (
              <Link
                key={tag}
                href={`/blog?tags=${tag}`}
                className="inline-block bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm hover:bg-blue-600 hover:text-white transition"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-invert max-w-none mb-12">
          <div
            className="text-slate-300 text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-center mb-12">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to go solar?
          </h3>
          <p className="text-blue-100 mb-6">
            Contact us today to learn how solar energy can save you money
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Get in Touch
          </Link>
        </div>

        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-block text-blue-400 hover:text-blue-300 transition"
        >
          ← Back to All Blogs
        </Link>
      </article>
    </div>
  );
}
