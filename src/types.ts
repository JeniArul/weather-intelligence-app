export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  relativeHumidity: number;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  isDay: boolean;
}

export interface DailyForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  weatherCode: number;
  precipitationSum: number;
  precipitationProbability: number;
  windSpeedMax: number;
  windGustsMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  city: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  elevation: number;
  current: CurrentWeather;
  daily: DailyForecastDay[];
}

export interface WeatherRecommendation {
  summary: string;
  persona: string;
  outdoorSuitability: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  indoorSuitability: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  travelStatus: 'Go' | 'Caution' | 'Delay' | 'Dangerous';
  travelStatusReason: string;
  outdoorActivities: string[];
  indoorActivities: string[];
  clothingSuggestions: string[];
  healthSafetyTips: string[];
}

export interface CitySearchResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  country?: string;
  admin1?: string;
  timezone?: string;
}
