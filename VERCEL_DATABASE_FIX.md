# Fix Database Connection Error on Vercel

## Problem
The error shows:
```
Can't reach database server at `aws-1-ap-southeast-1.pooler.supabase.com:5432`
```

This means Vercel is trying to use the **direct connection** (port 5432) instead of **connection pooling** (port 6543).

## Solution

### Step 1: Get Your Connection Pooling URL

Your connection pooling URL should be:
```
postgresql://postgres.gsdpmzophitglbgphbxm:Fury%402025@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Important points:**
- Port: `6543` (NOT 5432)
- Password: `Fury%402025` (URL-encoded `@` as `%40`)
- Parameter: `?pgbouncer=true` (required for connection pooling)

### Step 2: Update Vercel Environment Variable

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your project: `speedsterx`

2. **Go to Settings → Environment Variables**
   - Click "Settings" tab
   - Click "Environment Variables" in the left sidebar

3. **Update DATABASE_URL**
   - Find `DATABASE_URL` in the list
   - Click the three dots (⋯) → "Edit"
   - **Delete the old value completely**
   - **Paste the new value:**
     ```
     postgresql://postgres.gsdpmzophitglbgphbxm:Fury%402025@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - **Important:** Make sure:
     - No quotes around the URL
     - No extra spaces
     - Port is `6543`
     - Has `?pgbouncer=true` at the end
   - Select **all environments** (Production, Preview, Development)
   - Click "Save"

4. **Redeploy**
   - Go to "Deployments" tab
   - Find the latest deployment
   - Click three dots (⋯) → "Redeploy"
   - Or wait for auto-deploy (if enabled)

### Step 3: Verify

After redeploy, check:
- The site should load without database errors
- Admin dashboard should work
- No more `P1001` errors in logs

## Why This Happens

- **Port 5432**: Direct PostgreSQL connection (doesn't work with Vercel serverless)
- **Port 6543**: Supabase connection pooling (works with Vercel serverless)

Vercel's serverless functions need connection pooling because they create many short-lived connections.

## Alternative: Check Supabase Dashboard

If you're not sure about your connection string:
1. Go to Supabase Dashboard
2. Project Settings → Database
3. Look for "Connection Pooling" section
4. Copy the "Connection string" (should have port 6543)
5. Make sure password is URL-encoded (`@` → `%40`)

