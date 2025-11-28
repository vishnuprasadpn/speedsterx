# Manager Role Implementation

## Overview
A secondary admin role (`MANAGER`) has been created with the same admin privileges as `ADMIN`, except for managing other admin accounts.

## Roles

### ADMIN (Primary Admin)
- Full access to all admin features
- Can manage users (create, edit, delete admins and managers)
- Can access User Management page
- All product, category, order, and page management capabilities

### MANAGER (Secondary Admin)
- Full access to admin features EXCEPT:
  - Cannot access User Management page (`/admin/users`)
  - Cannot create, edit, or delete admin/manager accounts
- Can manage:
  - Products (CRUD, images)
  - Categories (CRUD)
  - Orders (view, update status)
  - CMS Pages (CRUD)
  - Dashboard access

## Default Credentials

### Primary Admin
- Email: `vishnuprasad1990@gmail.com`
- Password: `admin123`
- Role: `ADMIN`

### Manager (Secondary Admin)
- Email: `furyroadrcclub@gmail.com`
- Password: `admin123`
- Role: `MANAGER`

## Implementation Details

### Database Schema
- Added `MANAGER` to `UserRole` enum in Prisma schema

### Middleware
- Updated to allow both `ADMIN` and `MANAGER` roles for `/admin/*` routes

### Admin Layout
- User Management link only visible to `ADMIN` role
- All other admin navigation visible to both roles

### API Routes
- All admin API routes (products, categories, pages, images) allow both `ADMIN` and `MANAGER`
- User management API routes (`/api/admin/users/*`) only allow `ADMIN`

### Permission Utilities
- `lib/admin-permissions.ts` provides helper functions:
  - `isAdminOrManager(role)`: Check if user has admin access
  - `isPrimaryAdmin(role)`: Check if user is primary admin
  - `canManageAdmins(role)`: Check if user can manage other admins

## Security Features

1. **Role Protection**: Primary admin role cannot be changed or deleted
2. **Self-Protection**: Users cannot delete their own accounts
3. **Admin Protection**: Primary admins cannot be deleted
4. **Role Escalation Prevention**: Only existing admins can be set as admin

## Usage

### Creating a New Manager
Only primary admins can create managers through the User Management page at `/admin/users`.

### Resetting Passwords
Use the password reset script:
```bash
npm run db:reset-passwords
```

This resets all account passwords to `admin123`.

## Files Modified

1. `prisma/schema.prisma` - Added MANAGER role
2. `middleware.ts` - Updated to allow MANAGER role
3. `app/admin/layout.tsx` - Conditional User Management link
4. `app/admin/users/page.tsx` - User management page (ADMIN only)
5. `components/admin/users-list.tsx` - User list component
6. `app/api/admin/users/[id]/route.ts` - User management API (ADMIN only)
7. `lib/admin-permissions.ts` - Permission utility functions
8. All admin API routes - Updated to use `isAdminOrManager()`
9. `prisma/seed.ts` - Added manager user creation

