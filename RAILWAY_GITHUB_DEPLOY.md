# FINAL FIX: Deploy Backend from GitHub Source

## Problem Identified ✅
The backend Docker image on Docker Hub **does not contain the compiled controller classes**. That's why you get 404 errors - the API endpoints don't exist in the running container.

## Solution: Deploy Backend from GitHub Source Code

Railway will build the backend directly from your GitHub repository, ensuring all controllers are included.

---

## Step-by-Step Instructions:

### 1. Go to Railway Backend Service

1. Open Railway Dashboard
2. Click on your **Backend Service** (the one currently showing 404)
3. Click **Settings** (gear icon)

### 2. Change Deployment Source

1. In Settings, find the **Source** section
2. Click **Disconnect** (if using Docker image)
3. Click **+ New Source**
4. Select **GitHub Repo**
5. Choose repository: **LaniAyoub/Library**
6. Set **Root Directory**: `/SBP1`

### 3. Configure Build Settings

In the **Build** section, set:

**Builder**: `Maven` or `NIXPACKS`

**Build Command** (if needed):
```bash
mvn clean package -DskipTests
```

**Start Command**:
```bash
java -jar target/SBP1-0.0.1-SNAPSHOT.jar
```

### 4. Set Environment Variables

Go to **Variables** tab and make sure you have:

```bash
# Database Connection - USE YOUR ACTUAL MYSQL CREDENTIALS FROM RAILWAY!
SPRING_DATASOURCE_URL=jdbc:mysql://shinkansen.proxy.rlwy.net:55867/railway?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=EGzSIwdxdocunmnTGCVQmhvLMwUoAWPr

# JPA Configuration
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false

# Server Port
SERVER_PORT=8080

# Spring Profile
SPRING_PROFILES_ACTIVE=prod
```

⚠️ **CRITICAL**: Get the actual MySQL credentials from your Railway **MySQL service Variables tab**! The values above might be old.

### 5. Deploy

1. Click **Deploy** or Railway will auto-deploy
2. Wait 3-5 minutes for build and deployment
3. Watch the logs in **Deployments** tab

### 6. Verify Deployment

After deployment completes, check the logs for:

**✅ SUCCESS - Look for these lines:**
```
RequestMappingHandlerMapping : Mapped "{[/api/books],methods=[GET]}" 
RequestMappingHandlerMapping : Mapped "{[/api/authors],methods=[GET]}"
RequestMappingHandlerMapping : Mapped "{[/api/publishers],methods=[GET]}"
Started Sbp1Application in XX seconds
```

If you see "Mapped" messages, **controllers are loaded!** ✅

### 7. Test Backend

Open in browser:
```
https://YOUR-BACKEND-URL.up.railway.app/api/books
```

**Expected**: `[]` (empty JSON array) or list of books

**Not**: "Whitelabel Error Page" or 404

---

## Alternative: If GitHub Deployment Doesn't Work

### Option B: Build Locally and Push to Docker Hub

If you have Docker Desktop running:

```powershell
# Go to backend folder
cd d:\SOA\LibraryDS\SBP1

# Build using Docker (Docker will handle Maven build inside container)
docker build -t laniayoub/library-backend:latest .

# Push to Docker Hub
docker push laniayoub/library-backend:latest
```

Then in Railway:
1. Backend Service → Settings → Source
2. Select **Docker Image**
3. Image: `laniayoub/library-backend:latest`
4. Redeploy

**BUT** make sure the Dockerfile includes the Maven build:

```dockerfile
FROM maven:3.9.5-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## What Changed in the Code?

I added explicit component scanning to `Sbp1Application.java`:

```java
@SpringBootApplication
@ComponentScan(basePackages = "org.example.sbp1")  // ← Added this
public class Sbp1Application {
    public static void main(String[] args) {
        SpringApplication.run(Sbp1Application.class, args);
    }
}
```

This ensures Spring Boot scans and loads all controllers in the `org.example.sbp1` package.

---

## After Backend is Fixed:

Once backend shows the mapped endpoints in logs and `/api/books` returns `[]`:

### Update Frontend

Make sure frontend `.env.production` has the correct backend URL:

```bash
VITE_API_URL=https://YOUR-ACTUAL-BACKEND-URL.up.railway.app/api
```

Then rebuild frontend:
```powershell
cd d:\SOA\LibraryDS\front
docker build -t laniayoub/library-frontend:latest .
docker push laniayoub/library-frontend:latest
```

And redeploy frontend on Railway.

---

## Summary

**Root Cause**: Docker Hub image didn't include compiled controller classes

**Solution**: Deploy from GitHub source so Railway builds it fresh with all code

**Status**: Code fix pushed to GitHub (commit 216f70a)

**Next Step**: Configure Railway backend to deploy from GitHub repo!

🚀 Try this now and let me know what you see in the backend logs after redeploying!
