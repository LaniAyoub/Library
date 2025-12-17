# 🔧 Railway Deployment - Troubleshooting Guide

## ⚠️ Error: "Railpack could not determine how to build the app"

This error occurs when Railway's auto-detection fails. Here's how to fix it:

---

## ✅ Solution: Manual Configuration (RECOMMENDED)

Railway needs to be explicitly told to use Dockerfile. Follow these steps:

### For Backend Service:

1. **In Railway Dashboard:**
   - Select your backend service
   - Go to **Settings** tab
   - Find **"Build"** section

2. **Configure Build Settings:**
   ```
   Root Directory: SBP1
   Builder: Dockerfile
   Dockerfile Path: Dockerfile
   ```

3. **Configure Deploy Settings:**
   ```
   Start Command: (leave empty - Dockerfile handles it)
   ```

4. **Add Environment Variables:**
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}
   SPRING_DATASOURCE_USERNAME=${MYSQL_USER}
   SPRING_DATASOURCE_PASSWORD=${MYSQL_PASSWORD}
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   SERVER_PORT=8080
   ```

5. **Click "Deploy"**

### For Frontend Service:

1. **In Railway Dashboard:**
   - Select your frontend service
   - Go to **Settings** tab
   - Find **"Build"** section

2. **Configure Build Settings:**
   ```
   Root Directory: front
   Builder: Dockerfile
   Dockerfile Path: Dockerfile
   ```

3. **Add Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app/api
   ```
   (Replace with your actual backend URL after backend is deployed)

4. **Click "Deploy"**

---

## 🎯 Step-by-Step Railway Deployment

### Phase 1: Create Project
1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `Library` repository

### Phase 2: Deploy MySQL Database First
1. In your project, click "New"
2. Select "Database" → "MySQL"
3. Wait for provisioning (~1-2 minutes)
4. **Note the connection variables** (automatically created):
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

### Phase 3: Deploy Backend
1. Click "New" → "GitHub Repo"
2. Select your repository
3. Railway will try to auto-detect - **let it fail, then configure manually**
4. Go to **Settings** → **Build**:
   - **Root Directory**: `SBP1`
   - **Builder**: `Dockerfile`
   - **Dockerfile Path**: `Dockerfile`
5. Go to **Variables** tab:
   - Add all environment variables listed above
   - Use Railway's MySQL variables (they auto-reference)
6. Go to **Settings** → **Networking**:
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://backend-production-xxxx.up.railway.app`)
7. Click "Deploy" or trigger redeploy

### Phase 4: Deploy Frontend
1. Click "New" → "GitHub Repo"
2. Select your repository again
3. Configure manually:
   - **Root Directory**: `front`
   - **Builder**: `Dockerfile`
   - **Dockerfile Path**: `Dockerfile`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app/api
   ```
   (Use the backend URL from Phase 3)
5. Generate domain for frontend
6. Copy frontend URL (e.g., `https://frontend-production-xxxx.up.railway.app`)
7. Deploy

### Phase 5: Update Backend CORS
1. **Update your code locally:**
   
   Edit `SBP1/src/main/java/org/example/sbp1/WebConfig.java`:
   ```java
   @Override
   public void addCorsMappings(CorsRegistry registry) {
       registry.addMapping("/**")
               .allowedOrigins(
                   "http://localhost:5173",
                   "http://localhost:80",
                   "http://localhost",
                   "https://frontend-production-xxxx.up.railway.app"  // ← Add your Railway frontend URL
               )
               .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
               .allowedHeaders("*")
               .allowCredentials(true);
   }
   ```

2. **Commit and push:**
   ```powershell
   git add .
   git commit -m "Add Railway frontend URL to CORS"
   git push
   ```

3. Railway will auto-redeploy backend (~5 minutes)

### Phase 6: Test
1. Open your frontend URL in browser
2. Test all features:
   - Create author
   - Create publisher
   - Create book
   - Search
   - Inventory
   - Price update

