'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { searchLocations, getWeatherData, getMarineWeatherData, getWeatherDescription, getWeatherIcon, getWaveHeightDescription, getWaveIcon, getSeaTemperatureIcon } from '@/lib/weather';
import { GeocodeResult, WeatherResponse, MarineWeatherResponse } from '@/types/weather';

export default function WeatherSearch() {
  const [query, setQuery] = useState('');
  const [locations, setLocations] = useState<GeocodeResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<GeocodeResult | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [marineData, setMarineData] = useState<MarineWeatherResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isLoadingMarine, setIsLoadingMarine] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setLocations([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      setError(null);
      try {
        const response = await searchLocations(query);
        setLocations(response.results || []);
        setShowResults(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        setError('Failed to search locations. Please try again.');
        setLocations([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleLocationSelect = async (location: GeocodeResult) => {
    setSelectedLocation(location);
    setShowResults(false);
    setIsLoadingWeather(true);
    setIsLoadingMarine(true);
    setError(null);
    setMarineData(null); // Reset marine data
    
    try {
      // Fetch weather data first (always required)
      try {
        const weather = await getWeatherData(location.latitude, location.longitude);
        setWeatherData(weather);
      } catch {
        setError('Failed to fetch weather data. Please try again.');
        setWeatherData(null);
      }

      // Try to fetch marine data (optional)
      try {
        const marine = await getMarineWeatherData(location.latitude, location.longitude);
        // Additional validation to ensure marine data is valid
        if (marine?.current?.wave_height !== undefined && 
            marine?.current?.sea_surface_temperature !== undefined) {
          setMarineData(marine);
        } else {
          setMarineData(null);
        }
      } catch (marineError) {
        // Marine data not available for this location (expected for inland areas)
        console.log('Marine data not available:', marineError);
        setMarineData(null);
      }
    } catch (generalError) {
      console.error('Unexpected error:', generalError);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoadingWeather(false);
      setIsLoadingMarine(false);
    }
  };

  const formatLocationName = (location: GeocodeResult) => {
    let name = location.name;
    if (location.admin1) name += `, ${location.admin1}`;
    if (location.country) name += `, ${location.country}`;
    return name;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Weather & Marine Search
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Search for any location worldwide and get current weather conditions plus marine data
          </p>
        </div>

        {/* Search Section */}
        <div className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for a city or location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50 shadow-lg">
              <CardContent className="p-0">
                {isSearching ? (
                  <div className="p-4 space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                ) : locations.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    {locations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleLocationSelect(location)}
                        className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{formatLocationName(location)}</div>
                            {location.population && (
                              <div className="text-sm text-gray-500">
                                Population: {location.population.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : query.length >= 2 ? (
                  <div className="p-4 text-center text-gray-500">
                    No locations found for &quot;{query}&quot;
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Weather Data Display */}
        {selectedLocation && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>{formatLocationName(selectedLocation)}</span>
              </CardTitle>
              <CardDescription>
                Coordinates: {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingWeather ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                </div>
              ) : weatherData ? (
                <div className="space-y-6">
                  {/* Main Weather Info */}
                  <div className="flex items-center justify-center space-x-6 py-6">
                    <div className="text-6xl">
                      {getWeatherIcon(weatherData.current.weather_code)}
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        {Math.round(weatherData.current.temperature_2m)}°{weatherData.current_units.temperature_2m}
                      </div>
                      <div className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                        {getWeatherDescription(weatherData.current.weather_code)}
                      </div>
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Thermometer className="h-6 w-6 mx-auto mb-2 text-red-500" />
                        <div className="text-2xl font-semibold">
                          {Math.round(weatherData.current.temperature_2m)}°
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Temperature</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <Droplets className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-semibold">
                          {weatherData.current.relative_humidity_2m}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <Wind className="h-6 w-6 mx-auto mb-2 text-green-500" />
                        <div className="text-2xl font-semibold">
                          {Math.round(weatherData.current.wind_speed_10m)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {weatherData.current_units.wind_speed_10m}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <Eye className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                        <div className="text-2xl font-semibold">
                          {Math.round(weatherData.current.wind_direction_10m)}°
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Wind Dir</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Additional Info */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary">
                      Timezone: {weatherData.timezone}
                    </Badge>
                    <Badge variant="secondary">
                      Elevation: {weatherData.elevation}m
                    </Badge>
                    <Badge variant="secondary">
                      Updated: {new Date(weatherData.current.time).toLocaleTimeString()}
                    </Badge>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Marine Weather Data Display */}
        {selectedLocation && !isLoadingMarine && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="text-2xl">🌊</div>
                <span>Marine Weather</span>
              </CardTitle>
              <CardDescription>
                {marineData 
                  ? `Current sea conditions for ${formatLocationName(selectedLocation)}`
                  : `Marine conditions for ${formatLocationName(selectedLocation)}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {marineData ? (
                <div className="space-y-6">
                  {/* Marine Weather Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">
                          {getWaveIcon(marineData.current.wave_height)}
                        </div>
                        <div className="text-3xl font-bold mb-2">
                          {marineData.current.wave_height.toFixed(1)}{marineData.current_units.wave_height}
                        </div>
                        <div className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-1">
                          Wave Height
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {getWaveHeightDescription(marineData.current.wave_height)}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">
                          {getSeaTemperatureIcon(marineData.current.sea_surface_temperature)}
                        </div>
                        <div className="text-3xl font-bold mb-2">
                          {Math.round(marineData.current.sea_surface_temperature)}°{marineData.current_units.sea_surface_temperature}
                        </div>
                        <div className="text-lg font-medium text-teal-600 dark:text-teal-400 mb-1">
                          Sea Temperature
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Surface water temperature
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Marine Info */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      🌊 Marine Data Available
                    </Badge>
                    <Badge variant="secondary">
                      Updated: {new Date(marineData.current.time).toLocaleTimeString()}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🏔️</div>
                  <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No Marine Data Available
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    This location does not have sea or ocean access. Marine weather data is only available for coastal and oceanic locations.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      🏔️ Inland Location
                    </Badge>
                    <Badge variant="secondary">
                      Try coastal cities for marine data
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Marine Weather Loading State */}
        {selectedLocation && isLoadingMarine && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="text-2xl">🌊</div>
                <span>Marine Weather</span>
              </CardTitle>
              <CardDescription>
                Checking marine conditions for {formatLocationName(selectedLocation)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Getting Started Help */}
        {!selectedLocation && !query && (
          <Card>
            <CardHeader>
              <CardTitle>🌤️ Get Started</CardTitle>
              <CardDescription>
                Enter a city name or location to get current weather and marine conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Try searching for cities (weather data):</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['New York', 'London', 'Tokyo', 'Paris', 'Denver'].map((city) => (
                      <Button
                        key={city}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuery(city)}
                      >
                        {city}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Or coastal locations (weather + marine data):</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Miami', 'San Diego', 'Barcelona', 'Nice', 'Honolulu'].map((city) => (
                      <Button
                        key={city}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuery(city)}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20"
                      >
                        🌊 {city}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <strong>Note:</strong> Marine weather data (wave height, sea temperature) is only available for coastal and oceanic locations. Inland cities will show weather data only.
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
