# 🪟 Windows-Specific Docker Setup Guide

## Prerequisites for Windows

### **1. Install Docker Desktop**

1. Download from: https://www.docker.com/products/docker-desktop/
2. Run installer
3. Restart computer
4. Start Docker Desktop
5. Wait for "Docker Desktop is running" message

### **2. Enable WSL 2 (Windows Subsystem for Linux)**

Docker Desktop on Windows requires WSL 2.

**Check if WSL 2 is enabled:**
```powershell
wsl --list --verbose
```

**If not installed, run in PowerShell (as Administrator):**
```powershell
wsl --install
wsl --set-default-version 2
```

**Restart computer** after installing WSL 2.

### **3. Configure Docker Desktop**

1. Open Docker Desktop
2. Go to **Settings** → **Resources** → **Advanced**
3. Set resources:
   - **CPUs**: 2 minimum (4 recommended)
   - **Memory**: 4 GB minimum (8 GB recommended)
   - **Disk**: 20 GB minimum
4. Click **Apply & Restart**

---

## Windows-Specific Commands

### **PowerShell Commands**

```powershell
# Navigate to project
cd d:\SOA\LibraryDS

# Copy environment file
copy .env.example .env

# Start Docker services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Check what's using a port
netstat -ano | findstr :80

# Kill process by PID
taskkill /PID 1234 /F
```

### **Command Prompt Commands**

```cmd
cd d:\SOA\LibraryDS
copy .env.example .env
docker-compose up -d
docker-compose logs -f
docker-compose down
```

---

## Common Windows Issues & Solutions

### **Issue 1: "Docker Desktop is not running"**

**Symptoms:**
```
error during connect: This error may indicate that the docker daemon is not running
```

**Solution:**
1. Open Docker Desktop application
2. Wait for it to fully start (whale icon in system tray)
3. Check system tray: Docker icon should be solid (not animated)
4. Run command again

---

### **Issue 2: WSL 2 Not Installed**

**Symptoms:**
```
Docker Desktop requires WSL 2
```

**Solution:**
```powershell
# Run as Administrator
wsl --install
wsl --set-default-version 2

# Restart computer
shutdown /r /t 0
```

---

### **Issue 3: Port Already in Use**

**Symptoms:**
```
Error starting userland proxy: listen tcp4 0.0.0.0:80: bind: Only one usage of each socket address
```

**Solution:**

**Find what's using the port:**
```powershell
netstat -ano | findstr :80
```

**Output example:**
```
TCP    0.0.0.0:80    0.0.0.0:0    LISTENING    4532
```

**Kill the process:**
```powershell
taskkill /PID 4532 /F
```

**Or change the port in docker-compose.yml:**
```yaml
frontend:
  ports:
    - "8080:80"  # Change from 80 to 8080
```

---

### **Issue 4: Hyper-V Not Enabled**

**Symptoms:**
```
Hardware assisted virtualization and data execution protection must be enabled in the BIOS
```

**Solution:**
1. Restart computer
2. Enter BIOS (usually F2, F10, or Del during boot)
3. Find "Virtualization Technology" or "Intel VT-x" or "AMD-V"
4. Enable it
5. Save and exit BIOS

**Enable Hyper-V in Windows:**
```powershell
# Run as Administrator
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All

# Restart
shutdown /r /t 0
```

---

### **Issue 5: Drive Not Shared**

**Symptoms:**
```
Error response from daemon: drive sharing failed
```

**Solution:**
1. Open Docker Desktop
2. Settings → Resources → File Sharing
3. Add `d:\SOA\LibraryDS`
4. Click Apply & Restart

---

### **Issue 6: Line Ending Issues (CRLF vs LF)**

**Symptoms:**
```
exec format error
```

**Solution:**

Git might have converted LF to CRLF. Configure Git:
```powershell
# Don't convert line endings
git config --global core.autocrlf false

# Re-clone or checkout files
git checkout .
```

**For shell scripts in containers:**
- Use LF (Unix) line endings, not CRLF (Windows)
- Configure your editor (VS Code, Notepad++) to use LF

---

### **Issue 7: Docker Compose Not Found**

**Symptoms:**
```
'docker-compose' is not recognized as an internal or external command
```

**Solution:**

Docker Desktop should include Docker Compose. Try:
```powershell
# New syntax (Docker Compose V2)
docker compose up -d

# Old syntax (Docker Compose V1)
docker-compose up -d
```

If still not working:
1. Restart Docker Desktop
2. Update Docker Desktop to latest version

---

### **Issue 8: Firewall Blocking Containers**

**Symptoms:**
- Containers can't reach each other
- Can't access containers from browser

**Solution:**

**Allow Docker in Windows Firewall:**
1. Open **Windows Defender Firewall**
2. Click **Allow an app through firewall**
3. Find **Docker Desktop**
4. Check both **Private** and **Public**
5. Click OK

**Or disable firewall temporarily for testing:**
```powershell
# As Administrator
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False

# Re-enable after testing
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

---

### **Issue 9: Out of Disk Space**

**Symptoms:**
```
no space left on device
```

**Solution:**

**Clean Docker:**
```powershell
# Remove stopped containers
docker container prune -f

# Remove unused images
docker image prune -a -f

# Remove unused volumes
docker volume prune -f

