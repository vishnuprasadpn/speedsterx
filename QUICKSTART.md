# Quick Start Guide

## Initial Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file with:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/speedsterx?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   RAZORPAY_KEY_ID="your-key-id"
   RAZORPAY_KEY_SECRET="your-key-secret"
   NODE_ENV="development"
   ```

3. **Set up database:**
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Default Login Credentials

**Admin Account:**
- Email: `vishnuprasad1990@gmail.com`
- Password: `admin123`

**Customer Account:**
- Email: `customer@example.com`
- Password: `customer123`

## What's Included

✅ Complete Next.js 15 setup with App Router
✅ TypeScript configuration
✅ Tailwind CSS styling
✅ Prisma ORM with PostgreSQL schema
✅ NextAuth authentication with role-based access
✅ Product catalog with filters
✅ Shopping cart functionality
✅ Admin dashboard with KPIs
✅ User account management
✅ Responsive navigation and layout
✅ Sample data seed script

## Next Steps for Full Implementation

1. **Razorpay Integration:**
   - Implement checkout API route
   - Add Razorpay webhook handler
   - Create payment confirmation flow

2. **Image Upload:**
   - Add file upload functionality
   - Integrate with cloud storage (AWS S3, Cloudinary, etc.)

3. **Order Management:**
   - Complete order creation flow
   - Add order status updates
   - Email notifications

4. **Admin Features:**
   - Product CRUD forms
   - Category management UI
   - Order management interface
   - CMS page editor

5. **Additional Features:**
   - Product search
   - User reviews
   - Wishlist
   - Coupon codes
   - Email notifications

## Project Structure

- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable React components
- `lib/` - Utility functions and configurations
- `prisma/` - Database schema and migrations
- `types/` - TypeScript type definitions

## Development Tips

- Use `npm run db:studio` to view/edit database in Prisma Studio
- Check `README.md` for detailed documentation
- All admin routes are protected with role-based middleware
- Cart is persistent for logged-in users only (can be extended for guest carts)

