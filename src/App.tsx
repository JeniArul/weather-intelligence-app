import React, { useState, useEffect } from 'react';
import { CitySearchResult, WeatherData } from './types';
import { mapWeatherData } from './utils/weatherUtils';
import CitySearch from './components/CitySearch';
import WeatherDashboard from './components/WeatherDashboard';
import { 
  CloudSun, 
  Moon, 
  Sun, 
  HelpCircle, 
  CloudRain, 
  Compass, 
  ShieldCheck, 
  ExternalLink,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<CitySearchResult | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load a default city (Chennai) on mount
  useEffect(() => {
    const defaultCity: CitySearchResult = {
      id: 1,
      name: 'Chennai',
      latitude: 13.0878,
      longitude: 80.2785,
      timezone: 'Asia/Kolkata',
      country: 'India',
    };
    handleSelectCity(defaultCity);
  }, []);

  // Main weather fetch function
  const fetchWeather = async (city: CitySearchResult) => {
    setIsLoading(true);
    setError(null);

    const lat = city.latitude;
    const lon = city.longitude;
    const timezone = city.timezone || 'auto';

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max,sunrise,sunset&timezone=${encodeURIComponent(timezone)}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Open-Meteo API returned status ${response.status}. Failed to get forecast.`);
      }

      const rawData = await response.json();
      const mapped = mapWeatherData(city.name, city.country, rawData);
      setWeatherData(mapped);
    } catch (err: any) {
      console.error('Error fetching weather data:', err);
      setError(err.message || 'Unable to retrieve forecast data from Open-Meteo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCity = (city: CitySearchResult) => {
    setSelectedCity(city);
    fetchWeather(city);
  };

  const handleRefresh = () => {
    if (selectedCity) {
      fetchWeather(selectedCity);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="app-wrapper">
      {/* SaaS Style Premium Header */}
      <header className="bg-white border-b border-slate-100 py-5 px-6 sticky top-0 z-40 shadow-xs" id="app-header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-xs flex items-center justify-center">
              <CloudSun className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                Weather Intelligence <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wide">v1.0</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">SaaS-Grade Localized Travel Planner &amp; Forecast Insights</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Frontend-Only Deployment</span>
            </div>
            <a 
              href="https://open-meteo.com" 
              target="_blank" 
              referrerPolicy="no-referrer"
              className="hover:text-indigo-600 flex items-center gap-1 transition-colors bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100"
            >
              <span>Open-Meteo Data</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6" id="app-main">
        {/* Search Engine Panel */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs" id="search-card">
          <div className="text-center max-w-lg mx-auto mb-6">
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Smart Geocoding Search
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
              Where are you traveling next?
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Enter any city worldwide to run our localized planning rules and generate a custom suitabilty card.
            </p>
          </div>
          <CitySearch onSelectCity={handleSelectCity} isLoading={isLoading} />
        </div>

        {/* Loading Skeleton Panel */}
        {isLoading && (
          <div className="w-full flex flex-col gap-6 animate-pulse" id="loading-skeleton">
            {/* Hero skeleton */}
            <div className="h-64 bg-slate-200 rounded-3xl" />
            {/* Grid skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="h-20 bg-slate-200 rounded-2xl" />
              <div className="h-20 bg-slate-200 rounded-2xl" />
              <div className="h-20 bg-slate-200 rounded-2xl" />
              <div className="h-20 bg-slate-200 rounded-2xl" />
            </div>
            {/* Content skeleton */}
            <div className="h-40 bg-slate-200 rounded-3xl" />
          </div>
        )}

        {/* Error Notification Card */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex flex-col items-center text-center max-w-md mx-auto" id="app-error-card">
            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-red-950 mt-4">Unable to fetch forecast</h3>
            <p className="text-xs text-red-700 mt-1 leading-relaxed">
              {error}
            </p>
            {selectedCity && (
              <button
                type="button"
                id="retry-fetch-btn"
                onClick={handleRefresh}
                className="mt-5 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry connection
              </button>
            )}
          </div>
        )}

        {/* Main Weather Intelligence Output */}
        {weatherData && !isLoading && !error && (
          <div className="flex flex-col gap-6 relative" id="dashboard-container">
            {/* Float refresh btn */}
            <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20">
              <button
                type="button"
                id="refresh-weather-btn"
                onClick={handleRefresh}
                className="p-2.5 bg-white/20 backdrop-blur-md border border-white/25 hover:bg-white/30 text-white rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1 text-xs font-bold"
                title="Refresh Weather Data"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                <span className="hidden sm:inline">Refresh metrics</span>
              </button>
            </div>
            <WeatherDashboard weather={weatherData} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-6 mt-16 border-t border-slate-800" id="app-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-800 text-indigo-400 rounded-lg">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-100">Weather Intelligence App</p>
              <p className="text-xs text-slate-500">100% Client-Side Pure Weather Intelligence</p>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2 text-xs">
            <div className="flex items-center gap-2 text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Deployable on Cloudflare Pages or any Static Host</span>
            </div>
            <p className="text-slate-500">
              All weather recommendations are locally compiled inside the browser sandbox. No user telemetry tracked.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
