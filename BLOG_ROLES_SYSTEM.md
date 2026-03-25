# Role-Based Blog System Setup

## 📋 Two User Roles

Your blog system now has two distinct roles with different permissions:

### 🖊️ **WRITER** (Regular Account)
- ✅ Register and login
- ✅ Create blog posts
- ✅ Save as draft
- ✅ Edit their own blogs
- ✅ **Submit for approval** (instead of publishing directly)
- ❌ Cannot approve other writer's blogs
- ❌ Cannot publish without admin approval

**Workflow:**
1. Writer creates blog post
2. Writer clicks "Publish / Submit for Approval"
3. Blog status → `pending_approval`
4. Submitted to admin review
5. Admin approves → Published ✓
6. Admin rejects → Rejected (can edit and resubmit)

### 👨‍💼 **ADMIN** (Admin Account)
- ✅ Create blog posts
- ✅ **Publish immediately** (no approval needed)
- ✅ Review pending writer blogs
- ✅ **Approve** writer submissions → Published
- ✅ **Reject** writer submissions with notes
- ✅ Edit any blog post
- ✅ Delete any blog post
- ✅ See all blogs (draft, pending, published, rejected)

**Workflow:**
1. Admin creates blog post
2. Admin clicks "Publish / Submit for Approval"
3. Blog status → `published` (immediate!)
4. Appears on public blog page
5. Admin can also review writer submissions dashboard

---

## 🚀 Setting Up Users

### Create a Writer
```sql
-- 1. Register via /admin/register (or insert manually)
INSERT INTO authors (email, name, password_hash, role, is_approved)
VALUES (
  'writer@example.com',
  'Sarah Writer',
  'hashed_password_here',
  'writer',  -- Set role to 'writer'
  true       -- Approve immediately
);
```

### Create an Admin
```sql
-- Only existing admins can create new admins via SQL
INSERT INTO authors (email, name, password_hash, role, is_approved)
VALUES (
  'admin@example.com',
  'Admin User',
  'hashed_password_here',
  'admin',   -- Set role to 'admin'
  true
);
```

### Promote Writer to Admin
```sql
UPDATE authors 
SET role = 'admin' 
WHERE email = 'writer@example.com';
```

### Demote Admin to Writer
```sql
UPDATE authors 
SET role = 'writer' 
WHERE email = 'admin@example.com';
```

---

## 📊 Blog Status Flow

### Writer's Blog Journey
```
[Create] → Draft 
         → Submit for Approval → Pending Approval 
                               → Approved by Admin → Published ✓
                               → Rejected → Edit & Resubmit
```

### Admin's Blog Journey
```
[Create] → Published ✓ (immediately)
```

---

## 🎯 Dashboard Features

### Writer Dashboard (`/admin/dashboard`)
- ✅ See only their own blogs
- ✅ Create new blog
- ✅ Edit their drafts
- ✅ View pending blogs status
- ❌ Cannot see "Review Pending Blogs" button
- ❌ Cannot approve/reject other blogs

### Admin Dashboard (`/admin/dashboard`)
- ✅ See only their own blogs
- ✅ Create new blog (instant publish)
- ✅ Edit their blogs
- ✅ **"Review Pending Blogs" button** (special admin section)
- ✅ Approve/reject writer submissions
- ✅ Leave notes on rejections

---

## 🔍 Approval Page (`/admin/approve-blogs`)

**Only accessible to admins!**

Shows all pending blog submissions with:
- Blog title & excerpt
- Author name
- Submission date
- Preview button
- **Approve** button (publish immediately)
- **Reject** button (with optional notes field)

When rejected, writer can:
- See rejection notes
- Edit the blog
- Resubmit for approval

---

## 🗄️ Database Schema Updates

### Authors Table
```sql
-- BEFORE (was)
is_admin BOOLEAN

-- AFTER (now)
role VARCHAR(20)  -- 'writer' or 'admin'
is_approved BOOLEAN  -- Admin approval status
```

### Blogs Table
```sql
-- NEW FIELDS
status VARCHAR(20)           -- 'draft', 'pending_approval', 'published', 'rejected'
submitted_at TIMESTAMP       -- When writer submitted for approval
reviewed_at TIMESTAMP        -- When admin reviewed
reviewed_by UUID             -- Which admin reviewed
reviewer_notes TEXT          -- Reason for rejection
```

---

## 📝 API Endpoints

### Role-Based Behavior

**POST `/api/blogs` (Create Blog)**
```
Writer: status='published' → becomes 'pending_approval'
Admin:  status='published' → becomes 'published'
```

**GET `/api/blogs?status=pending_approval`**
```
Writer: 403 Forbidden
Admin:  Returns all pending blogs
```

