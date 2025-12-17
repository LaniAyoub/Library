# 🔄 Difference Between docker-compose.yml vs docker-compose.prod.yml

## 📊 Quick Comparison Table

| Feature | docker-compose.yml | docker-compose.prod.yml |
|---------|-------------------|------------------------|
| **Purpose** | Development | Production |
| **Backend Source** | Builds from local code | Uses Docker Hub image |
| **Frontend Source** | Builds from local code | Uses Docker Hub image |
| **Build Time** | ~5-8 minutes | ~30 seconds |
| **Use Case** | Local development & testing | Production deployment |
| **Container Names** | library-* | library-*-prod |

---

## 🔍 Detailed Differences

### 1. **Backend Service**

#### docker-compose.yml (Development)
```yaml
backend:
  build:
    context: ./SBP1          # ← Builds from local source code
    dockerfile: Dockerfile
  container_name: library-backend
```

#### docker-compose.prod.yml (Production)
```yaml
backend:
  image: laniayoub/library-backend:latest  # ← Uses pre-built Docker Hub image
  container_name: library-backend-prod
```

**Why?**
- Development: You want to build and test your code changes immediately
- Production: You want to use a tested, stable image without rebuilding

---

### 2. **Frontend Service**

#### docker-compose.yml (Development)
```yaml
frontend:
  build:
    context: ./front         # ← Builds from local source code
    dockerfile: Dockerfile
  container_name: library-frontend
```

#### docker-compose.prod.yml (Production)
```yaml
frontend:
  image: laniayoub/library-frontend:latest  # ← Uses pre-built Docker Hub image
  container_name: library-frontend-prod
```

**Why?**
- Development: Test your React changes immediately
- Production: Use the stable, optimized production build

---

### 3. **Container Names**

#### docker-compose.yml
```yaml
mysql:      library-mysql
backend:    library-backend
frontend:   library-frontend
```

#### docker-compose.prod.yml
```yaml
mysql:      library-mysql-prod
backend:    library-backend-prod
frontend:   library-frontend-prod
```

**Why?**
- Different names prevent conflicts if running both environments
- Easy to identify which environment is running

---

### 4. **MySQL Init Scripts**

#### docker-compose.yml
```yaml
volumes:
  - ./mysql-init:/docker-entrypoint-initdb.d
```

#### docker-compose.prod.yml
```yaml
volumes:
  - ./mysql-init:/docker-entrypoint-initdb.d:ro  # ← Read-only
```

**Why?**
- Production: `:ro` (read-only) prevents accidental modifications

---

### 5. **Restart Policies**

#### docker-compose.yml
```yaml
restart: unless-stopped  # ← At service level
```

#### docker-compose.prod.yml
```yaml
restart: unless-stopped  # ← At end of each service definition
```

**Why?**
- Production: Explicitly defined to ensure services always restart after failures

---

### 6. **Database Health Checks**

#### docker-compose.yml
```yaml
depends_on:
  mysql:
    condition: service_healthy
```

#### docker-compose.prod.yml
```yaml
depends_on:
  mysql:
    condition: service_healthy
  # Frontend also depends on backend health
  backend:
    condition: service_healthy
```

**Why?**
- Production: More strict health checks to ensure proper startup order

---

## 🎯 When to Use Each

### Use `docker-compose.yml` when:
✅ Developing locally
✅ Testing code changes
✅ Debugging issues
✅ Making frequent updates
✅ First time setup

**Command:**
```bash
docker-compose up --build
```

### Use `docker-compose.prod.yml` when:
✅ Deploying to production
✅ Running stable version
✅ Quick startup needed
✅ Using tested images
✅ Presenting to teacher/client

**Command:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🚀 Typical Workflow

### Development Cycle:
```bash
# 1. Make code changes
# 2. Test with development compose
docker-compose up --build

# 3. When satisfied, build production images
cd SBP1
docker build -t laniayoub/library-backend:latest .
docker push laniayoub/library-backend:latest

cd ../front
docker build -t laniayoub/library-frontend:latest .
docker push laniayoub/library-frontend:latest

# 4. Deploy with production compose
cd ..
docker-compose -f docker-compose.prod.yml up -d
```

### Production Deployment:
```bash
# Just pull and run!
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

---

## ⚡ Performance Comparison

### docker-compose.yml (Dev)
- **First Run:** 5-8 minutes (building images)
- **After Changes:** 2-5 minutes (rebuilding)
- **Disk Space:** More (build cache + images)

### docker-compose.prod.yml (Prod)
- **First Run:** 30-60 seconds (pulling images)
- **After Updates:** 30-60 seconds (pulling new images)
- **Disk Space:** Less (only final images)

---

## 🔒 Security Differences

### Development (docker-compose.yml)
- ⚠️ Shows SQL logs (useful for debugging)
- ⚠️ MySQL port exposed to host (3308)
- ⚠️ Less restrictive permissions

### Production (docker-compose.prod.yml)
- ✅ SQL logs off by default
- ✅ MySQL port exposed but in production would be internal only
- ✅ Read-only volumes where possible
- ✅ Health checks enforced

---

## 📝 Summary

| Aspect | Development | Production |
|--------|-------------|------------|
| **Speed** | Slower (builds) | Fast (pulls) |
| **Flexibility** | High (edit & test) | Low (stable) |
| **Purpose** | Testing changes | Running stable app |
| **Images** | Builds locally | Uses Docker Hub |
| **Updates** | Rebuild required | Just pull new image |

---

## 💡 Best Practices

1. **For Development:**
   - Use `docker-compose.yml`
   - Build and test frequently
   - Use `docker-compose up --build` to force rebuilds

2. **For Production:**
   - Use `docker-compose.prod.yml`
   - Only deploy tested images
   - Use `docker-compose pull` before `up` to get latest

3. **For Teacher Demo:**
   - Use `docker-compose.prod.yml` ✅
   - Shows professional deployment
   - Fast startup time
   - Stable and tested

---

## 🎓 For Your Teacher Presentation

**Use docker-compose.prod.yml because:**
- ✅ Faster startup (looks professional)
- ✅ Uses images from Docker Hub (shows CI/CD knowledge)
- ✅ Production-ready configuration
- ✅ More reliable (no build errors during demo)

**Command to show:**
```bash
# Start the application
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop
docker-compose -f docker-compose.prod.yml down
```

---

**Both files are important, but for deployment and demos, use docker-compose.prod.yml!** 🚀
