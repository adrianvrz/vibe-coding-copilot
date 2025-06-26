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

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **ESLint** for code quality
- **Turbopack** for fast development
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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