**POST `/api/blogs/[id]/approve`**
```
Writer: 403 Forbidden
Admin:  {
  action: 'approve' | 'reject',
  notes?: 'Optional rejection reason'
}
```

---

## 🧪 Testing the System

### Test as Writer:
1. Go to `/admin/register`
2. Register with email `writer@example.com`
3. In Supabase, approve: `UPDATE authors SET is_approved=true WHERE email='writer@example.com'`
4. Login to `/admin/login`
5. Create blog → click "Publish / Submit for Approval"
6. See blog in "pending_approval" status in dashboard
7. Cannot see "Review Pending Blogs" button

### Test as Admin:
1. Go to `/admin/login`
2. Create blog → click "Publish / Submit for Approval"
3. Blog appears as published immediately
4. Can see "Review Pending Blogs" button
5. Click it → see pending writer blogs
6. Click "Approve" → blog goes live
7. Click "Reject" → writer gets rejection notes

---

## 📋 SQL Queries for Admin

### View All Authors and Roles
```sql
SELECT email, name, role, is_approved, created_at 
FROM authors 
ORDER BY created_at DESC;
```

### View Pending Blogs (Admin Review)
```sql
SELECT id, title, author_id, submitted_at 
FROM blogs 
WHERE status = 'pending_approval' 
ORDER BY submitted_at ASC;
```

### View Published Blogs
```sql
SELECT title, author_id, published_at, view_count 
FROM blogs 
WHERE status = 'published' 
ORDER BY published_at DESC;
```

### View Rejected Blogs
```sql
SELECT b.title, a.name, b.reviewer_notes, b.reviewed_at 
FROM blogs b 
LEFT JOIN authors a ON b.reviewed_by = a.id 
WHERE b.status = 'rejected' 
ORDER BY b.reviewed_at DESC;
```

### Count by Status
```sql
SELECT status, COUNT(*) as count 
FROM blogs 
GROUP BY status 
ORDER BY count DESC;
```

---

## 🔒 Permission Matrix

| Action | Writer | Admin |
|--------|--------|-------|
| Create Blog Draft | ✅ | ✅ |
| Submit Blog for Approval | ✅ | N/A |
| Publish Blog Immediately | ❌ | ✅ |
| Edit Own Blog | ✅ | ✅ |
| Delete Own Blog | ✅ | ✅ |
| See Pending Blogs Dashboard | ❌ | ✅ |
| Approve Blog | ❌ | ✅ |
| Reject Blog | ❌ | ✅ |
| View All Blogs | ❌ | ✅* |
| Edit Other's Blog | ❌ | ❌** |
| View Admin Dashboard | ✅ | ✅ |

*Admins see only their own blogs, but can access pending/rejected/published lists for review
**Not implemented - each user edits only their own blogs for now

---

## 🚨 Important Notes

### Promoting First Admin
The first admin must be created manually via SQL since there's no admin to approve them:

```sql
INSERT INTO authors (email, name, password_hash, role, is_approved)
VALUES (
  'first.admin@company.com',
  'First Admin',
  sha256_hash_of_password,
  'admin',
  true
);
```

### Default Role
All new registrations are created as `writer` role by default.
Only existing admins can promote someone to admin via SQL.

### No Downtime
Role changes take effect on next login.
Current sessions use cached role from JWT cookie.

---

## 🎓 User Communication

### Email to New Writers:
```
Welcome! Your account is pending admin approval.
Once approved, you can:
1. Login at yoursite.com/admin/login
2. Create blog posts
3. Submit them for admin approval
4. Get feedback from the admin team

You'll receive updates when your blogs are approved or need changes.
```

### Email to Admins:
```
You have admin access! You can:
1. Create and publish blogs immediately
2. Review pending blog submissions
3. Approve or reject with feedback
4. Manage other writers

Check your dashboard at: yoursite.com/admin/dashboard
Review pending blogs at: yoursite.com/admin/approve-blogs
```

---

## 📞 Migration from Old System

If upgrading from the previous system:

```sql
-- Convert is_admin to role
UPDATE authors 
SET role = 'admin' 
WHERE is_admin = true;

UPDATE authors 
SET role = 'writer' 
WHERE is_admin = false OR is_admin IS NULL;

-- Update all published blogs
UPDATE blogs 
SET status = 'published' 
WHERE status = 'published';

-- Mark all drafts as draft (no change needed)
-- All new fields default to NULL which is fine for historical data
```

---

## ✅ Deployment Checklist

- [ ] Update database schema (run the updated SQL)
- [ ] Deploy code changes
- [ ] Promote your user to admin role
- [ ] Test as writer (create → submit → approve)
- [ ] Test as admin (create → auto-publish)
- [ ] Test rejection flow with feedback
- [ ] Train team on new workflow
- [ ] Communicate role structure to writers

---

**Your role-based blog system is ready! 🚀**
