# 🚀 Free Deployment Guide - Library Management System

## 📋 Overview

This guide will help you deploy your Library Management System for **FREE** to validate with your teacher. We'll use the best free-tier services available.

## 🎯 Recommended Free Deployment Solution

### **Option 1: Railway.app (RECOMMENDED) ⭐**

**Why Railway?**
- ✅ Completely FREE ($5 monthly credit, no credit card required for trial)
- ✅ Supports Docker Compose deployments
- ✅ Easy MySQL database included
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ Simple deployment process

**What you get:**
- Frontend URL: `https://your-project.up.railway.app`
- Backend API: `https://your-api.up.railway.app`
- MySQL Database: Managed and included

---

## 🛠️ Pre-Deployment Preparation

### Step 1: Remove Copilot Instructions (Optional but recommended)

```powershell
Remove-Item ".github\copilot-instructions.md" -Force
```

### Step 2: Update Frontend API Configuration

We need to make the API URL dynamic for deployment.

**Edit: `front/src/config/api.ts`**

Change from:
```typescript
export const API_BASE_URL = 'http://localhost:8080/api';
```

To:
```typescript
// Use environment variable or fallback to production URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
```

### Step 3: Add Environment Variable Support to Frontend

**Create: `front/.env.production`**
```env
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

### Step 4: Update Docker Compose for Production

Your `docker-compose.prod.yml` is already good, but let's ensure it's ready.

### Step 5: Commit Everything to GitHub

```powershell
cd d:\SOA\LibraryDS

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Production ready - cleaned and configured for deployment"

# Create repository on GitHub and push
git remote add origin https://github.com/LaniAyoub/Library.git
git branch -M main
git push -u origin main
```

---

## 🚀 Deployment Steps - Railway.app

### Phase 1: Sign Up and Setup

1. **Go to Railway.app**
   - Visit: https://railway.app
   - Click "Start a New Project"
   - Sign up with GitHub (no credit card needed)

2. **Connect Your Repository**
   - Click "Deploy from GitHub repo"
   - Select your `Library` repository
   - Railway will detect your Docker setup

### Phase 2: Deploy Backend

1. **Create Backend Service**
   - Click "New" → "Service"
   - Select "Deploy from GitHub"
   - Choose your repository
   - Set root directory: `/SBP1`

2. **Configure Backend Environment Variables**
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/librarydb
   SPRING_DATASOURCE_USERNAME=library
   SPRING_DATASOURCE_PASSWORD=<generated-by-railway>
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   SERVER_PORT=8080
   ```

3. **Set Dockerfile Path**
   - Dockerfile path: `SBP1/Dockerfile`
   - Port: `8080`

### Phase 3: Deploy MySQL Database

1. **Add MySQL Service**
   - Click "New" → "Database" → "MySQL"
   - Railway will provision a MySQL instance
   - Copy the connection details

2. **Note the Database Credentials**
   Railway provides these automatically:
   - `MYSQL_URL`
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

### Phase 4: Deploy Frontend

1. **Create Frontend Service**
   - Click "New" → "Service"
   - Select your repository
   - Set root directory: `/front`

2. **Configure Frontend Environment Variables**
   ```
   VITE_API_URL=https://<your-backend-domain>.up.railway.app/api
   ```

3. **Set Dockerfile Path**
   - Dockerfile path: `front/Dockerfile`
   - Port: `80`

### Phase 5: Configure Networking

1. **Enable Public Domains**
   - Go to each service
   - Click "Settings" → "Networking"
   - Click "Generate Domain"
   - Copy the URLs

2. **Update Backend CORS**
   You'll need to update `WebConfig.java` with the Railway frontend URL

### Phase 6: Verify Deployment

1. **Check Backend Health**
   - Visit: `https://<backend-url>.up.railway.app/api/books`
   
2. **Check Frontend**
   - Visit: `https://<frontend-url>.up.railway.app`
   
3. **Test Full Flow**
   - Create authors, publishers, and books
   - Verify everything works

---

## 🆓 Alternative Free Options

### **Option 2: Render.com**

**Pros:**
- Free tier available
- Simple deployment
- Supports Docker

**Cons:**
- Spins down after inactivity (30-second cold start)
- Limited to 750 hours/month

**Setup:**
1. Go to https://render.com
2. Create Web Service for Backend (from Docker)
3. Create Web Service for Frontend (from Docker)
4. Create PostgreSQL Database (free tier)
   - Note: You'll need to modify code to use PostgreSQL instead of MySQL

### **Option 3: Fly.io**

**Pros:**
- Free tier: 3GB persistent volumes
- Always on (no cold starts)
- Good performance

