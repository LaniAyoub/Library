# 🐳 Docker Deployment Guide - Library Management System

## 📦 What's Included

This dockerized setup includes:
- ✅ **MySQL 8.0** - Database server (port 3308 → 3306 internally)
- ✅ **Spring Boot Backend** - REST API (port 8080)
- ✅ **React Frontend** - Web UI with Nginx (port 80)
- ✅ **Multi-stage builds** - Optimized image sizes
- ✅ **Health checks** - Automatic service monitoring
- ✅ **Network isolation** - Secure internal communication
- ✅ **Volume persistence** - Data survives container restarts

---

## 🚀 Quick Start (1 Command!)

### **Deploy Everything**
```bash
cd d:\SOA\LibraryDS
docker-compose up -d
```

That's it! The entire stack will:
1. Build backend Docker image (Maven + Java)
2. Build frontend Docker image (Node.js + Nginx)
3. Pull MySQL 8.0 image
4. Create isolated network
5. Start all services with health checks

**Access the application:**
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **MySQL**: localhost:3308

---

## 📋 Prerequisites

### **Required Software**
- ✅ Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- ✅ Docker Compose (usually included with Docker Desktop)

### **Check Installation**
```bash
docker --version
# Docker version 24.0.0 or higher

docker-compose --version
# Docker Compose version 2.20.0 or higher
```

### **System Requirements**
- **RAM**: 4 GB minimum (8 GB recommended)
- **Disk Space**: 5 GB free space
- **Ports**: 80, 8080, 3308 must be available

---

## 🏗️ Project Structure

```
LibraryDS/
├── docker-compose.yml          # Main orchestration file
├── .env                        # Environment variables
├── .env.example                # Template for .env
├── .dockerignore               # Root ignore file
│
├── SBP1/                       # Backend
│   ├── Dockerfile              # Backend container config
│   ├── .dockerignore           # Backend ignore file
│   └── src/...
│
└── front/                      # Frontend
    ├── Dockerfile              # Frontend container config
    ├── nginx.conf              # Nginx web server config
    ├── .dockerignore           # Frontend ignore file
    └── src/...
```

---

## 🔧 Configuration Files Explained

### **1. docker-compose.yml**

The main orchestration file that defines all services:

```yaml
services:
  mysql:        # Database (port 3308:3306)
  backend:      # Spring Boot API (port 8080)
  frontend:     # React + Nginx (port 80)

networks:
  library-network: # Isolated network for services

volumes:
  mysql_data:   # Persistent storage for database
```

**Key Features:**
- Service dependencies (backend waits for mysql)
- Health checks for each service
- Environment variable injection
- Volume mounting for data persistence
- Network isolation for security

### **2. .env File**

Environment variables for all services:

```properties
# MySQL Configuration
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=librarydb
MYSQL_USER=library
MYSQL_PASSWORD=root

# Backend Configuration
SHOW_SQL=false
```

**Usage:**
- Copy `.env.example` to `.env` before deploying
- Modify values as needed
- Never commit `.env` to Git (contains passwords)

### **3. Backend Dockerfile (SBP1/Dockerfile)**

Multi-stage build for Spring Boot:

```dockerfile
# Stage 1: Build (Maven + Java 17)
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime (JRE only)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Benefits:**
- Small final image (~200 MB vs ~800 MB)
- Fast startup time
- Production-ready JRE only
- Build cache optimization

### **4. Frontend Dockerfile (front/Dockerfile)**

Multi-stage build for React:

```dockerfile
# Stage 1: Build (Node.js 18)
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve (Nginx)
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

**Benefits:**
- Tiny final image (~25 MB)
- Production-optimized Nginx
- Gzip compression enabled
- Static file caching
- API proxying to backend

### **5. Nginx Configuration (front/nginx.conf)**

Configures the web server:

```nginx
# Serve React app
location / {
    try_files $uri /index.html;  # SPA routing
}

# Proxy API calls to backend
location /api/ {
    proxy_pass http://backend:8080/api/;
}
```

**Features:**
- React Router support (SPA mode)
- API request proxying to backend
- Security headers (XSS, frame options)
- Gzip compression
- Static asset caching
- Health check endpoint

---

## 🎯 Docker Commands Reference

### **Start Everything**
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### **Stop & Clean**
```bash
# Stop all services
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove containers + volumes (deletes database!)
docker-compose down -v

# Remove containers + images
docker-compose down --rmi all
```

### **Rebuild Services**
```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend

# Force rebuild (no cache)
docker-compose build --no-cache

# Rebuild and restart
docker-compose up -d --build
```

