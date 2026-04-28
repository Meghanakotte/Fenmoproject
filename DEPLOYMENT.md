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

5. Pricing Plan: **Free**

6. Click **"Create Web Service"**

### Step 3: Copy Backend URL

Wait for the deployment to finish. You'll get a URL like:
`https://fenmo-backend.onrender.com`

**Your API URL will be**: `https://fenmo-backend.onrender.com/api`

---

## 🌐 **FRONTEND DEPLOYMENT (Vercel)**

### Step 1: Import Project
1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Select your repository: **Fenmoproject**

### Step 2: Configure Frontend
1. **Root Directory**: Select `./frontend`
2. **Framework Preset**: `Vite`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### Step 3: Environment Variables
Add:
`VITE_API_URL` = `https://fenmo-backend.onrender.com/api`

### Step 4: Deploy
Click **"Deploy"**.

---

## ✅ **VERIFICATION**
1. Open your Vercel URL.
2. Add an expense and verify it appears in the list.

**Note**: On Render's free tier, the backend may take a minute to "wake up" after inactivity.
