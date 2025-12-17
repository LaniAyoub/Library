# Docker Build and Push Script for Library Management System
# This script builds both backend and frontend images and pushes them to Docker Hub

# Configuration
$DOCKER_USERNAME = "laniayoub"
$BACKEND_IMAGE = "$DOCKER_USERNAME/library-backend"
$FRONTEND_IMAGE = "$DOCKER_USERNAME/library-frontend"
$VERSION = "latest"

# Colors for output
$GREEN = "Green"
$RED = "Red"
$YELLOW = "Yellow"
$CYAN = "Cyan"

# Helper function to print colored messages
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

# Step 1: Check if Docker is running
Write-ColorOutput $CYAN "==================================="
Write-ColorOutput $CYAN "  Library Management System"
Write-ColorOutput $CYAN "  Docker Build & Push Script"
Write-ColorOutput $CYAN "==================================="
Write-Output ""

Write-ColorOutput $YELLOW "[1/7] Checking Docker..."
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput $RED "Docker is not running. Please start Docker Desktop."
    exit 1
}
Write-ColorOutput $GREEN "Docker is running"
Write-Output ""

# Step 2: Check if logged in to Docker Hub
Write-ColorOutput $YELLOW "[2/7] Checking Docker Hub authentication..."
$dockerInfo = docker info 2>&1 | Select-String "Username"
if (-not $dockerInfo) {
    Write-ColorOutput $YELLOW "Not logged in to Docker Hub. Attempting login..."
    docker login
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput $RED "Docker login failed. Please run 'docker login' manually."
        exit 1
    }
}
Write-ColorOutput $GREEN "Authenticated with Docker Hub"
Write-Output ""

# Step 3: Build Backend Image
Write-ColorOutput $YELLOW "[3/7] Building backend image..."
Write-ColorOutput $CYAN "Image: $BACKEND_IMAGE`:$VERSION"
Write-Output ""

Set-Location "SBP1"
docker build -t "$BACKEND_IMAGE`:$VERSION" .
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput $RED "Backend build failed!"
    Set-Location ..
    exit 1
}
Set-Location ..
Write-ColorOutput $GREEN "Backend image built successfully"
Write-Output ""

# Step 4: Build Frontend Image
Write-ColorOutput $YELLOW "[4/7] Building frontend image..."
Write-ColorOutput $CYAN "Image: $FRONTEND_IMAGE`:$VERSION"
Write-Output ""

Set-Location "front"
docker build -t "$FRONTEND_IMAGE`:$VERSION" .
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput $RED "Frontend build failed!"
    Set-Location ..
    exit 1
}
Set-Location ..
Write-ColorOutput $GREEN "Frontend image built successfully"
Write-Output ""

# Step 5: List built images
Write-ColorOutput $YELLOW "[5/7] Verifying built images..."
Write-Output ""
docker images | Select-String -Pattern "library-"
Write-Output ""

# Step 6: Push Backend to Docker Hub
Write-ColorOutput $YELLOW "[6/7] Pushing backend image to Docker Hub..."
Write-Output ""

docker push "$BACKEND_IMAGE`:$VERSION"
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput $RED "Backend push failed!"
    exit 1
}
Write-ColorOutput $GREEN "Backend image pushed successfully"
Write-Output ""

# Step 7: Push Frontend to Docker Hub
Write-ColorOutput $YELLOW "[7/7] Pushing frontend image to Docker Hub..."
Write-Output ""

docker push "$FRONTEND_IMAGE`:$VERSION"
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput $RED "Frontend push failed!"
    exit 1
}
Write-ColorOutput $GREEN "Frontend image pushed successfully"
Write-Output ""

# Summary
Write-ColorOutput $GREEN "==================================="
Write-ColorOutput $GREEN "  ALL OPERATIONS COMPLETED!"
Write-ColorOutput $GREEN "==================================="
Write-Output ""
Write-ColorOutput $CYAN "Images pushed to Docker Hub:"
Write-Output "   - $BACKEND_IMAGE`:$VERSION"
Write-Output "   - $FRONTEND_IMAGE`:$VERSION"
Write-Output ""
Write-ColorOutput $CYAN "View on Docker Hub:"
Write-Output "   - https://hub.docker.com/r/$DOCKER_USERNAME/library-backend"
Write-Output "   - https://hub.docker.com/r/$DOCKER_USERNAME/library-frontend"
Write-Output ""
Write-ColorOutput $CYAN "To deploy on any server:"
Write-Output "   docker pull $BACKEND_IMAGE`:$VERSION"
Write-Output "   docker pull $FRONTEND_IMAGE`:$VERSION"
Write-Output "   docker-compose -f docker-compose.prod.yml up -d"
Write-Output ""
Write-ColorOutput $GREEN "Done! All images built and pushed successfully!"
