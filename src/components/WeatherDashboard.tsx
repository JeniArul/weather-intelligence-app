import React, { useState } from 'react';
import { WeatherData, WeatherRecommendation } from '../types';
import { getWeatherCondition, generateLocalRecommendations } from '../utils/weatherUtils';
import WeatherCharts from './WeatherCharts';
import RecommendationCard from './RecommendationCard';
import { 
  Wind, 
  Droplets, 
  Sunrise, 
  Sunset, 
  Thermometer, 
  Cloud, 
  Sparkles, 
  Calendar, 
  TrendingUp,
  MapPin,
  Compass,
  ArrowUpRight,
  Sun
} from 'lucide-react';

// Explicitly safe dictionary for Lucide Weather icons
import { 
  Sun as SunIcon, 
  Moon as MoonIcon, 
  CloudSun, 
  Cloud as CloudIcon, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  Snowflake, 
  CloudLightning, 
  HelpCircle 
} from 'lucide-react';

const IconMap: Record<string, React.ComponentType<any>> = {
  Sun: SunIcon,
  Moon: MoonIcon,
  CloudSun,
  Cloud: CloudIcon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind: CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning,
  HelpCircle,
};

interface WeatherDashboardProps {
  weather: WeatherData;
}

export default function WeatherDashboard({ weather }: WeatherDashboardProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'intelligence'>('analytics');

  const { city, country, timezone, elevation, current, daily } = weather;
  const condition = getWeatherCondition(current.weatherCode, current.isDay);
  const recommendations = generateLocalRecommendations(weather);

  const WeatherIcon = IconMap[condition.iconName] || HelpCircle;

  // Formatting date strings
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' });
    } catch {
      return dateStr;
    }
  };

  const getShortDay = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    } catch {
      return dateStr;
    }
  };

  // Theme styling based on conditions
  const getThemeGradient = (color: string) => {
    switch (color) {
      case 'amber': // Hot / sunny
        return 'from-amber-500 to-orange-600 border-amber-200 text-amber-950';
      case 'sky': // Partly cloudy
        return 'from-sky-400 to-indigo-500 border-sky-200 text-sky-950';
      case 'indigo': // Clear night
        return 'from-slate-900 via-indigo-950 to-slate-900 border-indigo-900 text-indigo-50';
      case 'blue': // Rain
        return 'from-blue-500 to-indigo-600 border-blue-200 text-blue-950';
      case 'cyan': // Freezing drizzle
        return 'from-cyan-400 to-blue-500 border-cyan-200 text-cyan-950';
      case 'teal': // Snow
        return 'from-teal-400 to-cyan-600 border-teal-200 text-teal-950';
      case 'violet': // Thunderstorm
        return 'from-violet-600 to-indigo-900 border-violet-400 text-violet-50';
      case 'red': // Severe storms
        return 'from-red-600 to-rose-950 border-red-400 text-red-50';
      default: // Overcast / Fog
        return 'from-slate-400 to-zinc-600 border-slate-200 text-slate-950';
    }
  };

  const isDarkCard = ['indigo', 'violet', 'red'].includes(condition.themeColor);

  return (
    <div className="w-full flex flex-col gap-6" id="weather-dashboard-root">
      {/* 1. Dynamic Hero Condition Banner */}
      <div 
        className={`w-full rounded-3xl bg-gradient-to-br p-6 md:p-8 shadow-md border text-white transition-all duration-300 relative overflow-hidden ${getThemeGradient(condition.themeColor)}`}
        id="hero-condition-banner"
      >
        {/* Subtle background overlay circles */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Location & Main Degree */}
          <div>
            <div className="flex items-center gap-2">
              <MapPin className={`w-5 h-5 ${isDarkCard ? 'text-indigo-300' : 'text-indigo-100/80'}`} />
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {city}{country ? `, ${country}` : ''}
              </h2>
            </div>
            
            <p className={`text-xs mt-1.5 font-medium ${isDarkCard ? 'text-gray-300' : 'text-white/80'}`}>
              Elevation: <span className="font-mono">{elevation}m</span> • Timezone: <span className="font-mono">{timezone}</span>
            </p>

            <div className="flex items-baseline gap-4 mt-6">
              <span className="text-5xl md:text-7xl font-black tracking-tighter">
                {Math.round(current.temperature)}°C
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold flex items-center gap-1 opacity-90">
                  <Thermometer className="w-4 h-4 shrink-0" />
                  Feels like {Math.round(current.apparentTemperature)}°C
                </span>
                <span className="text-xs font-medium opacity-75 mt-0.5">
                  Today is {formatDate(daily[0]?.date ?? '')}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Big Status Icon & Condition description */}
          <div className="flex items-center md:flex-col md:items-end gap-4 md:text-right">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xs">
              <WeatherIcon className="w-14 h-14 md:w-16 md:h-16 text-white animate-bounce-slow" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black tracking-tight">{condition.label}</h3>
              <p className="text-xs opacity-90 mt-1 max-w-[200px] font-sans font-medium">{condition.description}</p>
            </div>
          </div>
        </div>

        {/* Highlight Quick recommendation snippet */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white/5 p-4 rounded-2xl backdrop-blur-xs">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-300 animate-pulse" />
            <span>
              <strong>Planner Highlight:</strong> {recommendations.summary}
            </span>
          </div>
          <button
            type="button"
            id="read-recs-btn"
            onClick={() => setActiveTab('intelligence')}
            className="text-xs font-bold bg-white text-indigo-950 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors shadow-xs shrink-0 self-start sm:self-auto cursor-pointer flex items-center gap-1"
          >
            Read Full Intelligence <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Weather Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="weather-metrics-grid">
        {/* Humidity */}
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Relative Humidity</div>
            <div className="text-base font-extrabold text-gray-900 mt-0.5">{current.relativeHumidity}%</div>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl animate-spin-slow">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Wind Velocity</div>
            <div className="text-base font-extrabold text-gray-900 mt-0.5">{current.windSpeed} km/h</div>
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <CloudIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cloud Cover</div>
            <div className="text-base font-extrabold text-gray-900 mt-0.5">{current.cloudCover}%</div>
          </div>
        </div>

        {/* Day Cycles / Sunrise */}
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <Sunrise className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sunrise &amp; Sunset</div>
            <div className="text-xs font-extrabold text-gray-900 mt-0.5 truncate">
              {daily[0]?.sunrise ? daily[0].sunrise.split('T')[1] : 'N/A'} • {daily[0]?.sunset ? daily[0].sunset.split('T')[1] : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section Toggles */}
      <div className="border-b border-gray-100 flex items-center gap-6 mt-2" id="dashboard-tab-navigation">
        <button
          type="button"
          id="tab-btn-analytics"
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-400 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          7-Day Forecast &amp; Trends
        </button>
        <button
          type="button"
          id="tab-btn-intelligence"
          onClick={() => setActiveTab('intelligence')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'intelligence'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-400 hover:text-gray-900'
          }`}
        >
          <Compass className="w-4 h-4" />
          Intelligence Planner recommendations
        </button>
      </div>

      {/* Tab Panels */}
      <div className="w-full" id="dashboard-tab-panels">
        {activeTab === 'analytics' ? (
          <div className="flex flex-col gap-6 animate-fade-in" id="analytics-tab-panel">
            {/* Horizontal Forecast List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3" id="forecast-cards-grid">
              {daily.map((day, idx) => {
                const dayCond = getWeatherCondition(day.weatherCode, true);
                const DayIcon = IconMap[dayCond.iconName] || HelpCircle;
                const isTodayCard = idx === 0;

                return (
                  <div 
                    key={day.date}
                    id={`forecast-card-day-${idx}`}
                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center text-center ${
                      isTodayCard 
                        ? 'bg-indigo-50/50 border-indigo-200 ring-2 ring-indigo-500/10 shadow-xs' 
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-xs'
                    }`}
                  >
                    <span className={`text-xs font-black ${isTodayCard ? 'text-indigo-700' : 'text-gray-400'}`}>
                      {isTodayCard ? 'Today' : getShortDay(day.date)}
                    </span>
                    <span className="text-[9px] text-gray-400 font-mono mt-0.5">{day.date.substring(5)}</span>
                    
                    <div className="p-2.5 bg-gray-50 rounded-xl my-3 group-hover:bg-indigo-50 transition-colors">
                      <DayIcon className={`w-6 h-6 ${isTodayCard ? 'text-indigo-600' : 'text-gray-600'}`} />
                    </div>

                    <span className="text-[11px] font-bold text-gray-800 line-clamp-1 h-4">{dayCond.label}</span>

                    <div className="flex items-center gap-1.5 mt-3 font-mono text-xs">
                      <span className="font-bold text-gray-900">{Math.round(day.tempMax)}°</span>
                      <span className="text-gray-400">{Math.round(day.tempMin)}°</span>
                    </div>

                    {/* Rain probability metric */}
                    <div className="flex items-center gap-0.5 mt-2 text-[9px] font-bold text-blue-500 bg-blue-50/50 px-2 py-0.5 rounded-sm">
                      <span>{day.precipitationProbability}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom SVG Trend Charts */}
            <WeatherCharts dailyForecast={daily} />
          </div>
        ) : (
          <div className="w-full animate-fade-in" id="intelligence-tab-panel">
            {/* Intelligence Recommendation Card */}
            <RecommendationCard recommendation={recommendations} />
          </div>
        )}
      </div>
    </div>
  );
}
