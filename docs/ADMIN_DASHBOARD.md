# Admin Dashboard

## Overview

A comprehensive admin dashboard for managing tools on your site. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🧱 Layout Structure
- **Sidebar Navigation** (persistent and responsive)
  - All Tools
  - Add New Tool
  - Pending Submissions (placeholder)
  - Settings (placeholder)
- **Main Panel** with search, filtering, and pagination
- **Mobile-responsive** with collapsible sidebar

### 📊 All Tools Page (`/admin/tools`)
- Search bar to filter tools by name, description, or tags
- Paginated grid view (12 items per page)
- Each tool displays:
  - Title and description
  - Tags (with overflow handling)
  - Last updated date
  - Quick edit button
  - External link to tool website

### ✏️ Edit Tool Page (`/admin/tools/[toolId]/edit`)
- Pre-filled form with all existing tool data
- Organized in tabs/sections:
  - Basic Info (title, description, website URL)
  - Features (add/remove/edit features)
  - Tags (add/remove tags)
- Real-time change detection
- Save/delete actions with confirmation
- Success/error notifications

### ➕ Add New Tool Page (`/admin/tools/new`)
- Clean form for adding new tools
- Required field validation
- Optional features and tags
- Redirects to edit page after creation

## 🔐 Authentication

Uses secure password-based authentication with bcrypt hashing. Admin password is configured via environment variables.

**Environment Setup**: Set your admin password in `.env.local`:
```bash
ADMIN_PASSWORD=your_bcrypt_hashed_password_here
JWT_SECRET=your_jwt_secret_key_here
```

**⚠️ Important**: Use strong passwords and keep JWT secrets secure in production.

## 🎨 Design

- Matches your site's existing dark theme
- Consistent design language with proper spacing
- Smooth transitions and hover effects
- Loading states and error handling
- Mobile-optimized layout

## 🔧 API Integration

- Full CRUD operations via existing API routes
- Optimistic updates with TanStack Query
- Error handling with user-friendly messages
- Automatic cache invalidation

## 📱 Responsive Features

- Desktop: Fixed sidebar navigation
- Mobile: Collapsible sheet navigation
- Adaptive grid layouts
- Touch-friendly interface

## 🚀 Getting Started

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/admin` (redirects to `/admin/tools`)

3. Enter your configured admin password to access the dashboard

## 🛠️ Development Notes

- Built with TypeScript for type safety
- Uses TanStack Query for state management
- Tailwind CSS for styling
- shadcn/ui components
- Fully responsive design
- Accessible interface

## 🔮 Future Enhancements

- Real authentication system
- Role-based permissions
- Bulk operations
- Advanced filtering
- Analytics dashboard
- Tool approval workflow
- Export/import functionality

## File Structure

```
src/app/admin/
├── layout.tsx          # Admin layout with sidebar
├── page.tsx            # Redirects to /tools
└── tools/
    ├── page.tsx        # All tools listing
    ├── new/
    │   └── page.tsx    # Add new tool form
    └── [toolId]/
        └── edit/
            └── page.tsx # Edit tool form

src/components/
└── AdminGuard.tsx      # Authentication wrapper
```
