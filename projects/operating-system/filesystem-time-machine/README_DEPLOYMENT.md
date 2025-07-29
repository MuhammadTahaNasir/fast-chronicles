# 🚀 Quick Deployment Summary

## 📋 Required Files (Already Created ✅)
- `backend/requirements.txt` - Python dependencies
- `backend/Procfile` - Railway deployment config  
- `backend/runtime.txt` - Python version
- `frontend/vercel.json` - Vercel deployment config
- `.gitignore` - Git ignore rules
- `deploy.ps1` - Windows deployment script

## 🎯 Quick Steps

### 1. Prepare Project
```powershell
cd filesystem-time-machine
.\deploy.ps1
```

### 2. GitHub Setup
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/filesystem-time-machine.git
git push -u origin main
```

### 3. Deploy Backend (Railway)
- Go to [railway.app](https://railway.app)
- Connect GitHub repo
- Root Directory: `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`

### 4. Deploy Frontend (Vercel)
- Go to [vercel.com](https://vercel.com)
- Import GitHub repo
- Root Directory: `frontend`
- Framework: Vite
- Add env var: `VITE_API_BASE_URL=https://your-backend-url.railway.app`

### 5. Configure CORS
- In Railway, add env var: `CORS_ORIGINS=https://your-frontend-url.vercel.app`

## 🔗 Your URLs
- **Backend**: `https://your-app.railway.app`
- **Frontend**: `https://your-app.vercel.app`

## 📖 Full Guide
See `COMPLETE_DEPLOYMENT_GUIDE.md` for detailed instructions. 