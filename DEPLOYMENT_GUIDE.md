# Deployment Guide - SpeedsterX

## ✅ Step 1: Database Tables Created
Database tables have been successfully created in your Supabase database.

## 🚀 Step 2: Deploy to Vercel

### 2.1: Import Repository
1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Click "Import Git Repository"
4. Select: `vishnuprasadpn/speedsterx`
5. Click "Import"

### 2.2: Configure Project
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (since tables are already created)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 2.3: Set Environment Variables

Add these 3 environment variables in Vercel:

**1. DATABASE_URL**
- Key: `DATABASE_URL`
- Value: `postgresql://postgres.gsdpmzophitglbgphbxm:Fury%402025@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`
- Environment: Production, Preview, Development
- ⚠️ **Note**: Password is URL encoded (`Fury%402025` = `Fury@2025`)

**2. NEXTAUTH_URL**
- Key: `NEXTAUTH_URL`
- Value: `https://speedsterx.vercel.app` (or your preferred name)
- Environment: Production, Preview, Development
- ⚠️ **Note**: After deployment, update this with your actual Vercel URL

**3. NEXTAUTH_SECRET**
- Key: `NEXTAUTH_SECRET`
- Value: `B6IXBuyTie+MTTxhAzrVoDBUGNp3FvzR0HbZd6iD5Og=`
- Environment: Production, Preview, Development

### 2.4: Deploy
1. Click "Deploy" button
2. Wait 2-5 minutes for build to complete
3. Your app will be live!

### 2.5: Update NEXTAUTH_URL
After deployment:
1. Copy your actual Vercel URL (e.g., `https://speedsterx-xyz123.vercel.app`)
2. Go to Settings → Environment Variables
3. Edit `NEXTAUTH_URL`
4. Update to your actual URL
5. Save (auto-redeploys)

## 📋 Environment Variables Summary

```
DATABASE_URL=postgresql://postgres.gsdpmzophitglbgphbxm:Fury%402025@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
NEXTAUTH_URL=https://your-actual-vercel-url.vercel.app
NEXTAUTH_SECRET=B6IXBuyTie+MTTxhAzrVoDBUGNp3FvzR0HbZd6iD5Og=
```

## ✅ Verification Checklist

After deployment:
- [ ] Visit your live URL
- [ ] Homepage loads correctly
- [ ] Test login: `vishnuprasad1990@gmail.com` / `admin123`
- [ ] Test admin panel: `/admin`
- [ ] Test shop page: `/shop`
- [ ] Verify database connection works

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Vercel
- Verify all environment variables are set
- Ensure DATABASE_URL has URL-encoded password

### Auth Not Working
- Verify NEXTAUTH_URL matches your actual Vercel domain
- Check NEXTAUTH_SECRET is set
- Clear browser cookies

### Database Connection Error
- Verify DATABASE_URL is correct
- Check password is URL encoded (`Fury%402025`)
- Ensure database is accessible

## 🎉 You're Done!

Your app should now be live on Vercel!

