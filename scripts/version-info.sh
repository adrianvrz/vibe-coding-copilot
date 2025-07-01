#!/bin/bash

# Script to check current version and Docker images
# Usage: ./scripts/version-info.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

IMAGE_NAME="vibe-coding-copilot"
VERSION_FILE="VERSION"

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo "📋 Version Information"
echo "====================="

# Current version from file
if [ -f "$VERSION_FILE" ]; then
    current_version=$(cat "$VERSION_FILE")
    print_success "Current version: $current_version"
else
    print_warning "No VERSION file found. Run docker:build to create one."
fi

# Package.json version
if [ -f "package.json" ]; then
    package_version=$(grep '"version"' package.json | sed 's/.*"version": "\(.*\)".*/\1/')
    print_info "Package.json version: $package_version"
fi

# Docker images
echo ""
echo "🐳 Docker Images"
echo "==============="

if command -v docker &> /dev/null; then
    images=$(docker images "${IMAGE_NAME}" --format "table {{.Repository}}\t{{.Tag}}\t{{.CreatedAt}}\t{{.Size}}" 2>/dev/null)
    
    if [ -n "$images" ]; then
        echo "$images"
    else
        print_warning "No Docker images found for ${IMAGE_NAME}"
        echo "   Run 'npm run docker:build' to create images"
    fi
else
    print_warning "Docker not available"
fi

# Git information (if available)
if command -v git &> /dev/null && git rev-parse --git-dir > /dev/null 2>&1; then
    echo ""
    echo "📊 Git Information"
    echo "=================="
    git_branch=$(git branch --show-current 2>/dev/null || echo "detached")
    git_commit=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    git_status=$(git status --porcelain 2>/dev/null)
    
    print_info "Branch: $git_branch"
    print_info "Commit: $git_commit"
    
    if [ -n "$git_status" ]; then
        print_warning "Working directory has uncommitted changes"
    else
        print_success "Working directory is clean"
    fi
fi

echo ""
echo "🚀 Available Commands"
echo "===================="
echo "npm run docker:build        - Build with patch version bump"
echo "npm run docker:build:minor  - Build with minor version bump"
echo "npm run docker:build:major  - Build with major version bump"
echo "npm run docker:run          - Run the latest image"
echo "npm run docker:run:detached - Run in background"
