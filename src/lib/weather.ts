import { GeocodeResponse, WeatherResponse, MarineWeatherResponse } from '@/types/weather';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
const MARINE_API = 'https://marine-api.open-meteo.com/v1/marine';

export async function searchLocations(query: string): Promise<GeocodeResponse> {
  const response = await fetch(`${GEOCODING_API}?name=${encodeURIComponent(query)}&count=10&language=en&format=json`);
  
  if (!response.ok) {
    throw new Error('Failed to search locations');
  }
  
  return response.json();
}

export async function getWeatherData(latitude: number, longitude: number): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m',
    timezone: 'auto',
  });
  
  const response = await fetch(`${WEATHER_API}?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  
  return response.json();
}

export async function getMarineWeatherData(latitude: number, longitude: number): Promise<MarineWeatherResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'wave_height,sea_surface_temperature',
    forecast_days: '3',
    timezone: 'auto',
  });
  
  const response = await fetch(`${MARINE_API}?${params}`);
  
  if (!response.ok) {
    // Marine data might not be available for inland locations
    // Don't throw an error, let the caller handle the rejection
    throw new Error(`Marine data not available for this location (${response.status})`);
  }
  
  const data = await response.json();
  
  // Check if the response contains valid marine data
  if (!data.current || typeof data.current.wave_height !== 'number' || typeof data.current.sea_surface_temperature !== 'number') {
    throw new Error('Marine data not available for this location');
  }
  
  return data;
}

// Weather code descriptions based on WMO Weather interpretation codes
export function getWeatherDescription(code: number): string {
  const weatherCodes: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  
  return weatherCodes[code] || 'Unknown';
}

export function getWeatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code >= 1 && code <= 3) return '⛅';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 57) return '🌦️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '🌨️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95 && code <= 99) return '⛈️';
  return '🌤️';
}

export function getWaveHeightDescription(height: number): string {
  if (height < 0.5) return 'Calm';
  if (height < 1.0) return 'Small waves';
  if (height < 2.0) return 'Moderate waves';
  if (height < 3.0) return 'Large waves';
  if (height < 4.0) return 'Very large waves';
  return 'Extreme waves';
}

export function getWaveIcon(height: number): string {
  if (height < 0.5) return '〰️';
  if (height < 1.0) return '🌊';
  if (height < 2.0) return '🌊🌊';
  if (height < 3.0) return '🌊🌊🌊';
  return '🌊⚠️';
}

export function getSeaTemperatureIcon(temp: number): string {
  if (temp < 5) return '🧊';
  if (temp < 15) return '❄️';
  if (temp < 20) return '🌡️';
  if (temp < 25) return '🌊';
  return '🔥';
}
