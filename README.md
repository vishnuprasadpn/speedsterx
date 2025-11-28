# SpeedsterX - RC Car E-Commerce Platform

A production-ready e-commerce platform for selling RC cars and related products, built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

- 🛍️ **Full Storefront**: Product catalog, categories, filters, and product detail pages
- 🛒 **Shopping Cart**: Persistent cart for logged-in users
- 💳 **Payment Integration**: Razorpay integration for INR payments
- 👤 **User Authentication**: Secure login/register with NextAuth
- 📦 **Order Management**: Complete order lifecycle management
- 🎛️ **Admin Panel**: Full CRUD for products, categories, orders, and pages
- 📊 **Dashboard**: Business metrics, sales reports, and analytics
- 📱 **Responsive Design**: Mobile-first, modern UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Payments**: Razorpay
- **Charts**: Recharts

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Razorpay account (for payments)

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/speedsterx?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Razorpay
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"

# App
NODE_ENV="development"
```

Generate a secure NextAuth secret:
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (or use migrations)
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Accounts

After seeding, you can login with:

**Admin:**
- Email: `vishnuprasad1990@gmail.com`
- Password: `admin123`

**Customer:**
- Email: `customer@example.com`
- Password: `customer123`

## Project Structure

```
SpeedsterX/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin panel pages
│   ├── account/           # User account pages
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart
│   ├── category/          # Category pages
│   ├── product/           # Product pages
│   └── shop/              # Shop listing
├── components/            # React components
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/                # Prisma schema and migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── types/                 # TypeScript type definitions
```

## Key Features Implementation

### Authentication
- NextAuth with credentials provider
- Role-based access control (CUSTOMER, ADMIN)
- Protected routes with middleware

### Products
- Full CRUD operations
- Category management
- Image upload support
- Stock management
- RC-specific fields (scale, type, motor, battery, terrain)

### Shopping Cart
- Persistent cart for logged-in users
- Quantity management
- Price snapshots

### Orders
- Order creation and management
- Status tracking (PENDING, PAID, SHIPPED, COMPLETED, CANCELLED, REFUNDED)
- Payment integration ready

### Admin Panel
- Dashboard with KPIs
- Product management
- Category management
- Order management
- CMS pages

## Next Steps

1. **Razorpay Integration**: Implement checkout flow and webhook handling
2. **Image Upload**: Add file upload functionality for product images
3. **Email Notifications**: Send order confirmations and updates
4. **Search**: Add full-text search for products
5. **Reviews**: Product reviews and ratings
6. **Wishlist**: User wishlist functionality
7. **Coupons**: Discount codes and promotions

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## License

MIT

