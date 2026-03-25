'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featured_image_url?: string;
  category: { name: string; slug: string };
  author: { name: string };
  tags: string[];
  reading_time_minutes: number;
  published_at: string;
  view_count: number;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const allTags = new Set<string>();

  useEffect(() => {
    fetchBlogs();
  }, [selectedTag]);

  const fetchBlogs = async () => {
    try {
      const url = new URL('/api/blogs', window.location.origin);
      url.searchParams.append('status', 'published');
      if (selectedTag) {
        url.searchParams.append('tags', selectedTag);
      }

      const response = await fetch(url);
      const data = await response.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  blogs.forEach(blog => blog.tags?.forEach(tag => allTags.add(tag)));

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-2xl">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-primary-foreground mb-4">Blog</h1>
          <p className="text-xl text-primary-foreground/90">
            Expert insights on solar energy and renewable solutions
          </p>
          <div className="mt-8">
            <Link
              href="/admin/dashboard"
              className="inline-block bg-background text-primary px-6 py-3 rounded-lg font-semibold hover:bg-background/90 transition"
            >
              Write a Blog Post
            </Link>
          </div>
        </div>
      </section>

      {/* Tags Filter */}
      {allTags.size > 0 && (
        <section className="py-8 px-4 bg-card border-b border-border">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">FILTER BY TAG</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-4 py-2 rounded-full transition ${
                  !selectedTag
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                All
              </button>
              {Array.from(allTags).map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full transition ${
                    selectedTag === tag
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blogs Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-muted-foreground">No blogs published yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map(blog => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group bg-card rounded-lg overflow-hidden hover:bg-card/80 transition border border-border"
                >
                  {blog.featured_image_url && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={blog.featured_image_url}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {blog.category && (
                      <div className="inline-block bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full mb-3">
                        {blog.category.name}
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition">
                      {blog.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{blog.reading_time_minutes} min read</span>
                      <span>{blog.view_count} views</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{blog.author?.name}</span>
                      <span className="text-muted-foreground">
                        {new Date(blog.published_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
