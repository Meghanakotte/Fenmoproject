# RENDER BACKEND DEPLOYMENT - COMPLETE STEP-BY-STEP GUIDE

## WHAT WE'RE DEPLOYING
- **Service:** Backend Express.js API
- **Location in repo:** `backend/` folder
- **Port:** 5000
- **Database:** SQLite (stores to `expenses.db`)

## STEP 1: CREATE RENDER ACCOUNT
1. Go to: https://render.com
2. Click **"Sign up"** (top right)
3. Sign up with GitHub account (recommended - easier to connect repo)
4. Verify email

---

## STEP 2: CONNECT YOUR GITHUB REPOSITORY
1. After signing up, go to Dashboard: https://dashboard.render.com
2. Click **"New +"** button (top right)
3. Select **"Web Service"**
4. In "Connect Git Repository" section:
   - Click **"Connect Account"** (if not already connected to GitHub)
   - Select your GitHub account
   - Find and select **"Fenmoproject"** repository
   - Click **"Connect"**

---

## STEP 3: CONFIGURE THE WEB SERVICE

### Basic Settings:
| Setting | Value |
|---------|-------|
| **Name** | `fenmo-backend` |
| **Environment** | `Node` |
| **Region** | `Oregon` (or closest to you) |
| **Branch** | `main` |

### Build Settings:
| Setting | Value |
|---------|-------|
| **Root Directory** | Leave blank (we handle this in render.yaml) |
| **Build Command** | `bash render-build.sh` |
| **Start Command** | `cd backend && npm start` |

### Environment Variables:
Add these variables:
| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

**DO NOT add anything else** - The code will auto-detect these settings.

---

## STEP 4: CLICK DEPLOY

1. Scroll to bottom of the page
2. Click **"Create Web Service"** button
3. Render will now:
   - Clone your GitHub repository
   - Run `bash render-build.sh` (installs dependencies)
   - Run `cd backend && npm start` (starts the server)

**Wait for deployment to complete** (takes 2-5 minutes)

---

## STEP 5: VERIFY DEPLOYMENT SUCCESS

You'll see a **green "Live"** status when deployment succeeds.

### Test if backend is working:

1. Look for **"Your service is live at:"** message
2. Copy the URL (looks like: `https://fenmo-backend-xxxxx.render.com`)
3. Open in browser: `https://fenmo-backend-xxxxx.render.com/health`
4. You should see: `{"message":"Backend is running"}`

**✅ If you see this message = Backend is successfully deployed!**

---

## STEP 6: SAVE YOUR BACKEND URL

Copy your backend URL (e.g., `https://fenmo-backend-xxxxx.render.com`)

**You'll need this for frontend deployment!**

---

## TROUBLESHOOTING

### If deployment fails:

1. **Check the logs:**
   - Click your service on Render dashboard
   - Scroll down to see **"Logs"** section
   - Read the error message clearly

2. **Common errors and fixes:**

| Error | Fix |
|-------|-----|
| `Cannot find module 'express'` | The render-build.sh script is working - this means npm install ran. Check logs for next error. |
| `sh: render-build.sh: not found` | File wasn't committed to git. Run: `git add render-build.sh && git commit` |
| `ENOENT: no such file` | The render.yaml configuration has an error. We already fixed this - should not happen. |

3. **If stuck:**
   - Click **"Clear build cache & deploy"** button (top right of service page)
   - This forces a fresh rebuild
   - Check logs while it deploys

---

## WHAT'S HAPPENING BEHIND THE SCENES

```
Render Flow:
1. Clones your GitHub repo to root directory
2. Runs: bash render-build.sh
   └─> Changes directory to: cd backend
   └─> Runs: npm install
   └─> Installs: express, sql.js, uuid, body-parser, cors
3. Runs: cd backend && npm start
   └─> Starts Express server on port 5000
   └─> Creates expenses.db for data storage
4. Server is now live at: https://fenmo-backend-xxxxx.render.com
```

---

## WHAT FILES MAKE THIS WORK

Your GitHub repo has these files already set up:

1. **`backend/package.json`** - Lists all dependencies (express, sql.js, etc.)
2. **`backend/server.js`** - The Express application
3. **`render.yaml`** - Tells Render how to build and start (root directory)
4. **`render-build.sh`** - Shell script that runs installation (root directory)

**All files are already committed to GitHub ✓**

---

## AFTER BACKEND IS LIVE

Once your backend shows **"Live"** status:

1. ✅ Note the backend URL (e.g., `https://fenmo-backend-xxxxx.render.com`)
2. ✅ Test by visiting `https://fenmo-backend-xxxxx.render.com/health`
3. Keep this URL - you'll need it for frontend deployment next!

---

**Questions? Read the logs on Render dashboard - they show exactly what went wrong.**