**Cons:**
- Requires credit card (but won't charge)
- More complex setup

---

## 📝 Quick Preparation Script

Run this to prepare your project:

```powershell
# Navigate to project
cd d:\SOA\LibraryDS

# Remove copilot instructions
Remove-Item ".github\copilot-instructions.md" -Force -ErrorAction SilentlyContinue

# Create production environment file
@"
VITE_API_URL=\${VITE_API_URL}
"@ | Out-File -FilePath "front\.env.production" -Encoding UTF8

# Show current status
Write-Host "`n✅ Project prepared for deployment!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Update front/src/config/api.ts to use environment variables"
Write-Host "2. Commit and push to GitHub"
Write-Host "3. Deploy on Railway.app"
Write-Host "4. Update backend CORS with Railway frontend URL"
Write-Host "5. Redeploy backend`n"
```

---

## 🔧 Configuration Files to Update

### 1. Frontend API Configuration

**File: `front/src/config/api.ts`**

```typescript
// Production-ready API configuration
const getApiUrl = (): string => {
  // Check if we have an environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:8080/api';
};

export const API_BASE_URL = getApiUrl();

console.log('API URL:', API_BASE_URL);
```

### 2. Backend CORS Configuration

**File: `SBP1/src/main/java/org/example/sbp1/WebConfig.java`**

After deployment, update this to include your Railway URLs:

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins(
                "http://localhost:5173",
                "http://localhost:80",
                "http://localhost",
                "https://your-frontend.up.railway.app"  // Add this after deployment
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
}
```

### 3. Application Properties (if needed)

**File: `SBP1/src/main/resources/application.properties`**

Ensure it uses environment variables:

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/librarydb}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:library}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:root}
spring.jpa.hibernate.ddl-auto=update
```

---

## 📸 What to Show Your Teacher

After deployment, prepare these for validation:

1. **Live URLs**
   - Frontend: `https://your-project.up.railway.app`
   - Backend API: `https://your-api.up.railway.app/api/books`

2. **Screenshots**
   - Homepage with book list
   - Create book form
   - Create author form
   - Create publisher form
   - Search functionality
   - Inventory management
   - Price update feature

3. **API Documentation**
   - List of endpoints
   - Example requests/responses
   - Database schema

4. **GitHub Repository**
   - Clean, documented code
   - README with setup instructions
   - Deployment configuration

---

## ⚠️ Important Notes

### For Railway.app Deployment:

1. **Free Tier Limits:**
   - $5 monthly credit
   - ~500 hours of uptime
   - Sufficient for project validation

2. **First Deployment:**
   - Takes 5-10 minutes
   - Database initialization happens automatically
   - May need to restart after first deploy

3. **Monitoring:**
   - Check Railway logs for errors
   - Monitor database connections
   - Watch for memory usage

### Security Checklist:

- ✅ Remove `.env` from git (use `.env.example`)
- ✅ Use environment variables for sensitive data
- ✅ Update CORS to specific domains (not `*`)
- ✅ Remove debug logs
- ✅ Use HTTPS only in production

---

## 🎓 Validation Checklist for Teacher

Demonstrate these features:

- [ ] User can view all books
- [ ] User can create new books
- [ ] User can create authors
- [ ] User can create publishers
- [ ] User can search books
- [ ] User can update prices
- [ ] User can manage inventory
- [ ] Application is responsive
- [ ] API returns proper JSON responses
- [ ] Database persists data correctly
- [ ] Application is deployed and accessible online

---

## 🆘 Troubleshooting

### Backend won't connect to database:
- Check Railway MySQL environment variables
- Verify connection string format
- Check logs: `railway logs -s backend`

### Frontend can't reach backend:
- Verify VITE_API_URL is set correctly
- Update backend CORS with frontend URL
- Check browser console for errors

### Application won't deploy:
- Check Dockerfile syntax
- Verify all dependencies in package.json/pom.xml
- Review Railway build logs

---

## 🎯 Estimated Timeline

1. **Preparation**: 30 minutes
2. **Railway Setup**: 15 minutes
3. **Backend Deployment**: 20 minutes
4. **Frontend Deployment**: 15 minutes
5. **Testing & Verification**: 20 minutes

**Total**: ~1.5-2 hours for complete deployment

---

## 📞 Support Resources

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Your code repository: https://github.com/LaniAyoub/Library

---

## ✅ Final Checklist Before Showing Teacher

- [ ] Application is live and accessible
- [ ] All features working (CRUD operations)
- [ ] No console errors
- [ ] Database persisting data
- [ ] Professional UI/UX
- [ ] README.md updated with live URL
- [ ] Screenshots prepared
- [ ] Demo data populated

---

**Good luck with your validation! 🎓🚀**

Your project is solid and ready to impress your teacher!
