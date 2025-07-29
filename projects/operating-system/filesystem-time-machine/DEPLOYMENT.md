# 🚀 Filesystem Time Machine Deployment Guide

This guide provides a comprehensive, step-by-step process to deploy the Filesystem Time Machine project using free platforms (Vercel for frontend, Railway for backend). It includes prerequisites, deployment steps, alternative platforms, advanced configurations, troubleshooting, and optimization tips.

## 📋 Prerequisites

Before starting, ensure you have the following:

- **Accounts** (all free):
  - [GitHub](https://github.com) - For version control
  - [Vercel](https://vercel.com) - For frontend deployment
  - [Railway](https://railway.app) - For backend deployment
- **Tools**:
  - Git installed
  - Node.js and npm (for frontend)
  - Python 3.8+ (for backend)
- **Required Files** (already created in your project):
  - `backend/requirements.txt` - Python dependencies
  - `backend/Procfile` - Railway deployment configuration
  - `backend/runtime.txt` - Python version specification
  - `frontend/vercel.json` - Vercel deployment configuration
  - `.gitignore` - Git ignore rules
  - `deploy.ps1` - Windows deployment script
  - `deploy.sh` - Linux/Mac deployment script

## 🎯 Step-by-Step Deployment

### Step 1: Prepare Your Project

1. Navigate to your project directory:
   ```bash
   cd filesystem-time-machine
   ```
2. Run the deployment script to install dependencies:
   - On Windows:
     ```powershell
     .\deploy.ps1
     ```
   - On Linux/Mac:
     ```bash
     ./deploy.sh
     ```

### Step 2: Set Up GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in.
2. Click **New Repository**.
3. Name it `filesystem-time-machine` and make it **public** (required for free deployment).
4. Do **not** initialize with a README (your project already has one).
5. Initialize and push your local repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for deployment"
   git remote add origin https://github.com/YOUR_USERNAME/filesystem-time-machine.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app) and sign up with GitHub.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your `filesystem-time-machine` repository.
4. Configure the service:
   - **Name**: `filesystem-time-machine-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`
5. Deploy and wait for completion.
6. Copy the backend URL (e.g., `https://your-app.railway.app`).

### Step 4: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com) and sign up with GitHub.
2. Click **New Project** and import your `filesystem-time-machine` repository.
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.railway.app` (from Step 3)
5. Click **Deploy** and copy the frontend URL (e.g., `https://your-app.vercel.app`).

### Step 5: Configure Backend CORS

1. Go to the Railway Dashboard and select your backend project.
2. Navigate to the **Variables** tab.
3. Add environment variable:
   - **Name**: `CORS_ORIGINS`
   - **Value**: `https://your-frontend-url.vercel.app` (from Step 4)
4. Save and let Railway auto-redeploy the backend.

### Step 6: Test Your Deployment

1. **Test Backend**: Visit `https://your-backend-url.railway.app/health`. It should return:
   ```json
   {"status": "ok"}
   ```
2. **Test Frontend**: Visit your Vercel URL (`https://your-app.vercel.app`). The Filesystem Time Machine interface should load.
3. **Test Integration**: Open the frontend, start the file watcher, and verify it connects to the backend.

## 🔧 Alternative Free Platforms

If Vercel or Railway don’t work for you, consider these free alternatives:

### Frontend Alternatives
- **Netlify** ([netlify.com](https://netlify.com)):
  - Drag and drop the `frontend/dist` folder after running `npm run build`.
  - Or use Netlify CLI: `netlify deploy --prod --dir=dist`.
- **GitHub Pages**: Free static hosting through GitHub.
- **Firebase Hosting**: Google’s free hosting platform.

### Backend Alternatives
- **Render** ([render.com](https://render.com)): Free tier with similar setup to Railway.
- **Heroku** ([heroku.com](https://heroku.com)): Limited free tier available.
- **PythonAnywhere** ([pythonanywhere.com](https://pythonanywhere.com)): Free Python hosting.

## 🐳 Docker Deployment (Optional)

For containerized deployment, use Docker:

1. **Create Dockerfile** (in `backend/`):
   ```dockerfile
   FROM python:3.9-slim

   WORKDIR /app

   RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   EXPOSE 8000
   CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Build and Run**:
   ```bash
   cd backend
   docker build -t filesystem-time-machine-backend .
   docker run -d -p 8000:8000 --name fstm-backend -e CORS_ORIGINS=https://your-frontend-url.com filesystem-time-machine-backend
   ```

3. **Docker Compose** (recommended for local testing):
   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - CORS_ORIGINS=https://your-frontend-url.com
       volumes:
         - ./data:/app/data
   ```

## 🔒 Security and Production Configurations

### Environment Variables
Set these in production:
```bash
CORS_ORIGINS=https://your-frontend-url.com
DEBUG=False
SECRET_KEY=your-secret-key-here
```

### Backend CORS and Rate Limiting
Update `backend/api/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
import os

app = FastAPI(debug=os.getenv("DEBUG", "False").lower() == "true")
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### HTTPS
- Enable HTTPS on your domain through Vercel/Railway.
- Configure SSL certificates and secure headers.

## 📊 Monitoring and Logging

### Application Logging
Add to `backend/api/main.py`:
```python
import logging
from fastapi import Request
import time
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url} - {response.status_code} - {process_time:.2f}s")
    return response

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }
```

### Monitoring Dashboards
- **Railway**: View real-time logs, resource usage, and deployment status.
- **Vercel**: Monitor build logs, performance, and deployment status.

## 🔄 Continuous Deployment with GitHub Actions

Automate deployments with GitHub Actions:
```yaml
name: Deploy Filesystem Time Machine

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: cd frontend && npm install && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - run: pip install -r backend/requirements.txt
      - uses: railway/action@v1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
```

## 🚨 Troubleshooting

### Common Issues
1. **CORS Errors**:
   - Verify `CORS_ORIGINS` includes the exact frontend URL (no trailing slashes).
   - Test with: `curl -H "Origin: https://your-frontend.com" -X OPTIONS https://your-backend.com/health`.
2. **Build Failures**:
   - Ensure all dependencies are listed in `requirements.txt` and Node.js version is compatible.
   - Check build logs in Vercel/Railway dashboards.
3. **Port Issues**:
   - Railway sets `$PORT` automatically; avoid hardcoding ports.
   - Check port usage: `lsof -i :8000` and kill if needed: `kill -9 <PID>`.
4. **Environment Variables**:
   - Verify with: `echo $VITE_API_BASE_URL` and `echo $CORS_ORIGINS`.

### Debug Commands
```bash
# Test backend locally
cd backend
uvicorn api.main:app --reload

# Test frontend locally
cd frontend
npm run dev

# Check backend logs
docker logs fstm-backend

# Test API
curl https://your-backend.com/health

# Verify git status
git status
```

## 📈 Performance Optimization

- **Frontend**:
  - Enable gzip compression in Vercel.
  - Use a CDN for static assets.
  - Implement lazy loading and optimize bundle size.
- **Backend**:
  - Use async operations and caching.
  - Implement connection pooling and monitor memory usage.

## 📞 Support

If you encounter issues:
1. Check deployment logs in Vercel/Railway dashboards.
2. Verify environment variables and CORS settings.
3. Test locally: `npm run dev` (frontend) and `uvicorn api.main:app --reload` (backend).
4. Refer to platform documentation or GitHub issues for community support.

## 🎉 Success!

Once deployed, your Filesystem Time Machine will be:
- Accessible globally
- Free to host and maintain
- Automatically updated on GitHub pushes
- Scalable and reliable

**Happy Deploying! 🚀**