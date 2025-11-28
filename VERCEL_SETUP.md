# Vercel Deployment Checklist

## Step 1: Import Repository
- Go to https://vercel.com/new
- Click "Import Git Repository"
- Select: `vishnuprasadpn/speedsterx`
- Click "Import"

## Step 2: Configure Project Settings
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

## Step 3: Set Environment Variables

Click "Environment Variables" and add these:

### Required Variables:

1. **DATABASE_URL**
   - Value: Your production PostgreSQL connection string
   - Example: `postgresql://user:password@host:5432/database?schema=public`
   - ⚠️ **IMPORTANT**: You need a production database (see Database Setup below)

2. **NEXTAUTH_URL**
   - Value: `https://your-app-name.vercel.app`
   - ⚠️ **IMPORTANT**: After first deployment, Vercel will give you a URL. Update this with your actual URL.

3. **NEXTAUTH_SECRET**
   - Value: `B6IXBuyTie+MTTxhAzrVoDBUGNp3FvzR0HbZd6iD5Og=`
   - (Generated secure secret)

### Environment Variable Setup:
- Add all three variables
- Make sure they're set for **Production**, **Preview**, and **Development** environments
- Click "Save" after adding each one

## Step 4: Database Setup (IMPORTANT!)

You need a production PostgreSQL database. Choose one:

### Option A: Railway (Easiest - Recommended)
1. Go to https://railway.app
2. Sign up/login
3. Click "New Project"
4. Click "Add PostgreSQL"
5. Once created, click on PostgreSQL service
6. Go to "Variables" tab
7. Copy the `DATABASE_URL` value
8. Use this in Vercel environment variables

### Option B: Supabase (Free Tier)
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy the connection string (use "Connection pooling" for serverless)
5. Use this in Vercel environment variables

### Option C: Neon (Serverless PostgreSQL)
1. Go to https://neon.tech
2. Create new project
3. Copy the connection string
4. Use this in Vercel environment variables

## Step 5: Deploy

1. Click "Deploy" button
2. Wait for build to complete (2-5 minutes)
3. Your app will be live at: `https://your-app-name.vercel.app`

## Step 6: Post-Deployment Setup

### 1. Update NEXTAUTH_URL
After deployment, Vercel will give you a URL like:
`https://speedsterx-xyz123.vercel.app`

Update the `NEXTAUTH_URL` environment variable in Vercel:
1. Go to Project Settings → Environment Variables
2. Edit `NEXTAUTH_URL`
3. Set it to your actual Vercel URL
4. Redeploy (or it will auto-update)

### 2. Run Database Migrations

You need to push your Prisma schema to the production database:

**Option A: Via Vercel Build Command (Recommended)**
Add this to your `package.json` scripts:
```json
"postinstall": "prisma generate",
"vercel-build": "prisma generate && prisma db push && next build"
```

Then update Vercel build command to: `npm run vercel-build`

**Option B: Run Manually**
1. Install Vercel CLI: `npm i -g vercel` (or use `npx vercel`)
2. Run: `npx prisma db push --schema=./prisma/schema.prisma`
3. Set `DATABASE_URL` in your local terminal first

### 3. Seed Database (Optional)
If you want to add initial data:
```bash
DATABASE_URL="your_production_url" npm run db:seed
```

## Step 7: Verify Deployment

1. ✅ Visit your live URL
2. ✅ Test homepage loads
3. ✅ Test login functionality
4. ✅ Test admin panel (if logged in)
5. ✅ Check database connection

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `DATABASE_URL` is correct

### Database Connection Error
- Verify `DATABASE_URL` format is correct
- Check database allows connections from Vercel IPs
- For Railway/Supabase: Use connection pooling URL if available

### Auth Not Working
- Verify `NEXTAUTH_URL` matches your Vercel domain exactly
- Check `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again

### Images Not Loading
- Check Next.js image configuration
- Verify image URLs are accessible
- Check `next.config.ts` remote patterns

## Quick Reference

**Your Generated NEXTAUTH_SECRET:**
```
B6IXBuyTie+MTTxhAzrVoDBUGNp3FvzR0HbZd6iD5Og=
```

**Environment Variables Needed:**
- `DATABASE_URL` - Production PostgreSQL URL
- `NEXTAUTH_URL` - Your Vercel app URL
- `NEXTAUTH_SECRET` - The secret above

**After First Deployment:**
1. Copy your Vercel URL
2. Update `NEXTAUTH_URL` in Vercel dashboard
3. Redeploy or wait for auto-deploy

