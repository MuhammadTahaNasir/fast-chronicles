# PowerShell Deployment Script for Filesystem Time Machine

Write-Host "Starting Filesystem Time Machine Deployment..." -ForegroundColor Green

# Step 1: Install Frontend Dependencies
Write-Host "Step 1: Installing Frontend Dependencies" -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend dependencies installation failed" -ForegroundColor Red
    exit 1
}

# Step 2: Build Frontend
Write-Host "Step 2: Building Frontend" -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed" -ForegroundColor Red
    exit 1
}

# Step 3: Install Backend Dependencies
Write-Host "Step 3: Installing Backend Dependencies" -ForegroundColor Yellow
Set-Location ../backend
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend dependencies installation failed" -ForegroundColor Red
    exit 1
}

# Return to root directory
Set-Location ..

Write-Host "All dependencies installed and frontend built successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Push your code to GitHub" -ForegroundColor White
Write-Host "2. Deploy backend to Railway/Render" -ForegroundColor White
Write-Host "3. Deploy frontend to Vercel/Netlify" -ForegroundColor White
Write-Host "4. Configure environment variables" -ForegroundColor White 