#!/bin/bash

# Docker Image Cleanup Script
# Removes old Docker images while keeping the latest versions

set -e

PROJECT_NAME="vibe-coding-copilot"

echo "[INFO] Docker Image Cleanup for $PROJECT_NAME"
echo "======================================================"

# Function to display help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --keep N        Keep the N most recent versions (default: 3)"
    echo "  --dry-run       Show what would be deleted without actually deleting"
    echo "  --all-old       Remove all versions except latest and current"
    echo "  --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Keep 3 most recent versions"
    echo "  $0 --keep 2          # Keep 2 most recent versions"
    echo "  $0 --dry-run         # Preview what would be deleted"
    echo "  $0 --all-old         # Keep only latest and current version"
}

# Default values
KEEP_COUNT=3
DRY_RUN=false
ALL_OLD=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --keep)
            KEEP_COUNT="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --all-old)
            ALL_OLD=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            echo "[ERROR] Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Get current version from VERSION file
if [ -f "VERSION" ]; then
    CURRENT_VERSION=$(cat VERSION)
    echo "[INFO] Current version: $CURRENT_VERSION"
else
    echo "[WARNING] VERSION file not found, using 'latest' as current"
    CURRENT_VERSION="latest"
fi

# Get list of all image tags except 'latest', sorted by creation date (newest first)
echo "[INFO] Scanning for $PROJECT_NAME images..."
IMAGES=$(docker images $PROJECT_NAME --format "{{.Tag}} {{.CreatedAt}}" | grep -v "^latest " | sort -k2 -r | awk '{print $1}')

if [ -z "$IMAGES" ]; then
    echo "[INFO] No tagged images found to clean up."
    exit 0
fi

echo "[INFO] Found images:"
docker images $PROJECT_NAME --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}\t{{.Size}}" | head -1
docker images $PROJECT_NAME --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}\t{{.Size}}" | tail -n +2 | sort -k4 -r

echo ""

# Convert images to array and determine what to delete
IFS=$'\n' read -d '' -r -a IMAGE_ARRAY <<< "$IMAGES" || true

if [ "$ALL_OLD" = true ]; then
    # Keep only latest and current version
    TO_DELETE=()
    for image in "${IMAGE_ARRAY[@]}"; do
        if [ "$image" != "$CURRENT_VERSION" ] && [ "$image" != "latest" ]; then
            TO_DELETE+=("$image")
        fi
    done
else
    # Keep the N most recent versions
    if [ ${#IMAGE_ARRAY[@]} -le $KEEP_COUNT ]; then
        echo "[INFO] Found ${#IMAGE_ARRAY[@]} images, keeping all (requested to keep $KEEP_COUNT)"
        exit 0
    fi
    
    # Get images to delete (skip the first KEEP_COUNT)
    TO_DELETE=("${IMAGE_ARRAY[@]:$KEEP_COUNT}")
fi

if [ ${#TO_DELETE[@]} -eq 0 ]; then
    echo "[INFO] No images to delete."
    exit 0
fi

echo "[INFO] Images to delete:"
for image in "${TO_DELETE[@]}"; do
    echo "  - $PROJECT_NAME:$image"
done

if [ "$DRY_RUN" = true ]; then
    echo ""
    echo "[DRY RUN] Would delete ${#TO_DELETE[@]} images"
    echo "[DRY RUN] Run without --dry-run to actually delete them"
    exit 0
fi

echo ""
read -p "Are you sure you want to delete these ${#TO_DELETE[@]} images? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "[INFO] Cleanup cancelled."
    exit 0
fi

echo ""
echo "[INFO] Deleting old images..."
DELETED_COUNT=0
FAILED_COUNT=0

for image in "${TO_DELETE[@]}"; do
    echo -n "  Deleting $PROJECT_NAME:$image... "
    if docker rmi "$PROJECT_NAME:$image" >/dev/null 2>&1; then
        echo "✓"
        ((DELETED_COUNT++))
    else
        echo "✗ (failed or in use)"
        ((FAILED_COUNT++))
    fi
done

echo ""
echo "[SUCCESS] Cleanup completed!"
echo "[SUCCESS] Deleted: $DELETED_COUNT images"
if [ $FAILED_COUNT -gt 0 ]; then
    echo "[WARNING] Failed to delete: $FAILED_COUNT images (may be in use)"
fi

echo ""
echo "[INFO] Remaining images:"
docker images $PROJECT_NAME --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}\t{{.Size}}"

# Optional: Clean up dangling images
echo ""
read -p "Also remove dangling images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "[INFO] Removing dangling images..."
    docker image prune -f
    echo "[SUCCESS] Dangling images removed!"
fi