### **Service Management**
```bash
# Restart specific service
docker-compose restart backend

# Scale service (e.g., 3 backend instances)
docker-compose up -d --scale backend=3

# View running containers
docker-compose ps

# View resource usage
docker stats
```

### **Debugging**
```bash
# Execute command in running container
docker-compose exec backend bash
docker-compose exec mysql mysql -u library -p

# View container details
docker inspect library-backend

# Copy files from container
docker cp library-backend:/app/logs ./logs
```

---

## 🔍 Health Checks

All services have health checks configured:

### **MySQL Health Check**
```bash
docker-compose exec mysql mysqladmin ping -h localhost -u root -p
```

### **Backend Health Check**
```bash
curl http://localhost:8080/actuator/health
```

### **Frontend Health Check**
```bash
curl http://localhost/health
```

### **View Health Status**
```bash
docker-compose ps
# Look for "healthy" status
```

---

## 🌐 Networking

Services communicate via internal Docker network:

```
┌─────────────────────────────────────────┐
│        library-network (bridge)         │
│                                         │
│  ┌─────────┐  ┌─────────┐  ┌────────┐ │
│  │ Frontend│  │ Backend │  │  MySQL │ │
│  │  :80    │←─│  :8080  │←─│  :3306 │ │
│  └────┬────┘  └─────────┘  └────────┘ │
└───────┼──────────────────────────────────┘
        │
    Host Ports
    :80, :8080, :3308
```

**Internal DNS:**
- Services can reach each other by name (e.g., `http://backend:8080`)
- No need for IP addresses
- Isolated from other Docker networks

---

## 💾 Data Persistence

### **MySQL Data Volume**

Database data is stored in Docker volume:

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect libraryds_mysql_data

# Backup database
docker-compose exec mysql mysqldump -u library -p librarydb > backup.sql

# Restore database
docker-compose exec -T mysql mysql -u library -p librarydb < backup.sql
```

**Location:**
- Windows: `C:\ProgramData\Docker\volumes\libraryds_mysql_data`
- Linux: `/var/lib/docker/volumes/libraryds_mysql_data`

---

## 🔒 Security Considerations

### **Production Checklist**
- [ ] Change default passwords in `.env`
- [ ] Use strong MYSQL_ROOT_PASSWORD
- [ ] Don't expose MySQL port (3308) in production
- [ ] Enable HTTPS (add SSL certificates to Nginx)
- [ ] Use Docker secrets for sensitive data
- [ ] Run containers as non-root user
- [ ] Enable Docker content trust
- [ ] Regular security updates

### **Secure .env File**
```bash
# Restrict permissions (Linux/Mac)
chmod 600 .env

# Add to .gitignore
echo ".env" >> .gitignore
```

---

## 🐛 Troubleshooting

### **Problem: Port Already in Use**

**Error:** `Bind for 0.0.0.0:80 failed: port is already allocated`

**Solution:**
```bash
# Find process using port
netstat -ano | findstr :80

# Kill process
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
ports:
  - "8080:80"  # Use port 8080 instead
```

### **Problem: Backend Can't Connect to MySQL**

**Symptoms:** Backend container crashes, logs show connection errors

**Solutions:**
1. Wait for MySQL to be ready (health check handles this)
2. Check environment variables in docker-compose.yml
3. Verify MySQL is healthy:
   ```bash
   docker-compose ps
   # Should show "healthy" for mysql
   ```

### **Problem: Frontend Shows CORS Errors**

**Solution:**
- In Docker, Nginx proxies requests (no CORS issues)
- If still seeing errors, check `nginx.conf` proxy_pass
- Ensure backend WebConfig allows requests

### **Problem: Database Data Lost After Restart**

**Cause:** Volume not configured properly

**Solution:**
```bash
# Check volumes
docker volume ls

# If missing, recreate with compose
docker-compose down
docker-compose up -d
```

### **Problem: Build Fails - Out of Memory**

**Solution:**
```bash
# Increase Docker memory (Docker Desktop)
# Settings → Resources → Memory: 4 GB minimum

# Or build services separately
docker-compose build mysql
docker-compose build backend
docker-compose build frontend
```

### **Problem: Changes Not Reflected**

**Solution:**
```bash
# Force rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

---

## 📊 Monitoring & Logs

### **Real-time Logs**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend

# Since timestamp
docker-compose logs --since 2024-01-01T00:00:00
```

### **Container Stats**
```bash
# Resource usage (CPU, memory, network)
docker stats

# Specific container
docker stats library-backend
```

### **Health Status**
```bash
# All services
docker-compose ps

# Detailed inspection
docker inspect --format='{{.State.Health.Status}}' library-backend
```

---

## 🚀 Production Deployment

### **1. Optimize for Production**

**docker-compose.prod.yml:**
```yaml
version: '3.8'

