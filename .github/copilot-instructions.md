# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js 15 project with TypeScript, Tailwind CSS, ESLint, and shadcn/ui configured. It uses the App Router architecture and has a src directory structure.

## Tech Stack
- **Next.js 15** with App Router
- **TypeScript** for type safety  
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **ESLint** for code quality
- **Turbopack** for fast development

## Development Guidelines

### Code Standards
- Use TypeScript for all new files
- Follow ESLint configuration rules
- Use Tailwind CSS for styling
- Follow Next.js App Router conventions
- Use proper TypeScript types and interfaces

### File Structure
- Components go in `src/components/`
- UI components go in `src/components/ui/` (shadcn/ui components)
- App routes go in `src/app/`
- Utilities go in `src/lib/`
- Types go in `src/types/`

### Styling & UI
- Use Tailwind CSS classes for styling
- Use shadcn/ui components for consistent, accessible UI
- Follow mobile-first responsive design
- Use CSS modules or styled-components only when necessary
- Install new shadcn/ui components with: `npx shadcn@latest add [component-name]`

### Performance
- Use Next.js Image component for images
- Implement proper loading states
- Use React Server Components when possible
- Optimize bundle size with dynamic imports
