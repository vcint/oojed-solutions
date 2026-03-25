# Blog CMS Setup Guide

## Quick Start (5 minutes)

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com) → Sign Up
- Create a new project
- Wait 2 minutes for initialization
- Go to **Settings → API** and copy:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Add Environment Variables
Update `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Create Database Schema
- Go to Supabase Dashboard → **SQL Editor**
- Create a new query
- Copy and paste the entire content from `lib/database-schema.sql`
- Click **Run**
- Wait for success message

### 4. Test & Start Writing
- Restart your dev server: `npm run dev`
- Go to `http://localhost:3000/blog` → See public blog page
- Click **"Write a Blog Post"** button
- Click **"Register as Writer"** → Create account
- Fill in name, email, password
- **You must approve the writer before they can login!** (see "Admin Approval" section below)

## File Structure
```
app/
├── blog/                      # Public blog pages
│   ├── page.tsx              # Blog listing
│   └── [slug]/
│       └── page.tsx          # Individual blog post
├── admin/
│   ├── login/page.tsx        # Writer login
│   ├── register/page.tsx     # Writer registration
│   ├── dashboard/page.tsx    # Writer dashboard
│   ├── create-blog/page.tsx  # Create blog post
│   └── edit-blog/[id]/page.tsx # Edit blog post
└── api/
    ├── auth/
    │   ├── login/route.ts    # Login API
    │   └── register/route.ts # Register API
    └── blogs/
        ├── route.ts          # GET/POST blogs
        └── [id]/route.ts     # GET/PUT/DELETE specific blog
lib/
├── supabase.ts               # Supabase client
└── database-schema.sql       # Database setup (run in Supabase)
```

## Managing Writers (Admin Approval)

Since you're approving writers manually, you can do this via Supabase:

### To Approve a Writer:
1. Go to Supabase Dashboard → **SQL Editor**
2. Run this query (replace `writer@email.com` with actual email):
```sql
UPDATE authors 
SET is_approved = true, is_admin = false
WHERE email = 'writer@email.com';
```
3. Writer can now login and publish blogs

### To Make Someone an Admin:
```sql
UPDATE authors 
SET is_admin = true
WHERE email = 'admin@email.com';
```

### To View All Writers:
```sql
SELECT id, email, name, is_approved, is_admin, created_at FROM authors;
```

### To Deactivate a Writer:
```sql
UPDATE authors 
SET is_approved = false
WHERE email = 'writer@email.com';
```

## Features

### For Writers:
✅ Register with email & password
✅ Create & edit blog posts
✅ Save as draft or publish immediately
✅ Add featured image (via URL)
✅ Add categories & tags
✅ Full SEO optimization:
   - Meta title (60 chars)
   - Meta description (160 chars)
   - Keywords
✅ Reading time auto-calculated
✅ Track views per blog

### For Public:
✅ Browse all published blogs
✅ Filter by tags
✅ Read blog posts
✅ See author info
✅ SEO-optimized pages
✅ Social share ready (Open Graph meta tags)

## Using the Blog Editor

### Markdown & HTML Support
The blog content field supports HTML:

```html
<h2>Heading 2</h2>
<p>Regular paragraph</p>
<strong>Bold text</strong>
<a href="https://example.com">Link</a>
<ul>
  <li>List item 1</li>
  <li>List item 2</li>
</ul>
```

**Quick HTML Reference:**
- `<h2>...</h2>` - Subheading
- `<p>...</p>` - Paragraph
- `<strong>`, `<em>` - Bold, Italic
- `<a href="...">...</a>` - Links
- `<img src="..." alt="...">` - Images
- `<blockquote>...</blockquote>` - Quotes

**Tip:** For better editing, consider adding a rich text editor like **Quill.js** or **TipTap** in the future!

## Recommended Next Steps

1. **Add Rich Text Editor** (optional):
   ```bash
   npm install react-quill quill
   ```
   Then replace textarea in `create-blog` and `edit-blog` pages.

2. **Add Image Upload** (optional):
   - Use Supabase Storage instead of external URLs
   - Get signed URLs for secure access

3. **Add Author Bio/Avatar** (optional):
   - Create profile edit page
   - Store avatar in Supabase Storage

4. **Send Approval Emails** (optional):
   - Use Nodemailer (already installed!) to notify writers
   - Send admin notification when new writer registers

5. **Build Admin Dashboard**:
   - View all writers & approve/reject
   - View all blogs (published & drafts)
   - Publish/unpublish without being author
   - Delete inappropriate content

## Troubleshooting

**Q: Writers can't login**
- Check: Is `is_approved` set to `true` in database?
- Run: See "To Approve a Writer" section above

**Q: "Unauthorized" error when creating blog**
- Check: Is the writer logged in? (Should see session cookie)
- Check: Is `.env.local` properly set?

**Q: Blog not showing on public site**
- Check: Is blog `status` set to `published`?
- Check: Is `published_at` timestamp filled?

**Q: Images not showing**
- Check: Is the image URL publicly accessible?
- Try uploading to Imgur or similar, then use that URL

## Database Schema

### `authors` table
- `id` - UUID (auto)
- `email` - Writer's email
- `name` - Writer's name
- `bio` - Short bio
- `avatar_url` - Profile picture URL
- `password_hash` - Hashed password
- `is_approved` - Admin must set to true
- `is_admin` - Can manage other writers
- `created_at`, `updated_at` - Timestamps

### `blogs` table
- `id` - UUID (auto)
- `title` - Blog title
- `slug` - URL-friendly title
- `content` - HTML content
- `excerpt` - Short summary
- `featured_image_url` - Hero image
- `author_id` - FK to authors
- `category_id` - FK to blog_categories
- `tags` - Array of tags
- `status` - 'draft' or 'published'
- `seo_*` - SEO fields (title, description, keywords)
- `reading_time_minutes` - Auto-calculated
- `published_at` - Publication date
- `view_count` - Page views
- `created_at`, `updated_at` - Timestamps

### `blog_categories` table
- `id`, `name`, `slug`, `description`, `created_at`

### `blog_tags` table
- `id`, `name`, `slug`, `created_at`

## Security Notes

✅ **What's Secure:**
- Passwords are hashed with SHA-256
- Sessions stored in httpOnly cookies
- Author can only edit their own posts
- Published blogs are public, drafts are private
- SQL injection protected (using Supabase parameterized queries)

⚠️ **Not Yet Implemented:**
- Email verification (optional, you can add)
- Rate limiting (optional, you can add)
- Content moderation (optional, you can add)
- 2FA for writers (optional, you can add)

## Support

For Supabase issues: https://supabase.com/docs
For Next.js issues: https://nextjs.org/docs
For this project: Check the implementation in `/app` and `/lib` folders
