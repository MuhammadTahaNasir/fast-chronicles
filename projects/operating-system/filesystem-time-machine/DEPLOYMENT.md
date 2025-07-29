# 🚀 Deployment Guide

Complete guide to deploy Filesystem Time Machine to various platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- Git repository cloned
- Node.js and npm installed
- Python 3.8+ installed
- Account on deployment platform (Vercel, Railway, etc.)

## 🎯 Quick Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Frontend Deployment (Vercel)

1. **Prepare Frontend**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `VITE_API_BASE_URL=https://your-backend-url.com`

#### Backend Deployment (Railway)

1. **Prepare Backend**
   ```bash
   cd backend
   # Ensure requirements.txt exists
   ```

2. **Create Procfile**
   ```procfile
   web: uvicorn api.main:app --host 0.0.0.0 --port $PORT
   ```

3. **Deploy to Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize and deploy
   railway init
   railway up
   ```

4. **Configure Environment Variables**
   - Go to Railway Dashboard → Your Project → Variables
   - Add: `CORS_ORIGINS=https://your-frontend-url.com`

### Option 2: Netlify (Frontend) + Render (Backend)

#### Frontend Deployment (Netlify)

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop `dist` folder to Netlify
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Environment Variables**
   - Netlify Dashboard → Site Settings → Environment Variables
   - Add: `VITE_API_BASE_URL=https://your-backend-url.com`

#### Backend Deployment (Render)

1. **Connect Repository**
   - Go to Render Dashboard
   - Click "New Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: filesystem-time-machine-backend
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables**
   - Add: `CORS_ORIGINS=https://your-frontend-url.com`

### Option 3: Docker Deployment

#### Create Dockerfile

```dockerfile
# Backend Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Start the application
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Deploy with Docker

1. **Build Image**
   ```bash
   cd backend
   docker build -t filesystem-time-machine-backend .
   ```

2. **Run Container**
   ```bash
   docker run -d -p 8000:8000 --name fstm-backend filesystem-time-machine-backend
   ```

3. **Docker Compose (Recommended)**
   ```yaml
   # docker-compose.yml
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

## 🔧 Production Configuration

### Frontend Production Build

1. **Update API Base URL**
   ```javascript
   // frontend/src/config.js
   export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
   ```

2. **Build for Production**
   ```bash
   cd frontend
   npm run build
   ```

3. **Test Production Build**
   ```bash
   npm run preview
   ```

### Backend Production Settings

1. **Create Production Config**
   ```python
   # backend/config.py
   import os
   
   class Settings:
       CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
       DEBUG = os.getenv("DEBUG", "False").lower() == "true"
       PORT = int(os.getenv("PORT", 8000))
   ```

2. **Update Main App**
   ```python
   # backend/api/main.py
   from fastapi import FastAPI
   from fastapi.middleware.cors import CORSMiddleware
   from config import Settings
   
   settings = Settings()
   
   app = FastAPI(debug=settings.DEBUG)
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=settings.CORS_ORIGINS,
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

## 🔒 Security Considerations

### Environment Variables
```bash
# Required for production
CORS_ORIGINS=https://your-frontend-domain.com
DEBUG=False
SECRET_KEY=your-secret-key-here
```

### HTTPS Configuration
- Enable HTTPS on your domain
- Configure SSL certificates
- Use secure headers

### Rate Limiting
```python
# Add to backend
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
```

## 📊 Monitoring & Logging

### Application Logging
```python
# backend/logging.py
import logging
from fastapi import Request
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url} - {response.status_code} - {process_time:.2f}s")
    return response
```

### Health Check Endpoint
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0"
    }
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations (if any)
- [ ] SSL certificates ready
- [ ] Domain configured

### Frontend Checklist
- [ ] Production build successful
- [ ] API base URL updated
- [ ] Environment variables set
- [ ] Static assets optimized
- [ ] Error handling implemented

### Backend Checklist
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Logging configured
- [ ] Health check endpoint working

### Post-Deployment
- [ ] Application accessible
- [ ] API endpoints responding
- [ ] File watching working
- [ ] Snapshots functional
- [ ] Error monitoring active

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```bash
   # Check CORS configuration
   curl -H "Origin: https://your-frontend.com" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS https://your-backend.com/health
   ```

2. **Port Issues**
   ```bash
   # Check if port is in use
   lsof -i :8000
   # Kill process if needed
   kill -9 <PID>
   ```

3. **Environment Variables**
   ```bash
   # Verify environment variables
   echo $VITE_API_BASE_URL
   echo $CORS_ORIGINS
   ```

### Debug Commands

```bash
# Check backend logs
docker logs fstm-backend

# Check frontend build
npm run build --debug

# Test API endpoints
curl https://your-backend.com/health

# Monitor file system
watch -n 1 "ls -la /path/to/watch"
```

## 📈 Performance Optimization

### Frontend Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize bundle size

### Backend Optimization
- Enable async operations
- Implement caching
- Use connection pooling
- Monitor memory usage

## 🔄 Continuous Deployment

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy

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
      - run: cd frontend && npm install
      - run: cd frontend && npm run build
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

## 📞 Support

If you encounter issues during deployment:

1. **Check Logs**: Review application and deployment logs
2. **Verify Configuration**: Ensure all environment variables are set
3. **Test Locally**: Verify the application works in development
4. **Platform Documentation**: Refer to platform-specific guides
5. **Community Support**: Check GitHub issues and discussions

---

**Happy Deploying! 🚀** 