// Open-Meteo API types
export interface GeocodeResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id?: number;
  admin2_id?: number;
  admin3_id?: number;
  admin4_id?: number;
  timezone: string;
  population?: number;
  postcodes?: string[];
  country_id: number;
  country: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
}

export interface GeocodeResponse {
  results?: GeocodeResult[];
  generationtime_ms: number;
}

export interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  current_units: {
    time: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    weather_code: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
  };
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: WeatherData['current_units'];
  current: WeatherData['current'];
}

export interface MarineWeatherData {
  current: {
    time: string;
    wave_height: number;
    sea_surface_temperature: number;
  };
  current_units: {
    time: string;
    wave_height: string;
    sea_surface_temperature: string;
  };
}

export interface MarineWeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  current_units: MarineWeatherData['current_units'];
  current: MarineWeatherData['current'];
}