---

## 🔍 Common Issues & Solutions

### Issue 1: "Builder not found" or "Dockerfile not detected"

**Solution:**
- Make sure you set **Root Directory** first
- Then set **Builder** to `Dockerfile`
- The Dockerfile path should be just `Dockerfile` (not full path)

### Issue 2: "Build failed - Maven not found"

**Solution:**
- This is correct! Your Dockerfile uses multi-stage build with Maven
- The error might be misleading - check full build logs
- Ensure Dockerfile is in the correct location: `SBP1/Dockerfile`

### Issue 3: Backend starts but crashes immediately

**Check:**
- Database environment variables are set correctly
- MySQL service is running and connected
- Check Railway logs for actual error

**Solution:**
```bash
# In Railway, check logs:
# - Go to backend service
# - Click "Deployments"
# - Click latest deployment
# - View logs

# Look for:
# - "Connected to MySQL"
# - "Started Sbp1Application"
# - Any exceptions
```

### Issue 4: Frontend can't connect to backend

**Check:**
- `VITE_API_URL` is set correctly
- Backend URL includes `/api` at the end
- CORS is updated with frontend URL
- Browser console for errors

**Solution:**
1. Verify frontend env var: `VITE_API_URL=https://backend-xxx.up.railway.app/api`
2. Update backend CORS with frontend URL
3. Redeploy backend
4. Hard refresh frontend (Ctrl+Shift+R)

### Issue 5: "Cannot connect to MySQL"

**Check:**
- MySQL service is running in Railway
- Environment variables reference Railway's MySQL
- Connection string format is correct

**Solution:**
- Use Railway's built-in variable references:
  ```
  SPRING_DATASOURCE_URL=jdbc:mysql://${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}
  ```
- These automatically reference the MySQL service in your project

---

## 📝 Correct Environment Variables

### Backend (SBP1):
```bash
# Database connection (use Railway's MySQL variables)
SPRING_DATASOURCE_URL=jdbc:mysql://${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}
SPRING_DATASOURCE_USERNAME=${MYSQL_USER}
SPRING_DATASOURCE_PASSWORD=${MYSQL_PASSWORD}

# Hibernate configuration
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.MySQL8Dialect

# Server configuration
SERVER_PORT=8080
```

### Frontend (front):
```bash
# API endpoint (replace with your actual backend URL)
VITE_API_URL=https://your-backend-production-xxxx.up.railway.app/api
```

---

## 🎬 Video Tutorial Alternative

If Railway GUI is confusing, you can also use **Railway CLI**:

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Deploy backend
cd SBP1
railway up

# Deploy frontend (in new terminal)
cd front
railway up
```

---

## 🆘 Still Having Issues?

### Option 1: Try Render.com Instead

Render.com has a simpler interface:
1. Go to https://render.com
2. Sign up with GitHub
3. Create "Web Service" for backend
4. Create "Web Service" for frontend
5. Create PostgreSQL database (free tier)
   - **Note:** You'll need to change from MySQL to PostgreSQL

### Option 2: Use Docker Compose Locally

For presentation, you can use your local Docker setup:
```powershell
docker-compose -f docker-compose.prod.yml up -d
```
Then use **ngrok** to expose it:
```powershell
# Install ngrok: https://ngrok.com/download
ngrok http 80
```
This gives you a public URL temporarily.

---

## ✅ Verification Checklist

Before showing to teacher:

- [ ] MySQL database running in Railway
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Backend can connect to database
- [ ] Frontend can call backend API
- [ ] CORS configured correctly
- [ ] All CRUD operations work
- [ ] No console errors
- [ ] Data persists across refreshes

---

## 📞 Get Help

- **Railway Discord**: https://discord.gg/railway (very active!)
- **Railway Docs**: https://docs.railway.app
- **Railway Status**: https://status.railway.app

---

**Good luck! The manual configuration method above should work perfectly.** 🚀
