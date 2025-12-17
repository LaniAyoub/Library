# ✅ Deployment Checklist - Library Management System

## 🎯 Goal
Deploy your Library Management System for FREE to validate with your teacher.

---

## 📋 Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All unnecessary documentation removed
- [ ] Build artifacts cleaned (target/, dist/)
- [ ] `.env` file NOT committed to Git
- [ ] `.env.example` file exists
- [ ] Frontend API URL configuration supports environment variables
- [ ] Backend CORS configuration ready to update with production URL
- [ ] No sensitive data in code

### ✅ Testing (Local)
- [ ] Authors CRUD works
- [ ] Publishers CRUD works
- [ ] Books CRUD works (with auto-tag creation)
- [ ] Search functionality works
- [ ] Inventory management works
- [ ] Price update works
- [ ] No console errors
- [ ] Database persists data correctly

### ✅ Git Repository
- [ ] Git initialized
- [ ] All changes committed
- [ ] Pushed to GitHub
- [ ] Repository is public or accessible to deployment platform
- [ ] README.md is updated

### ✅ Docker Configuration
- [ ] `docker-compose.prod.yml` exists
- [ ] Backend `Dockerfile` exists
- [ ] Frontend `Dockerfile` exists
- [ ] `.dockerignore` files exist
- [ ] Railway configuration files added

---

## 🚀 Deployment Steps (Railway.app)

### Phase 1: Account Setup ⏱️ 5 min
- [ ] Go to https://railway.app
- [ ] Sign up with GitHub (NO credit card needed)
- [ ] Verify email address
- [ ] Create new project

### Phase 2: Database Setup ⏱️ 3 min
- [ ] Click "New" → "Database" → "MySQL"
- [ ] Wait for provisioning (~1 min)
- [ ] Note the database credentials:
  ```
  DATABASE_URL: _____________________
  MYSQL_HOST: _______________________
  MYSQL_PORT: _______________________
  MYSQL_USER: _______________________
  MYSQL_PASSWORD: ___________________
  MYSQL_DATABASE: ___________________
  ```

### Phase 3: Backend Deployment ⏱️ 10 min
- [ ] Click "New" → "GitHub Repo"
- [ ] Select your repository
- [ ] Configure service:
  - [ ] Name: `library-backend`
  - [ ] Root Directory: `/SBP1`
  - [ ] Dockerfile Path: `SBP1/Dockerfile`
- [ ] Add Environment Variables:
  ```
  SPRING_DATASOURCE_URL=jdbc:mysql://${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}
  SPRING_DATASOURCE_USERNAME=${MYSQL_USER}
  SPRING_DATASOURCE_PASSWORD=${MYSQL_PASSWORD}
  SPRING_JPA_HIBERNATE_DDL_AUTO=update
  SERVER_PORT=8080
  ```
- [ ] Click "Deploy"
- [ ] Wait for build to complete (~5-8 min)
- [ ] Click "Generate Domain" under Settings → Networking
- [ ] Copy backend URL: `https://__________________.up.railway.app`
- [ ] Test: Visit `https://your-backend.up.railway.app/api/books`
- [ ] Should return: `[]` (empty array)

### Phase 4: Frontend Deployment ⏱️ 10 min
- [ ] Click "New" → "GitHub Repo"
- [ ] Select your repository again
- [ ] Configure service:
  - [ ] Name: `library-frontend`
  - [ ] Root Directory: `/front`
  - [ ] Dockerfile Path: `front/Dockerfile`
- [ ] Add Environment Variables:
  ```
  VITE_API_URL=https://your-backend-url.up.railway.app/api
  ```
  (Replace with your actual backend URL from Phase 3)
- [ ] Click "Deploy"
- [ ] Wait for build to complete (~3-5 min)
- [ ] Click "Generate Domain" under Settings → Networking
- [ ] Copy frontend URL: `https://__________________.up.railway.app`

### Phase 5: CORS Configuration Update ⏱️ 5 min
- [ ] Update `SBP1/src/main/java/org/example/sbp1/WebConfig.java`
- [ ] Add your Railway frontend URL to allowed origins:
  ```java
  .allowedOrigins(
      "http://localhost:5173",
      "http://localhost:80",
      "http://localhost",
      "https://your-frontend.up.railway.app"  // ← Add this
  )
  ```
- [ ] Commit and push changes:
  ```bash
  git add .
  git commit -m "Update CORS for Railway deployment"
  git push
  ```
- [ ] Railway will auto-deploy (takes ~5 min)

### Phase 6: Testing & Verification ⏱️ 10 min
- [ ] Open frontend URL in browser
- [ ] Test Create Author:
  - [ ] Name: "Test Author"
  - [ ] Should succeed
- [ ] Test Create Publisher:
  - [ ] Name: "Test Publisher"
  - [ ] Should succeed
- [ ] Test Create Book:
  - [ ] Title: "Test Book"
  - [ ] ISBN: "123-456-789"
  - [ ] Price: 25
  - [ ] Quantity: 10
  - [ ] Category: "Fiction"
  - [ ] Author: "Test Author"
  - [ ] Publisher: "Test Publisher"
  - [ ] Tags: "Fiction", "Test"
  - [ ] Should succeed
- [ ] Test Search:
  - [ ] Search for "Test"
  - [ ] Should find the book
- [ ] Test Inventory:
  - [ ] View inventory table
  - [ ] Should show book with quantity 10
- [ ] Test Price Update:
  - [ ] Update book price to 30
  - [ ] Should reflect immediately
- [ ] Check all pages:
  - [ ] Homepage
  - [ ] Create Book
  - [ ] Authors
  - [ ] Publishers
  - [ ] Search
  - [ ] Inventory
  - [ ] Price Update
