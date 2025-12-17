# Railway Troubleshooting Guide

## Issue: Frontend shows 502 Bad Gateway & Backend returns 404

### Step 1: Check Backend Service on Railway

1. Go to Railway Dashboard → Your Project
2. Click on **Backend Service**
3. Check the **Deployments** tab:
   - ✅ Status should be "Active" (green)
   - ❌ If it says "Crashed" or "Failed", check logs

4. Click **View Logs** and look for:
   ```
   ✅ GOOD: "Started Sbp1Application in X seconds"
   ✅ GOOD: "HikariPool-1 - Start completed"
   ❌ BAD: "Error" or "Exception" or "Failed to start"
   ```

### Step 2: Verify Backend Environment Variables

Click **Variables** tab and verify these exist:

```
SPRING_DATASOURCE_URL=jdbc:mysql://shinkansen.proxy.rlwy.net:55867/railway?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=EGzSIwdxdocunmnTGCVQmhvLMwUoAWPr
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SERVER_PORT=8080
```

⚠️ **IMPORTANT**: Make sure you're using the **CURRENT** Railway MySQL credentials from your MySQL service!

### Step 3: Get Correct Backend URL

1. In **Backend Service** → **Settings** → **Networking**
2. Copy the **Public Domain** (should look like: `backend-production-xxxx.up.railway.app`)
3. Test it by opening in browser:
   ```
   https://YOUR-BACKEND-URL.up.railway.app/api/books
   ```
   - ✅ Should return `[]` (empty array) or list of books
   - ❌ Should NOT return 404 or error page

### Step 4: Update Frontend Environment Variable

If backend URL is different from `library-production-3399.up.railway.app`:

1. Update `front/.env.production` with the correct URL:
   ```
   VITE_API_URL=https://YOUR-ACTUAL-BACKEND-URL.up.railway.app/api
   ```

2. Rebuild and push Docker image:
   ```powershell
   cd front
   docker build -t laniayoub/library-frontend:latest .
   docker push laniayoub/library-frontend:latest
   ```

3. Redeploy frontend on Railway

### Step 5: Check Frontend Service

1. Click **Frontend Service** in Railway
2. Check **Variables** tab - should have:
   ```
   VITE_API_URL=https://YOUR-BACKEND-URL.up.railway.app/api
   ```
   ⚠️ **This variable might be missing!** Add it if not there.

3. Check **Settings** → **Networking** → Should have a Public Domain

4. Click **View Logs** after redeploying:
   ```
   ✅ GOOD: nginx starting, no errors
   ❌ BAD: "backend not found" or crash errors
   ```

### Step 6: Verify MySQL Database Connection

1. Click **MySQL Service** in Railway
2. Go to **Variables** tab
3. Copy these values:
   - `MYSQL_HOST`
   - `MYSQL_PORT` 
   - `MYSQL_DATABASE`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`

4. Make sure backend's `SPRING_DATASOURCE_URL` uses these EXACT values:
   ```
   jdbc:mysql://[MYSQL_HOST]:[MYSQL_PORT]/[MYSQL_DATABASE]?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   ```

---

## Quick Fix Checklist:

- [ ] Backend service is **Active** (green status)
- [ ] Backend logs show "Started Sbp1Application"
- [ ] Backend environment variables are correct
- [ ] Backend URL opens in browser and shows data or `[]`
- [ ] Frontend `.env.production` has correct backend URL
- [ ] Frontend Docker image rebuilt and pushed
- [ ] Frontend service redeployed on Railway
- [ ] Frontend has `VITE_API_URL` environment variable on Railway
- [ ] MySQL connection string is correct (jdbc:mysql://...)

---

## Most Common Issues:

### 1. **Backend Not Actually Running**
   - Solution: Check backend logs, restart service

### 2. **Wrong MySQL Credentials**
   - Solution: Get fresh credentials from Railway MySQL service

### 3. **Frontend Missing VITE_API_URL**
   - Solution: Add it in Railway dashboard under Variables

### 4. **Old Docker Image Being Used**
   - Solution: Rebuild, push, and redeploy

### 5. **CORS Not Configured**
   - Solution: Backend WebConfig.java needs frontend URL in allowedOrigins

---

## Test URLs:

Replace with YOUR actual URLs:

- **Backend API Test**: `https://YOUR-BACKEND.up.railway.app/api/books`
  - Should return: `[]` or list of books (JSON)
  
- **Frontend**: `https://YOUR-FRONTEND.up.railway.app`
  - Should show: Library Management interface

---

## What to Send Me:

1. **Backend URL**: (from Railway)
2. **Frontend URL**: (from Railway)  
3. **Backend Logs**: (last 50 lines from Railway)
4. **Backend Status**: (Active/Crashed/Failed)
5. **Test Result**: What happens when you open backend URL in browser?

I'll help you fix it! 🚀
