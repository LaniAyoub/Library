# 🐳 Docker Quick Start

## 🚀 Deploy in 3 Steps

### Step 1: Copy Environment File
```bash
cd d:\SOA\LibraryDS
copy .env.example .env
```

### Step 2: Start All Services
```bash
docker-compose up -d
```

### Step 3: Open Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **API Health**: http://localhost:8080/actuator/health

---

## 📋 Common Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Restart specific service
docker-compose restart backend

# Check health status
docker-compose ps
```

---

## 🔧 What's Running?

| Service | Port | URL |
|---------|------|-----|
| React Frontend | 80 | http://localhost |
| Spring Boot API | 8080 | http://localhost:8080 |
| MySQL Database | 3308 | localhost:3308 |

---

## 📚 Full Documentation

See **DOCKER_DEPLOYMENT_GUIDE.md** for:
- Detailed configuration
- Troubleshooting
- Production deployment
- Backup & restore
- CI/CD integration

---

## 🐛 Common Issues

**Port 80 in use?**
```bash
# Change frontend port in docker-compose.yml
ports:
  - "8080:80"  # Now access at http://localhost:8080
```

**Services won't start?**
```bash
# Check logs
docker-compose logs

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

**Database connection failed?**
```bash
# Wait for MySQL to be healthy
docker-compose ps

# Should show "healthy" status for all services
```

---

## 🎉 That's It!

Your entire application stack is now running in Docker containers!

**Need help?** Check `DOCKER_DEPLOYMENT_GUIDE.md`
