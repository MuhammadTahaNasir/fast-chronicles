# 🚀 Complete Free Deployment Guide for Filesystem Time Machine

## 📋 What You Need

### Accounts (All Free):
1. **GitHub** - [github.com](https://github.com)
2. **Vercel** - [vercel.com](https://vercel.com) 
3. **Railway** - [railway.app](https://railway.app)

### Required Files (Already Created):
- ✅ `backend/requirements.txt` - Python dependencies
- ✅ `backend/Procfile` - Railway deployment config
- ✅ `backend/runtime.txt` - Python version
- ✅ `frontend/vercel.json` - Vercel deployment config
- ✅ `.gitignore` - Git ignore rules
- ✅ `deploy.ps1` - Windows deployment script
- ✅ `deploy.sh` - Linux/Mac deployment script

## 🎯 Step-by-Step Deployment

### Step 1: Prepare Your Project

```powershell
# Navigate to your project
cd filesystem-time-machine

# Run the deployment script to install dependencies
.\deploy.ps1
```

### Step 2: Create GitHub Repository

1. **Go to [GitHub.com](https://github.com)**
2. **Click "New Repository"**
3. **Name it**: `filesystem-time-machine`
4. **Make it Public** (for free deployment)
5. **Don't initialize with README** (you already have one)

### Step 3: Push to GitHub

```powershell
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/filesystem-time-machine.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Deploy Backend to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Configure the service:**
   - **Name**: `filesystem-time-machine-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`

7. **Wait for deployment to complete**
8. **Copy your backend URL** (e.g., `https://your-app.railway.app`)

### Step 5: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. **Add Environment Variable:**
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.railway.app` (from Step 4)

7. **Click "Deploy"**
8. **Copy your frontend URL** (e.g., `https://your-app.vercel.app`)

### Step 6: Configure Backend CORS

1. **Go back to Railway Dashboard**
2. **Click on your backend project**
3. **Go to "Variables" tab**
4. **Add Environment Variable:**
   - **Name**: `CORS_ORIGINS`
   - **Value**: `https://your-frontend-url.vercel.app` (from Step 5)

5. **Redeploy the backend** (Railway will auto-redeploy)

### Step 7: Test Your Deployment

1. **Test Backend**: Visit `https://your-backend-url.railway.app/health`
   - Should return: `{"status": "ok"}`

2. **Test Frontend**: Visit your Vercel URL
   - Should load the Filesystem Time Machine interface

3. **Test Integration**: 
   - Open frontend
   - Try to start the file watcher
   - Check if it connects to backend

## 🔧 Alternative Free Platforms

### If Railway doesn't work:
- **Render**: [render.com](https://render.com) - Free tier available
- **Heroku**: [heroku.com](https://heroku.com) - Limited free tier

### If Vercel doesn't work:
- **Netlify**: [netlify.com](https://netlify.com) - Drag & drop `frontend/dist` folder
- **GitHub Pages**: Free static hosting

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Make sure `CORS_ORIGINS` includes your frontend URL exactly
   - No trailing slashes in URLs

2. **Build Failures**
   - Check that all dependencies are in `requirements.txt`
   - Verify Node.js version compatibility

3. **Port Issues**
   - Railway automatically sets `$PORT` environment variable
   - Don't hardcode port numbers

4. **Environment Variables**
   - Make sure they're set correctly in both platforms
   - Redeploy after changing environment variables

### Debug Commands:

```powershell
# Test backend locally
cd backend
uvicorn api.main:app --reload

# Test frontend locally
cd frontend
npm run dev

# Check if files are properly ignored
git status
```

## 📊 Monitoring Your Deployment

### Railway Dashboard:
- View logs in real-time
- Monitor resource usage
- Check deployment status

### Vercel Dashboard:
- View build logs
- Monitor performance
- Check deployment status

## 🎉 Success!

Once deployed, your Filesystem Time Machine will be:
- ✅ Accessible from anywhere in the world
- ✅ Free to host and maintain
- ✅ Automatically updated when you push to GitHub
- ✅ Scalable and reliable

## 📞 Need Help?

If you encounter issues:
1. Check the deployment logs in your platform dashboards
2. Verify all environment variables are set correctly
3. Test locally first with `npm run dev` and `uvicorn api.main:app --reload`
4. Check the detailed `DEPLOYMENT.md` file for more advanced options

---

**Happy Deploying! 🚀** 