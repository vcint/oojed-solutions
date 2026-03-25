# Blog System - Quick Start Checklist

## ✅ Setup (5-10 minutes)

### Step 1: Create Supabase Account
- [ ] Go to https://supabase.com
- [ ] Sign up or log in
- [ ] Click "New Project"
- [ ] Name it "oojed-blog" or similar
- [ ] Wait 2-3 minutes for creation

### Step 2: Get API Keys
In your Supabase dashboard:
- [ ] Click "Settings" (bottom left) → "API"
- [ ] Copy **Project URL** (starts with `https://`)
- [ ] Copy **anon public** key (long string starting with `eyJ`)
- [ ] Copy **service_role** key (even longer string)

### Step 3: Save Environment Variables
Update `.env.local` in your project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

### Step 4: Create Database Tables
- [ ] Go to your Supabase dashboard → **SQL Editor** (left sidebar)
- [ ] Click "New Query"
- [ ] Open: `lib/database-schema.sql` (in your project)
- [ ] Copy ALL the SQL code
- [ ] Paste into Supabase SQL editor
- [ ] Click **Run** (top right)
- [ ] Wait for success message ✓

### Step 5: Restart Dev Server
```bash
npm run dev
```

---

## ✅ Testing (2 minutes)

### Test Public Blog
- [ ] Go to `http://localhost:3000/blog`
- [ ] Should see "Blog" page with empty message
- [ ] Click "Write a Blog Post" button
- [ ] Should redirect to Register page

### Test Writer Registration
- [ ] Go to `http://localhost:3000/admin/register`
- [ ] Fill in:
  - Name: "Test Writer"
  - Email: "test@example.com"
  - Password: "TestPass123"
  - Confirm: "TestPass123"
- [ ] Click "Register"
- [ ] Should see success message: "Registration successful! Your account is pending admin approval."
- [ ] ✅ Registration working!

### Step 6: Approve the Writer (YOU DO THIS)
- [ ] Go to Supabase Dashboard → **SQL Editor**
- [ ] Click "New Query"
- [ ] Copy and paste this:
```sql
UPDATE authors 
SET is_approved = true
WHERE email = 'test@example.com';
```
- [ ] Click **Run**
- [ ] You should see "1 rows affected"

### Test Writer Login
- [ ] Go to `http://localhost:3000/admin/login`
- [ ] Login with:
  - Email: "test@example.com"
  - Password: "TestPass123"
- [ ] Click "Login"
- [ ] Should redirect to Dashboard
- [ ] ✅ Login working!

### Test Create Blog Post
- [ ] Click "+ Create New Blog Post"
- [ ] Fill in:
  - Title: "My First Solar Blog"
  - Content: "This is my first blog post about solar energy!"
  - Featured Image: Leave blank for now
  - Tags: "solar, energy"
- [ ] Click "Save as Draft"
- [ ] Should redirect to Dashboard
- [ ] Should see blog in the list with "draft" status

### Test Publish Blog
- [ ] Click "Edit" on your blog
- [ ] Make a change (add more content)
- [ ] Click "Publish Now"
- [ ] ✅ Blog published!

### Test Public View
- [ ] Go to `http://localhost:3000/blog`
- [ ] Should see your blog post in the grid!
- [ ] Click on it
- [ ] Should show full blog content
- [ ] ✅ Everything working!

---

## 📝 For Each New Writer

When someone wants to write blogs:

### They Do:
1. Go to `http://yoursite.com/admin/register`
2. Create account with email & password
3. Wait for your approval

### You Do:
1. Get notified (set this up with email notifications later)
2. Approve them by running SQL in Supabase:
```sql
UPDATE authors 
SET is_approved = true
WHERE email = 'writer@email.com';
```

### They Can Now:
1. Login at `http://yoursite.com/admin/login`
2. Create, edit, and publish blogs
3. Add SEO tags, featured images, etc.

---

## 📋 Useful SQL Queries

### View All Writers
```sql
SELECT id, email, name, is_approved, created_at FROM authors;
```

### Approve a Writer
```sql
UPDATE authors SET is_approved = true WHERE email = 'writer@email.com';
```

### View All Blogs (Draft + Published)
```sql
SELECT id, title, status, author_id, created_at FROM blogs;
```

### View Only Published Blogs
```sql
SELECT id, title, published_at, view_count FROM blogs WHERE status = 'published' ORDER BY published_at DESC;
```

### Delete a Blog
```sql
DELETE FROM blogs WHERE id = 'blog-id-here';
```

### Reset Everything (Clean Database)
```sql
DELETE FROM blogs;
DELETE FROM authors;
DELETE FROM blog_categories;
DELETE FROM blog_tags;
```

---

## 🚀 Deployment Checklist

When ready to go live:

### Before Deploying:
- [ ] Test all features locally
- [ ] Create 2-3 sample blogs
- [ ] Test on mobile device
- [ ] Test login/register

### On Vercel:
- [ ] Connect your GitHub repo to Vercel
- [ ] Add Environment Variables in Vercel settings:
  ```
  NEXT_PUBLIC_SUPABASE_URL=xxx
  NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
  SUPABASE_SERVICE_ROLE_KEY=xxx
  ```
- [ ] Deploy
- [ ] Test at https://yoursite.vercel.app/blog

### Update Navigation:
- ✅ Already added "Blog" link to navigation menu

---

## 📚 File Structure

Your blog system files:

```
app/
├── blog/                    # Public blog pages
│   ├── page.tsx            # Blog listing
│   └── [slug]/page.tsx     # Individual post
├── admin/
│   ├── login/page.tsx      # Writer login
│   ├── register/page.tsx   # Writer signup
│   ├── dashboard/page.tsx  # Writer dashboard
│   ├── create-blog/page.tsx # Create blog
│   └── edit-blog/[id]/page.tsx # Edit blog
└── api/
    ├── auth/
    │   ├── login/route.ts
    │   ├── register/route.ts
    │   └── logout/route.ts
    └── blogs/
        ├── route.ts         # GET all, POST new
        ├── [id]/route.ts    # GET/PUT/DELETE by ID
        └── slug/route.ts    # GET by slug

lib/
├── supabase.ts             # Supabase client
└── database-schema.sql     # Run this in Supabase!
```

---

## ❓ Troubleshooting

### Q: Writers can't login
**A:** Make sure `is_approved = true` in database. Run:
```sql
UPDATE authors SET is_approved = true WHERE email = 'writer@email.com';
```

### Q: Blog doesn't show on public site
**A:** Make sure status is `published`. Check:
```sql
SELECT id, title, status FROM blogs;
```

### Q: "Unauthorized" error when creating blog
**A:** 
- Check `.env.local` is set correctly
- Restart dev server: `npm run dev`
- Make sure writer is logged in (check cookies)

### Q: Images not showing
**A:** Use full URLs like `https://imgur.com/xxxxx.jpg`
Don't use relative paths.

### Q: Email notifications not working yet
**A:** That's optional - we'll add it later. For now, just check your database manually.

---

## 🎨 Customization Ideas (Optional)

- [ ] Add rich text editor (Quill.js) instead of HTML
- [ ] Add image upload instead of URL-only
- [ ] Send email when writer is approved
- [ ] Create admin dashboard to approve writers
- [ ] Add comments to blog posts
- [ ] Add "Share on Social" buttons
- [ ] Add newsletter signup
- [ ] Add blog search

---

## 💬 Need Help?

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **SQLite Help:** Search "SQL UPDATE" or "SQL SELECT"
- **Project Files:** Check README.md and /app folder

You now have a fully functional blog system! 🎉
