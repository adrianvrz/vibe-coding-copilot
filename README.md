# Weather & Marine Search App

A comprehensive weather search application built with [Next.js](https://nextjs.org) and powered by the [Open-Meteo API](https://open-meteo.com/). Search for any location worldwide and get real-time weather information plus marine conditions.

## Features

- **🌍 Global Location Search**: Search for cities and locations worldwide
- **🌤️ Real-time Weather Data**: Get current temperature, humidity, wind speed and direction
- **� Marine Weather**: Wave height and sea surface temperature for coastal locations
- **�🎨 Beautiful UI**: Built with shadcn/ui components and Tailwind CSS
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **⚡ Fast Search**: Debounced search with instant results
- **🎯 TypeScript**: Fully typed for better development experience
- **🔄 Parallel Data Loading**: Weather and marine data fetched simultaneously
- **🐳 Docker Support**: Production-ready containerization with multi-stage builds
- **📦 Semantic Versioning**: Automated version management and Docker image tagging
- **🚀 Production Optimized**: Minimal Docker images with security best practices

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **ESLint** for code quality
- **Turbopack** for fast development
- **Docker** for containerization and deployment
- **Open-Meteo API** for weather data
- **Open-Meteo Marine API** for sea conditions

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the weather search app.

## Docker Development

### Quick Start with Docker

Build and run the application using Docker:

```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run
```

### Docker Commands

```bash
# Development
npm run dev                    # Start development server with Turbopack
npm run docker:run             # Run latest Docker image on port 3000
npm run docker:run:detached    # Run in background

# Building Docker Images
npm run docker:build           # Build with patch version increment
npm run docker:build:patch     # Build with patch version increment (same as above)
npm run docker:build:minor     # Build with minor version increment
npm run docker:build:major     # Build with major version increment

# Image Cleanup
npm run docker:cleanup         # Remove old images (keeps 3 most recent)
npm run docker:cleanup:dry     # Preview what would be deleted
npm run docker:cleanup:aggressive  # Keep only latest and current version

# Docker Compose
npm run compose:dev             # Start development environment with hot reload
npm run compose:prod            # Start production environment
npm run compose:prod:nginx      # Start production with Nginx reverse proxy
npm run compose:build           # Build all services
npm run compose:down            # Stop all services
```

### Docker Features

- **🏗️ Multi-stage Builds**: Optimized for production with minimal image size
- **🔒 Security**: Non-root user execution with proper permissions
- **⚡ Performance**: Efficient layer caching for faster rebuilds
- **📋 Semantic Versioning**: Automated version management with Docker tags
- **🧹 Cleanup Tools**: Easy removal of old Docker images
- **🔄 Hot Reload**: Docker Compose development environment with live updates
- **🌐 Nginx Support**: Optional reverse proxy configuration for production
- **💊 Health Checks**: Built-in health monitoring for production deployments

### Semantic Versioning & Image Management

The project includes a robust semantic versioning system for Docker images:

```bash
# Version Information
npm run version:info              # Display current version and Docker images
./scripts/version-info.sh         # Detailed version information script

# Semantic Version Bumps (with automatic Docker builds)
npm run docker:build:patch        # 1.0.0 → 1.0.1
npm run docker:build:minor        # 1.0.1 → 1.1.0  
npm run docker:build:major        # 1.1.0 → 2.0.0

# Manual version bumps (without Docker build)
npm run version:patch             # Increment patch version only
npm run version:minor             # Increment minor version only
npm run version:major             # Increment major version only
```

### Advanced Docker Image Cleanup

Comprehensive cleanup options for managing Docker images:

```bash
# Standard cleanup (keeps 3 most recent images)
npm run docker:cleanup

# Preview cleanup without deleting
npm run docker:cleanup:dry

# Aggressive cleanup (keeps only latest and current)
npm run docker:cleanup:aggressive

# Custom cleanup with specific keep count
./scripts/cleanup-docker.sh --keep 5

# Cleanup with dry run option
./scripts/cleanup-docker.sh --dry-run --keep 2

# View all cleanup options
./scripts/cleanup-docker.sh --help
```

**Cleanup Script Features:**
- 🔍 **Dry Run Mode**: Preview what will be deleted without making changes
- 🎯 **Selective Cleanup**: Keep a specified number of recent images
- 🗑️ **Aggressive Mode**: Remove all but the absolute essentials
- 📊 **Detailed Output**: Shows image sizes and tags being removed
- ⚠️ **Safe Defaults**: Protects current and latest tagged images

## How to Use

1. **Search for a Location**: Type in the search box to find cities and locations
2. **Select a Location**: Click on any search result to see weather details
3. **View Weather Data**: See current temperature, humidity, wind speed, and more
4. **Marine Conditions**: For coastal locations, view wave height and sea temperature
5. **Try Different Locations**: Search for multiple locations to compare conditions

## Marine Weather

The app automatically fetches marine weather data for selected locations, including:
- **Wave Height**: Current wave conditions with descriptive labels
- **Sea Surface Temperature**: Water temperature at the surface
- **Visual Indicators**: Emoji-based icons showing sea conditions

Marine data is available for most coastal and oceanic locations worldwide.

## API Information

This app uses the [Open-Meteo API](https://open-meteo.com/), which provides:
- Free weather data without API key
- Global coverage with accurate forecasts
- High-resolution weather models
- Marine weather data for coastal locations
- No rate limits for reasonable use

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deployment Options

### Docker Deployment

The application is production-ready with optimized Docker containers:

```bash
# Build production image
npm run docker:build

# Run in production
docker run -p 3000:3000 vibe-coding-copilot:latest
```

**Docker Image Features:**
- Multi-stage build for minimal size (~317MB)
- Alpine Linux base for security
- Non-root user execution
- Standalone Next.js output for optimal performance

### Docker Compose Environments

The project includes multiple Docker Compose configurations:

#### Development Environment
```bash
npm run compose:dev
```
- **Hot Reload**: Live code changes reflected instantly
- **Volume Mounting**: Source code mounted for development
- **Debug Support**: Development server with full debugging capabilities
- **Port**: Exposed on `http://localhost:3000`

#### Production Environment
```bash
npm run compose:prod
```
- **Optimized Build**: Uses production Docker image
- **Environment Variables**: Production-ready configuration
- **Health Checks**: Automatic service health monitoring
- **Restart Policy**: Automatic restart on failure

#### Production with Nginx
```bash
npm run compose:prod:nginx
```
- **Reverse Proxy**: Nginx fronting the Next.js application
- **SSL Ready**: Configured for SSL termination
- **Load Balancing**: Ready for horizontal scaling
- **Static Assets**: Optimized static file serving
- **Ports**: Nginx on `http://localhost:80`, Next.js on internal network

**Compose Services:**
- 🌐 **web**: Next.js application service
- 🔀 **nginx**: Reverse proxy (production with nginx only)
- 📊 **health**: Health check monitoring
- 🔄 **auto-restart**: Automatic service recovery

### Vercel Deployment

Deploy directly to Vercel for serverless hosting:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/vibe-coding-copilot)

### Other Deployment Options

- **AWS ECS/Fargate**: Use the Docker image for container orchestration
- **Google Cloud Run**: Deploy the containerized application
- **DigitalOcean App Platform**: Deploy directly from repository
- **Railway**: One-click deployment with automatic HTTPS

## Learn More

### Next.js Resources

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Project Resources

- [Open-Meteo API Documentation](https://open-meteo.com/en/docs) - Weather API documentation
- [shadcn/ui Components](https://ui.shadcn.com/) - UI component library
- [Docker Documentation](https://docs.docker.com/) - Containerization guide
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework

## Development

### Project Structure

```
vibe-coding-copilot/
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript type definitions
├── scripts/               # Build and deployment scripts
│   ├── build-docker.sh   # Semantic versioning & Docker build automation
│   ├── cleanup-docker.sh # Docker image cleanup with advanced options
│   └── version-info.sh   # Version information and Docker image listing
├── Dockerfile            # Multi-stage Docker build configuration
├── docker-compose.yml    # Docker Compose for development and production
├── nginx.conf            # Nginx reverse proxy configuration
└── VERSION               # Current semantic version file
```

### Docker Architecture Deep Dive

The Dockerfile implements a sophisticated multi-stage build process:

#### Stage 1: Dependencies (`deps`)
```dockerfile
FROM node:20-alpine AS deps
# Installs only production dependencies
# Uses alpine for minimal base image size
# Leverages Docker layer caching for npm packages
```

#### Stage 2: Builder (`builder`)
```dockerfile
FROM node:20-alpine AS builder
# Copies source code and builds the Next.js application
# Generates optimized production bundle
# Creates standalone output for minimal runtime dependencies
```

#### Stage 3: Runner (`runner`)
```dockerfile
FROM node:20-alpine AS runner
# Creates non-root user for security
# Copies only necessary files from builder stage
# Configures production environment
# Exposes port 3000 with health checks
```

**Key Optimizations:**
- 📦 **Layer Caching**: Dependencies installed separately for faster rebuilds
- 🎯 **Standalone Build**: Next.js standalone output reduces runtime dependencies
- 🔒 **Security**: Non-root user with minimal permissions
- 📏 **Size**: Final image ~317MB (compared to ~1.2GB unoptimized)
- 🚀 **Performance**: Optimized for fast startup and low memory usage

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test them
4. Build and test the Docker image: `npm run docker:build`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

### Docker Best Practices & Troubleshooting

#### Image Management Best Practices
```bash
# Regular cleanup to save disk space
npm run docker:cleanup

# Monitor image sizes
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Check running containers
docker ps -a

# View container logs
docker logs <container-name>
```

#### Common Docker Issues & Solutions

**Port Already in Use:**
```bash
# Find process using port 3000
lsof -i :3000

# Stop existing container
docker stop vibe-coding-copilot

# Or use different port
docker run -p 3001:3000 vibe-coding-copilot:latest
```

**Build Cache Issues:**
```bash
# Force rebuild without cache
docker build --no-cache -t vibe-coding-copilot:latest .

# Clean build cache
docker builder prune
```

**Container Won't Start:**
```bash
# Check container logs
docker logs vibe-coding-copilot

# Run interactively for debugging
docker run -it vibe-coding-copilot:latest sh
```

**Disk Space Management:**
```bash
# Check Docker disk usage
docker system df

# Aggressive cleanup (removes unused images, containers, networks)
docker system prune -a

# Custom cleanup keeping recent images
npm run docker:cleanup:aggressive
```

#### Performance Tips
- 🚀 **Use .dockerignore**: Exclude unnecessary files from build context
- 📦 **Layer Caching**: Order Dockerfile commands from least to most frequently changed
- 🎯 **Multi-stage Builds**: Separate build and runtime dependencies
- 🔄 **Health Checks**: Monitor application health in production
- 📊 **Resource Limits**: Set appropriate memory and CPU limits for containers

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