- [ ] Check browser console:
  - [ ] No errors
  - [ ] API calls succeeding

---

## 📸 Documentation for Teacher

### Prepare These Materials:

#### 1. Live URLs Document
```
Project: Library Management System
Student: [Your Name]

Live Application:
Frontend: https://your-frontend.up.railway.app
Backend API: https://your-backend.up.railway.app/api

GitHub Repository:
https://github.com/LaniAyoub/Library

Features:
✓ Book Management (CRUD)
✓ Author Management (CRUD)
✓ Publisher Management (CRUD)
✓ Search Functionality
✓ Inventory Management
✓ Price Updates
✓ Automatic Tag Creation
```

#### 2. Screenshots Checklist
- [ ] Homepage with book list
- [ ] Create new book form (filled)
- [ ] Create author form
- [ ] Create publisher form
- [ ] Search results page
- [ ] Inventory management page
- [ ] Price update page
- [ ] Browser showing URL (to prove it's deployed)

#### 3. API Testing Document
Test these endpoints and document responses:

- [ ] `GET /api/books/displayAllBooks`
  - Status: 200
  - Response: Array of books

- [ ] `POST /api/books/createBook`
  - Status: 200/201
  - Request body: Book JSON
  - Response: Created book

- [ ] `POST /api/authors/create`
  - Status: 200/201
  - Request body: Author JSON
  - Response: Created author

- [ ] `POST /api/publishers/create`
  - Status: 200/201
  - Request body: Publisher JSON
  - Response: Created publisher

#### 4. Technical Documentation
- [ ] README.md updated with:
  - [ ] Project description
  - [ ] Live demo URL
  - [ ] Technologies used
  - [ ] Features list
  - [ ] Setup instructions
  - [ ] Deployment information

---

## 🎓 Presentation Script for Teacher

### Introduction (1 min)
"Good [morning/afternoon], I'd like to present my Library Management System project. It's a full-stack web application deployed on Railway.app, accessible at [your-url]."

### Live Demo (5-7 min)

1. **Homepage** (30 sec)
   - "Here's the main interface showing all books in the library."
   - Scroll through book list

2. **Create Operations** (2 min)
   - "Let me demonstrate creating a new book."
   - Create author → Create publisher → Create book
   - "Notice the tags are auto-created if they don't exist."

3. **Search** (1 min)
   - "The search feature allows finding books by title, author, or category."
   - Demonstrate search

4. **Inventory Management** (1 min)
   - "Here's the inventory view showing stock levels."
   - Show inventory table

5. **Price Updates** (1 min)
   - "Prices can be updated in bulk."
   - Update a price

6. **Technical Stack** (1-2 min)
   - "Backend: Spring Boot with MySQL database"
   - "Frontend: React with TypeScript"
   - "Deployment: Docker containers on Railway.app"
   - "All features fully functional and persistent"

### Q&A
- Be ready to show:
  - GitHub repository
  - Database persistence
  - API responses
  - CORS configuration
  - Docker configuration

---

## ⏱️ Total Deployment Time

- **Preparation**: 30 min
- **Railway Setup**: 5 min
- **Database Setup**: 3 min
- **Backend Deploy**: 10 min
- **Frontend Deploy**: 10 min
- **CORS Update**: 5 min
- **Testing**: 10 min
- **Documentation**: 20 min

**Total**: ~1.5 hours

---

## 🆘 Troubleshooting

### Problem: Backend won't start
**Check:**
- [ ] Railway logs: `railway logs -s library-backend`
- [ ] Database environment variables correct
- [ ] Port 8080 exposed in Dockerfile

**Solution:**
```bash
# Check Railway logs
railway logs -s library-backend --tail 100

# Restart service
railway restart -s library-backend
```

### Problem: Frontend can't connect to backend
**Check:**
- [ ] VITE_API_URL set correctly
- [ ] Backend URL is accessible
- [ ] CORS includes frontend URL
- [ ] Browser console errors

**Solution:**
- Update `.env.production` with correct backend URL
- Redeploy frontend

### Problem: CORS errors
**Check:**
- [ ] Frontend URL in WebConfig.java
- [ ] Backend redeployed after CORS update

**Solution:**
```java
// In WebConfig.java
.allowedOrigins(
    "https://your-actual-frontend.up.railway.app"
)
```

### Problem: Database connection failed
**Check:**
- [ ] MySQL service running in Railway
- [ ] Environment variables match database credentials
- [ ] Connection string format correct

**Solution:**
- Verify Railway database variables
- Check `SPRING_DATASOURCE_URL` format

---

## 📞 Support Resources

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Your Repository**: https://github.com/LaniAyoub/Library
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **React Docs**: https://react.dev

---

## ✅ Final Verification Before Teacher Demo

### Day Before:
- [ ] Application still running
- [ ] All features working
- [ ] Screenshots prepared
- [ ] URLs documented
- [ ] Presentation practiced

### 1 Hour Before:
- [ ] Open application in browser
- [ ] Test all features
- [ ] Clear browser cache if needed
- [ ] Have backup demo video ready (optional)

### During Demo:
- [ ] Stable internet connection
- [ ] Application responsive
- [ ] All features working
- [ ] Professional presentation

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Application accessible via public URL
- ✅ All CRUD operations working
- ✅ Database persisting data
- ✅ No console errors
- ✅ Responsive UI
- ✅ Professional appearance
- ✅ Teacher can access and test

---

**Good luck with your presentation! 🚀🎓**

You've built a solid, production-ready application. Be confident!