services:
  mysql:
    # Use managed database (AWS RDS, Azure Database)
    # Remove mysql service

  backend:
    build:
      context: ./SBP1
      dockerfile: Dockerfile
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://prod-db:3306/librarydb
      SPRING_JPA_HIBERNATE_DDL_AUTO: validate  # Don't auto-update
      SPRING_JPA_SHOW_SQL: false  # Disable SQL logging
    deploy:
      replicas: 3  # Multiple instances
      resources:
        limits:
          cpus: '1'
          memory: 1G
    restart: always

  frontend:
    build:
      context: ./front
      dockerfile: Dockerfile
    ports:
      - "443:443"  # HTTPS
    deploy:
      replicas: 2
    restart: always
```

### **2. Use Docker Swarm or Kubernetes**

**Docker Swarm:**
```bash
docker swarm init
docker stack deploy -c docker-compose.prod.yml library
```

**Kubernetes:**
- Convert compose file: `kompose convert -f docker-compose.yml`
- Apply: `kubectl apply -f kubernetes/`

### **3. Enable HTTPS**

Add SSL certificates to Nginx:
```nginx
server {
    listen 443 ssl;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    # ... rest of config
}
```

### **4. Use Container Registry**

```bash
# Tag images
docker tag library-backend:latest myregistry.com/library-backend:1.0.0

# Push to registry
docker push myregistry.com/library-backend:1.0.0

# Pull on production
docker pull myregistry.com/library-backend:1.0.0
```

---

## 🎓 Best Practices

### **Development**
- Use `docker-compose.yml` for local development
- Mount volumes for hot-reload (not in this setup)
- Keep logs visible with `-f` flag
- Rebuild after code changes

### **Testing**
- Test builds locally before deploying
- Use health checks to verify services
- Test API endpoints after deployment
- Check logs for errors

### **Production**
- Use separate `docker-compose.prod.yml`
- Don't expose MySQL port externally
- Use managed databases when possible
- Implement CI/CD pipeline
- Regular backups of database
- Monitor resource usage
- Set up logging aggregation (ELK stack)

---

## 📦 Image Sizes

Optimized multi-stage builds:

| Service | Base Image | Final Size | Layers |
|---------|-----------|------------|--------|
| MySQL | mysql:8.0 | ~600 MB | Official |
| Backend | eclipse-temurin:17-jre-alpine | ~200 MB | 2 stages |
| Frontend | nginx:alpine | ~25 MB | 2 stages |

**Total**: ~825 MB (highly optimized!)

---

## 🔄 CI/CD Integration

### **GitHub Actions Example**

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build images
        run: docker-compose build
      
      - name: Push to registry
        run: |
          docker tag library-backend:latest ${{ secrets.REGISTRY }}/backend:${{ github.sha }}
          docker push ${{ secrets.REGISTRY }}/backend:${{ github.sha }}
      
      - name: Deploy to server
        run: |
          ssh user@server "docker-compose pull && docker-compose up -d"
```

---

## 📞 Quick Reference Card

```bash
# START
docker-compose up -d

# STOP
docker-compose down

# LOGS
docker-compose logs -f

# REBUILD
docker-compose up -d --build

# RESTART
docker-compose restart backend

# HEALTH
docker-compose ps

# CLEAN
docker-compose down -v --rmi all

# BACKUP DB
docker-compose exec mysql mysqldump -u library -p librarydb > backup.sql

# RESTORE DB
docker-compose exec -T mysql mysql -u library -p librarydb < backup.sql
```

---

## ✅ Deployment Checklist

Before deploying:
- [ ] Copy `.env.example` to `.env`
- [ ] Update passwords in `.env`
- [ ] Ensure Docker is running
- [ ] Check ports 80, 8080, 3308 are free
- [ ] Have at least 4 GB RAM available
- [ ] Have at least 5 GB disk space

After deploying:
- [ ] Check all containers are healthy: `docker-compose ps`
- [ ] Test frontend: http://localhost
- [ ] Test backend: http://localhost:8080/actuator/health
- [ ] Create test data (authors, publishers, books)
- [ ] Check logs for errors: `docker-compose logs`

---

## 🎉 Success!

Your Library Management System is now fully dockerized and production-ready!

**Next Steps:**
- Add more test data
- Configure HTTPS for production
- Set up automated backups
- Implement monitoring
- Deploy to cloud (AWS, Azure, GCP)

---

**Created**: December 2025  
**Docker Version**: 24.0+  
**Compose Version**: 2.20+  
**Status**: Production Ready ✅
