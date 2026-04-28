# Fenmo Deployment Guide

## 🚀 Quick Deployment Summary

This guide walks through deploying Fenmo to production using:
- **Backend**: Railway.app (excellent for Node.js + SQLite)
- **Frontend**: Vercel (best for React/Vite)

Total time: ~10 minutes | Cost: Free tier available

---

## 📝 Prerequisites

1. **GitHub Repository**: https://github.com/Meghanakotte/Fenmoproject (Already set up ✅)
2. **Railway Account**: https://railway.app/ (Sign up with GitHub)
3. **Vercel Account**: https://vercel.com/ (Sign up with GitHub)

---

## 🔧 **BACKEND DEPLOYMENT (Railway.app)**

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Login" → "Sign up with GitHub"
3. Authorize Railway to access your GitHub account

### Step 2: Create Backend Project

1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select repository: **Fenmoproject**
3. Click **"Deploy Now"**
4. Once the project is created, click on the service to configure it:
   - **Settings** → **Root Directory**: Set to `backend`
   - **Settings** → **Build Command**: `npm install`
   - **Settings** → **Start Command**: `npm start`

### Step 3: Configure Environment Variables

Click the **"Variables"** tab and add:
```
PORT=5000
NODE_ENV=production
```

### Step 4: Generate Domain

1. Go to **"Settings"** → **"Public Networking"**
2. Click **"Generate Domain"**
3. You'll get a URL like: `https://fenmoproject-production.up.railway.app`

### Step 5: Copy Backend URL

```
Backend API URL: https://your-railway-url.up.railway.app/api
```

---

## 🌐 **FRONTEND DEPLOYMENT (Vercel)**

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Click "Sign up with GitHub"
3. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Select your repository: **Fenmoproject**
3. Vercel will auto-detect it's a Monorepo

### Step 3: Configure Frontend

1. **Root Directory**: Select `./frontend`
2. **Framework Preset**: `Vite`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### Step 4: Environment Variables

Click **"Environment Variables"** and add:

```
VITE_API_URL = https://your-railway-url.up.railway.app/api
```

### Step 5: Deploy

Click **"Deploy"**

- Vercel will build your frontend
- Takes ~1-2 minutes
- You'll get a URL like: `https://fenmoproject.vercel.app`

---

## ✅ **VERIFICATION**

1. Open your Vercel URL.
2. Add an expense.
3. Verify it appears in the list.
4. Refresh the page to ensure persistence.

---

## 💾 **DATABASE PERSISTENCE**

Railway uses an ephemeral filesystem by default. For long-term persistence with SQLite on Railway:
1. Go to **"Settings"** → **"Volumes"**
2. Click **"Add Volume"**
3. Mount it to `/app/backend/db` (or where your `expenses.db` is located)

Alternatively, upgrade to **Railway's PostgreSQL** for a more robust production experience.

---

**✅ Your Fenmo application is now production-ready! 🎉**
