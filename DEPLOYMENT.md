# Deployment Guide

## Why Netlify Doesn't Work

**Netlify doesn't support Python/FastAPI backends.** It's designed for static sites and serverless functions (Node.js/JavaScript). Your app needs a Python runtime, so you need a different platform.

## Recommended: Render (Free Tier Available)

### Steps:

1. **Go to [render.com](https://render.com)** and sign up/login (free account)

2. **Click "New +" → "Web Service"**

3. **Connect GitHub:**
   - Click "Connect account" if needed
   - Select repository: `mangospy/AI`

4. **Configure the service:**
   - **Name**: `ai-gatekeeper` (or any name you like)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free (or paid if you want)

5. **Add Environment Variables:**
   - Click "Environment" tab
   - Add:
     - Key: `GEMINI_API_KEY` → Value: (your API key)
     - Key: `SECRETE_CODE` → Value: (your secret code)

6. **Click "Create Web Service"**

7. **Wait 5-10 minutes** for first deployment

8. **Your site will be live at:** `https://ai-gatekeeper.onrender.com` (or similar URL)

### Render Free Tier:
- ✅ Free forever
- ✅ Automatic deployments from GitHub
- ⚠️ Spins down after 15 min of inactivity (first request takes ~30 seconds)
- ⚠️ 750 hours/month free

---

## Alternative: Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository: `mangospy/AI`
4. Railway auto-detects Python
5. Add environment variables in "Variables" tab:
   - `GEMINI_API_KEY`
   - `SECRETE_CODE`
6. Deploy automatically starts

**Railway Free Tier:**
- $5 credit/month (usually enough for small apps)
- No spin-down delays

---

## Alternative: Fly.io

1. Install Fly CLI:
   ```powershell
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. Login:
   ```powershell
   fly auth login
   ```

3. Launch:
   ```powershell
   fly launch
   ```
   - Follow prompts
   - Add environment variables when asked

4. Deploy:
   ```powershell
   fly deploy
   ```

**Fly.io Free Tier:**
- 3 shared-cpu VMs
- 3GB persistent volumes
- 160GB outbound data transfer

---

## Quick Comparison

| Platform | Free Tier | Auto-Deploy | Spin-Down | Best For |
|----------|----------|-------------|-----------|----------|
| **Render** | ✅ Yes | ✅ Yes | ⚠️ Yes (15 min) | Simple deployments |
| **Railway** | ✅ $5 credit | ✅ Yes | ❌ No | Always-on apps |
| **Fly.io** | ✅ Yes | ⚠️ Manual | ❌ No | More control |

**Recommendation:** Start with **Render** - it's the easiest and works great for this app!

