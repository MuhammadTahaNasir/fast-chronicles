# 🚀 Quick Free Deployment Guide

## 📋 Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free)

## 🎯 Step-by-Step Deployment

### Step 1: GitHub Repository Setup

```bash
# Navigate to your project directory
cd filesystem-time-machine

# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for deployment"

# Create new repository on GitHub.com
# Then link your local repo:
git remote add origin https://github.com/YOUR_USERNAME/filesystem-time-machine.git
git branch -M main
git push -u origin main
```

### Step 2: Backend Deployment (Railway - Free)

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your repository**
5. **Configure the service:**
   - **Name**: `filesystem-time-machine-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`

6. **Add Environment Variables:**
   - Go to your project → Variables
   - Add: `CORS_ORIGINS=https://your-frontend-url.vercel.app`

7. **Deploy and get your backend URL**

### Step 3: Frontend Deployment (Vercel - Free)

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_BASE_URL=https://your-backend-url.railway.app`

7. **Deploy**

### Step 4: Update Frontend API Configuration

After getting your backend URL, update the frontend to use it:

```javascript
// In your frontend code, replace localhost URLs with your backend URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://your-backend-url.railway.app';
```

### Step 5: Test Your Deployment

1. **Test Backend**: Visit `https://your-backend-url.railway.app/health`
2. **Test Frontend**: Visit your Vercel URL
3. **Test Integration**: Use the frontend to connect to backend

## 🔧 Alternative Free Platforms

### Frontend Alternatives:
- **Netlify**: Drag & drop `frontend/dist` folder
- **GitHub Pages**: Free static hosting
- **Firebase Hosting**: Google's free hosting

### Backend Alternatives:
- **Render**: Free tier available
- **Heroku**: Free tier (limited)
- **PythonAnywhere**: Free Python hosting

## 🚨 Common Issues & Solutions

### CORS Errors
- Ensure `CORS_ORIGINS` environment variable includes your frontend URL
- Check that URLs don't have trailing slashes

### Build Failures
- Check that all dependencies are in `requirements.txt`
- Verify Node.js version compatibility

### Port Issues
- Railway/Render automatically sets `$PORT` environment variable
- Don't hardcode port numbers

## 📞 Support

If you encounter issues:
1. Check deployment logs in your platform dashboard
2. Verify environment variables are set correctly
3. Test locally first with `npm run dev` and `uvicorn api.main:app --reload`

## 🎉 Success!

Once deployed, your Filesystem Time Machine will be accessible from anywhere in the world! 