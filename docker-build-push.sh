#!/bin/bash

# Docker Build and Push Script for Library Management System
# This script builds both backend and frontend images and pushes them to Docker Hub

# Configuration
DOCKER_USERNAME="laniayoub"
BACKEND_IMAGE="$DOCKER_USERNAME/library-backend"
FRONTEND_IMAGE="$DOCKER_USERNAME/library-frontend"
VERSION="latest"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Header
echo -e "${CYAN}===================================${NC}"
echo -e "${CYAN}  Library Management System${NC}"
echo -e "${CYAN}  Docker Build & Push Script${NC}"
echo -e "${CYAN}===================================${NC}"
echo ""

# Step 1: Check if Docker is running
echo -e "${YELLOW}[1/7] Checking Docker...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Step 2: Check if logged in to Docker Hub
echo -e "${YELLOW}[2/7] Checking Docker Hub authentication...${NC}"
if ! docker info 2>&1 | grep -q "Username"; then
    echo -e "${YELLOW}⚠️  Not logged in to Docker Hub. Attempting login...${NC}"
    docker login
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Docker login failed. Please run 'docker login' manually.${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ Authenticated with Docker Hub${NC}"
echo ""

# Step 3: Build Backend Image
echo -e "${YELLOW}[3/7] Building backend image...${NC}"
echo -e "${CYAN}Image: $BACKEND_IMAGE:$VERSION${NC}"
echo ""

cd SBP1
docker build -t "$BACKEND_IMAGE:$VERSION" .
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend build failed!${NC}"
    cd ..
    exit 1
fi
cd ..
echo -e "${GREEN}✅ Backend image built successfully${NC}"
echo ""

# Step 4: Build Frontend Image
echo -e "${YELLOW}[4/7] Building frontend image...${NC}"
echo -e "${CYAN}Image: $FRONTEND_IMAGE:$VERSION${NC}"
echo ""

cd front
docker build -t "$FRONTEND_IMAGE:$VERSION" .
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    cd ..
    exit 1
fi
cd ..
echo -e "${GREEN}✅ Frontend image built successfully${NC}"
echo ""

# Step 5: List built images
echo -e "${YELLOW}[5/7] Verifying built images...${NC}"
echo ""
docker images | grep "library-"
echo ""

# Step 6: Push Backend to Docker Hub
echo -e "${YELLOW}[6/7] Pushing backend image to Docker Hub...${NC}"
echo ""

docker push "$BACKEND_IMAGE:$VERSION"
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend push failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend image pushed successfully${NC}"
echo ""

# Step 7: Push Frontend to Docker Hub
echo -e "${YELLOW}[7/7] Pushing frontend image to Docker Hub...${NC}"
echo ""

docker push "$FRONTEND_IMAGE:$VERSION"
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend push failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend image pushed successfully${NC}"
echo ""

# Summary
echo -e "${GREEN}===================================${NC}"
echo -e "${GREEN}  ✅ ALL OPERATIONS COMPLETED!${NC}"
echo -e "${GREEN}===================================${NC}"
echo ""
echo -e "${CYAN}📦 Images pushed to Docker Hub:${NC}"
echo "   • $BACKEND_IMAGE:$VERSION"
echo "   • $FRONTEND_IMAGE:$VERSION"
echo ""
echo -e "${CYAN}🌐 View on Docker Hub:${NC}"
echo "   • https://hub.docker.com/r/$DOCKER_USERNAME/library-backend"
echo "   • https://hub.docker.com/r/$DOCKER_USERNAME/library-frontend"
echo ""
echo -e "${CYAN}🚀 To deploy on any server:${NC}"
echo "   docker pull $BACKEND_IMAGE:$VERSION"
echo "   docker pull $FRONTEND_IMAGE:$VERSION"
echo "   docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo -e "${GREEN}Done! 🎉${NC}"
