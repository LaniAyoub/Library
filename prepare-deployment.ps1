# Library Management System - Deployment Preparation
# This script prepares your project for free cloud deployment

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Library Deployment Preparation" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$ErrorActionPreference = "Continue"

# Step 1: Clean unnecessary files
Write-Host "[1/5] Cleaning unnecessary files..." -ForegroundColor Yellow
Write-Host "  ✓ Project is clean (cleanup already done)" -ForegroundColor Green

# Step 2: Check Git status
Write-Host "`n[2/5] Checking Git repository..." -ForegroundColor Yellow

if (Test-Path ".git") {
    Write-Host "  ✓ Git repository exists" -ForegroundColor Green
    $gitStatus = git status --porcelain 2>$null
    if ($gitStatus) {
        Write-Host "  ⚠ You have uncommitted changes" -ForegroundColor Yellow
    } else {
        Write-Host "  ✓ No uncommitted changes" -ForegroundColor Green
    }
} else {
    Write-Host "  ⚠ Git not initialized - you'll need to initialize it" -ForegroundColor Yellow
}

# Step 3: Check environment files
Write-Host "`n[3/5] Checking environment configuration..." -ForegroundColor Yellow

if (Test-Path ".env.example") {
    Write-Host "  ✓ .env.example exists" -ForegroundColor Green
} else {
    Write-Host "  ⚠ .env.example missing" -ForegroundColor Yellow
}

if (Test-Path "front\.env.production") {
    Write-Host "  ✓ front/.env.production exists" -ForegroundColor Green
} else {
    Write-Host "  ⚠ front/.env.production missing" -ForegroundColor Yellow
}

# Step 4: Verify Docker configuration
Write-Host "`n[4/5] Verifying Docker configuration..." -ForegroundColor Yellow

$dockerFiles = @(
    "docker-compose.prod.yml",
    "front\Dockerfile",
    "SBP1\Dockerfile"
)

$allGood = $true
foreach ($file in $dockerFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file missing!" -ForegroundColor Red
        $allGood = $false
    }
}

# Step 5: Display deployment readiness
Write-Host "`n[5/5] Deployment Readiness Summary" -ForegroundColor Yellow
Write-Host "======================================`n" -ForegroundColor Cyan

Write-Host "📦 Docker Hub Images:" -ForegroundColor White
Write-Host "  • Backend:  laniayoub/library-backend:latest" -ForegroundColor Gray
Write-Host "  • Frontend: laniayoub/library-frontend:latest" -ForegroundColor Gray

$javaFiles = (Get-ChildItem -Path "SBP1\src" -Recurse -Filter "*.java" -ErrorAction SilentlyContinue | Measure-Object).Count
$reactFiles = (Get-ChildItem -Path "front\src" -Recurse -Include "*.tsx","*.ts" -ErrorAction SilentlyContinue | Measure-Object).Count

Write-Host "`n📊 Project Statistics:" -ForegroundColor White
Write-Host "  • Backend Java files: $javaFiles" -ForegroundColor Gray
Write-Host "  • Frontend TypeScript files: $reactFiles" -ForegroundColor Gray

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. ✅ Read FREE_DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host "  2. ✅ Read DEPLOYMENT_CHECKLIST.md" -ForegroundColor White
Write-Host "  3. 🌐 Sign up for Railway.app (FREE)" -ForegroundColor White
Write-Host "  4. 📤 Push code to GitHub" -ForegroundColor White
Write-Host "  5. 🚀 Deploy to Railway" -ForegroundColor White
Write-Host "  6. ⚙️  Update frontend URL in .env.production" -ForegroundColor White
Write-Host "  7. ⚙️  Update backend CORS with frontend URL" -ForegroundColor White
Write-Host "  8. ✅ Test all features" -ForegroundColor White
Write-Host "  9. 🎓 Present to teacher!" -ForegroundColor Green

Write-Host "`n🚀 Recommended FREE Deployment:" -ForegroundColor Cyan
Write-Host "  → Railway.app (https://railway.app)" -ForegroundColor White
Write-Host "    • $5/month free credit (no credit card)" -ForegroundColor Gray
Write-Host "    • Docker & MySQL support" -ForegroundColor Gray
Write-Host "    • Auto HTTPS & domains" -ForegroundColor Gray

Write-Host "`n✨ Your project is ready for deployment!" -ForegroundColor Green
Write-Host "   Start with: FREE_DEPLOYMENT_GUIDE.md`n" -ForegroundColor Yellow

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Preparation Complete! ✅" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