# Remove everything (nuclear option)
docker system prune -a -f --volumes
```

**Increase Docker disk allocation:**
1. Docker Desktop → Settings → Resources → Advanced
2. Increase **Disk image size**
3. Apply & Restart

---

### **Issue 10: Slow Build Times**

**Symptoms:**
- Docker build takes forever
- npm install hangs

**Solution:**

**Disable antivirus for Docker directories:**
1. Add exceptions for:
   - `C:\ProgramData\Docker`
   - `C:\Users\[YourUser]\.docker`
   - Your project directory

**Use BuildKit:**
```powershell
# Enable BuildKit for faster builds
$env:DOCKER_BUILDKIT=1
docker-compose build
```

**Increase Docker resources:**
- Settings → Resources → Advanced
- Increase CPUs and Memory

---

### **Issue 11: Can't Access localhost**

**Symptoms:**
- `http://localhost` doesn't work
- Connection refused

**Solution:**

**Try these alternatives:**
```
http://localhost
http://127.0.0.1
http://host.docker.internal
```

**Check if containers are running:**
```powershell
docker-compose ps
# All should show "Up" and "healthy"
```

**Check port mapping:**
```powershell
docker ps
# Look for PORT column: 0.0.0.0:80->80/tcp
```

---

### **Issue 12: Backend Can't Connect to MySQL**

**Symptoms:**
```
Communications link failure
```

**Solution:**

**Wait for MySQL to be healthy:**
```powershell
# Check health status
docker-compose ps

# Should show "healthy" for mysql
# If "starting" or "unhealthy", wait 30 seconds and check again
```

**View MySQL logs:**
```powershell
docker-compose logs mysql
```

**Restart in order:**
```powershell
docker-compose restart mysql
timeout /t 30
docker-compose restart backend
```

---

## Windows Performance Tips

### **1. Use WSL 2 Backend (Not Hyper-V)**
Docker Desktop → Settings → General → "Use WSL 2 based engine"

### **2. Store Code in WSL 2 Filesystem**
For better performance:
```powershell
# Access WSL 2 filesystem
\\wsl$\Ubuntu\home\youruser\projects\LibraryDS
```

### **3. Exclude from Windows Defender**
Add to exclusions:
- `C:\ProgramData\Docker`
- `C:\Users\YourUser\.docker`
- Your project directory

### **4. Disable Real-time Scanning for Docker**
Windows Security → Virus & threat protection → Settings → Exclusions

### **5. Use SSD for Docker Data**
Docker Desktop → Settings → Resources → Advanced → Disk image location

---

## Useful Windows Commands

### **Check Docker Status**
```powershell
# Is Docker running?
docker version

# Docker info
docker info

# List running containers
docker ps

# List all containers
docker ps -a
```

### **Resource Monitoring**
```powershell
# Container resource usage
docker stats

# System disk usage
docker system df
```

### **Network Debugging**
```powershell
# Test connectivity
Test-NetConnection localhost -Port 80
Test-NetConnection localhost -Port 8080
Test-NetConnection localhost -Port 3308

# List Docker networks
docker network ls

# Inspect network
docker network inspect libraryds_library-network
```

---

## Windows Path Issues

### **Using Windows Paths in Docker**

In `docker-compose.yml` or `.env`, use:
```yaml
# Windows style (works in PowerShell)
volumes:
  - d:/SOA/LibraryDS/data:/data

# Or Unix style (preferred)
volumes:
  - /d/SOA/LibraryDS/data:/data
```

### **Accessing WSL from Windows**
```
\\wsl$\Ubuntu\home\youruser\
```

### **Accessing Windows from WSL**
```bash
/mnt/c/Users/YourUser/
/mnt/d/SOA/LibraryDS/
```

---

## Quick Diagnostic Script

Save as `check-docker.ps1` and run in PowerShell:

```powershell
# Docker Desktop Check Script

Write-Host "Checking Docker Desktop..." -ForegroundColor Cyan

# Check if Docker is running
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Start Docker Desktop!" -ForegroundColor Red
    exit 1
}

# Check WSL 2
$wsl = wsl --list --verbose
Write-Host "`nWSL Distributions:" -ForegroundColor Cyan
Write-Host $wsl

# Check ports
Write-Host "`nChecking ports..." -ForegroundColor Cyan
$ports = @(80, 8080, 3308)
foreach ($port in $ports) {
    $inUse = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($inUse) {
        Write-Host "❌ Port $port is in use" -ForegroundColor Red
    } else {
        Write-Host "✅ Port $port is free" -ForegroundColor Green
    }
}

# Check Docker Compose
Write-Host "`nChecking Docker Compose..." -ForegroundColor Cyan
try {
    docker-compose version
    Write-Host "✅ Docker Compose is available" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Try: docker compose version" -ForegroundColor Yellow
}

# Check resources
Write-Host "`nDocker Resources:" -ForegroundColor Cyan
docker system df

Write-Host "`nAll checks complete!" -ForegroundColor Green
```

Run it:
```powershell
.\check-docker.ps1
```

---

## Summary: Complete Windows Setup

### **Step-by-Step Setup**

1. **Install Docker Desktop**
   - Download and install
   - Enable WSL 2
   - Restart computer

2. **Configure Docker Desktop**
   - 4 GB RAM minimum
   - 2 CPUs minimum
   - Enable file sharing for `d:\SOA\LibraryDS`

3. **Open PowerShell**
   ```powershell
   cd d:\SOA\LibraryDS
   ```

4. **Copy environment file**
   ```powershell
   copy .env.example .env
   ```

5. **Start services**
   ```powershell
   docker-compose up -d
   ```

6. **Check status**
   ```powershell
   docker-compose ps
   ```

7. **View logs**
   ```powershell
   docker-compose logs -f
   ```

8. **Access application**
   - Frontend: http://localhost
   - Backend: http://localhost:8080

9. **Stop when done**
   ```powershell
   docker-compose down
   ```

---

**Windows is fully supported! Follow this guide for smooth Docker deployment on Windows. 🪟🐳**
