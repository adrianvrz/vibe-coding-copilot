#!/bin/bash

# Docker build script with semantic versioning
# Usage: ./scripts/build-docker.sh [patch|minor|major|custom_version]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="vibe-coding-copilot"
VERSION_FILE="VERSION"
DOCKERFILE="Dockerfile"

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to get current version
get_current_version() {
    if [ -f "$VERSION_FILE" ]; then
        cat "$VERSION_FILE"
    else
        echo "0.0.0"
    fi
}

# Function to increment version
increment_version() {
    local version=$1
    local increment_type=$2
    
    IFS='.' read -ra VERSION_PARTS <<< "$version"
    local major=${VERSION_PARTS[0]}
    local minor=${VERSION_PARTS[1]}
    local patch=${VERSION_PARTS[2]}
    
    case $increment_type in
        "major")
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        "minor")
            minor=$((minor + 1))
            patch=0
            ;;
        "patch")
            patch=$((patch + 1))
            ;;
        *)
            echo "$increment_type"
            return
            ;;
    esac
    
    echo "${major}.${minor}.${patch}"
}

# Function to validate semantic version
validate_version() {
    local version=$1
    if [[ $version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        return 0
    else
        return 1
    fi
}

# Main script
main() {
    local increment_type=${1:-"patch"}
    
    print_info "Starting Docker build with semantic versioning..."
    
    # Get current version
    local current_version=$(get_current_version)
    print_info "Current version: $current_version"
    
    # Calculate new version
    local new_version
    if validate_version "$increment_type"; then
        new_version="$increment_type"
        print_info "Using custom version: $new_version"
    else
        new_version=$(increment_version "$current_version" "$increment_type")
        print_info "Incrementing version ($increment_type): $current_version -> $new_version"
    fi
    
    # Validate new version
    if ! validate_version "$new_version"; then
        print_error "Invalid version format: $new_version"
        print_error "Version must follow semantic versioning (e.g., 1.0.0)"
        exit 1
    fi
    
    # Get build metadata
    local build_date=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local vcs_ref=""
    
    # Try to get git commit hash
    if command -v git &> /dev/null && git rev-parse --git-dir > /dev/null 2>&1; then
        vcs_ref=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    else
        vcs_ref="unknown"
    fi
    
    print_info "Build metadata:"
    print_info "  Version: $new_version"
    print_info "  Build Date: $build_date"
    print_info "  VCS Ref: $vcs_ref"
    
    # Build Docker image
    print_info "Building Docker image..."
    
    docker build \
        --build-arg VERSION="$new_version" \
        --build-arg BUILD_DATE="$build_date" \
        --build-arg VCS_REF="$vcs_ref" \
        -t "${IMAGE_NAME}:${new_version}" \
        -t "${IMAGE_NAME}:latest" \
        -f "$DOCKERFILE" \
        .
    
    if [ $? -eq 0 ]; then
        # Save new version to file
        echo "$new_version" > "$VERSION_FILE"
        
        print_success "Docker image built successfully!"
        print_success "Images created:"
        print_success "  - ${IMAGE_NAME}:${new_version}"
        print_success "  - ${IMAGE_NAME}:latest"
        print_success "Version saved to $VERSION_FILE"
        
        # Show image details
        print_info "Image details:"
        docker image inspect "${IMAGE_NAME}:${new_version}" --format='{{json .Config.Labels}}' | jq '.'
        
    else
        print_error "Docker build failed!"
        exit 1
    fi
}

# Check if required tools are available
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    print_warning "jq is not installed. Image details will not be displayed in JSON format."
fi

# Run main function
main "$@"
