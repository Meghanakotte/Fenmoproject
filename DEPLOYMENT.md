# Fenmo Deployment Guide

## 🚀 Quick Deployment Summary

This guide walks through deploying Fenmo to production using:
- **Backend**: Render.com (free tier available)
- **Frontend**: Vercel (free tier available)

Total time: ~15 minutes | Cost: Free

---

## 📝 Prerequisites

1. **GitHub Repository**: https://github.com/Meghanakotte/Fenmoproject (Already set up ✅)
2. **Render Account**: https://render.com/ (Sign up with GitHub)
3. **Vercel Account**: https://vercel.com/ (Sign up with GitHub)

---

## 🔧 **BACKEND DEPLOYMENT (Render.com)**

### Step 1: Create Render Account
1. Go to https://render.com
2. Click "Sign up with GitHub"
3. Authorize Render to access your GitHub account
4. Complete onboarding

### Step 2: Create Backend Service

1. Click **"New +"** → **"Web Service"**
2. Select repository: **Fenmoproject**
3. Configure settings:
   - **Name**: `fenmo-backend`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. Environment Variables:
   ```
   PORT=5000
   NODE_ENV=production
   ```

5. Pricing Plan: **Free** (or Starter $7/month for better uptime)

6. Click **"Create Web Service"**

### Step 3: Wait for Deployment

- Render will automatically pull from GitHub
- Deploy takes ~2-3 minutes
- You'll get a URL like: `https://fenmo-backend.render.com`

### Step 4: Copy Backend URL

```
Backend API URL: https://fenmo-backend.render.com/api
```

**Note**: Save this URL - you'll need it for frontend!

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
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `dist` (auto-detected)

### Step 4: Environment Variables

Click **"Environment Variables"** and add:

```
VITE_API_URL = https://fenmo-backend.render.com/api
```

(Replace `fenmo-backend.render.com` with your actual Render backend URL)

### Step 5: Deploy

Click **"Deploy"**

- Vercel will build your frontend
- Takes ~1-2 minutes
- You'll get a URL like: `https://fenmo-frontend.vercel.app`

---

## ✅ **VERIFICATION**

### Test Backend API

```bash
curl https://fenmo-backend.render.com/api/expenses
# Should return: { "expenses": [] }
```

### Test Frontend

1. Open: `https://fenmo-frontend.vercel.app`
2. Should load successfully
3. Form should work and create expenses
4. Expenses should save and display

---

## 🔗 **UPDATING ENVIRONMENT AFTER DEPLOYMENT**

### When Backend URL is Ready

Update frontend environment:

1. In **Vercel Dashboard** → **Project Settings** → **Environment Variables**
2. Update `VITE_API_URL` with actual backend URL
3. Redeploy frontend

### Render Backend URL

Render generates URL in format:
```
https://{service-name}.render.com
```

You can customize it to:
```
https://fenmo-backend.onrender.com
```

---

## 📊 **DEPLOYMENT CHECKLIST**

- [ ] Render account created
- [ ] Backend service created on Render
- [ ] Backend URL copied (e.g., `https://fenmo-backend.render.com`)
- [ ] Vercel account created
- [ ] Frontend imported to Vercel
- [ ] Environment variables set with backend URL
- [ ] Frontend deployed
- [ ] Backend API tested
- [ ] Frontend loaded and tested
- [ ] Create expense from UI
- [ ] Verify expense appears in list

---

## 🐛 **TROUBLESHOOTING**

### Frontend Shows "Error: Failed to fetch expenses"

**Solution**: 
1. Check backend URL in environment variables
2. Verify backend is running: `curl https://fenmo-backend.render.com/api/expenses`
3. Check browser console for CORS errors
4. Redeploy frontend with correct URL

### Backend Returns 503 Service Unavailable

**Solution**:
1. Wait a few minutes (Render sometimes needs time to spin up)
2. Restart service from Render dashboard
3. Check logs in **Render Dashboard** → **Logs**

### Database Not Persisting

**Solution**:
- Render restarts containers periodically
- Database is recreated from scratch
- This is normal for free tier
- Data persists within a deployment cycle

---

## 💾 **DATABASE PERSISTENCE**

For production database persistence, consider:
- **PostgreSQL on Render** (Free option)
- **MongoDB Atlas** (Free tier available)
- **Neon** (PostgreSQL, free tier)

To upgrade:
1. Update database connection in `backend/db/database.js`
2. Redeploy backend
3. Data persists across restarts

---

## 🔄 **CONTINUOUS DEPLOYMENT**

Both Render and Vercel automatically:
- Watch your GitHub repository
- Redeploy on every push to `main` branch
- Show deploy logs and history
- Rollback if needed

**Example workflow**:
```bash
git add .
git commit -m "fix: Update expense filtering"
git push origin main
# → Automatically deploys to both backend and frontend!
```

---

## 📈 **PRODUCTION MONITORING**

### Render Dashboard
- View logs
- Monitor resource usage
- Check deployment history
- Restart services

### Vercel Dashboard
- View logs
- Check build times
- Monitor performance
- Analytics

---

## 🚀 **PRODUCTION URLs** (Update After Deployment)

Once deployed, update these URLs:

```markdown
## Deployed Application

- **Frontend**: https://fenmo-frontend.vercel.app
- **Backend API**: https://fenmo-backend.render.com/api
- **GitHub Repository**: https://github.com/Meghanakotte/Fenmoproject
```

---

## 📞 **SUPPORT**

- **Render Support**: https://render.com/support
- **Vercel Support**: https://vercel.com/support
- **GitHub Issues**: Create issues in repository

---

**✅ Your Fenmo application is now production-ready! 🎉**
