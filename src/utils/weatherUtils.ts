import { CurrentWeather, DailyForecastDay, WeatherData, WeatherRecommendation } from '../types';

/**
 * Maps WMO weather codes to user-friendly text descriptions and visual settings.
 */
export function getWeatherCondition(code: number, isDay: boolean = true): {
  label: string;
  description: string;
  iconName: string;
  themeColor: string; // Tailwind class prefix for colors
} {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Sunny' : 'Clear',
        description: isDay ? 'Bright and sunny skies' : 'Clear, starry night skies',
        iconName: isDay ? 'Sun' : 'Moon',
        themeColor: isDay ? 'amber' : 'indigo',
      };
    case 1:
      return {
        label: 'Mainly Clear',
        description: 'Mostly clear with minimal clouds',
        iconName: isDay ? 'SunDim' : 'MoonStar',
        themeColor: isDay ? 'amber' : 'slate',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'Scattered clouds with periods of sun',
        iconName: 'CloudSun',
        themeColor: 'sky',
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Fully cloudy, grey skies',
        iconName: 'Cloud',
        themeColor: 'zinc',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        description: 'Reduced visibility due to heavy fog',
        iconName: 'CloudFog',
        themeColor: 'slate',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        description: 'Light, steady misting drizzle',
        iconName: 'CloudDrizzle',
        themeColor: 'blue',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Cold drizzle freezing upon impact',
        iconName: 'CloudSnow',
        themeColor: 'cyan',
      };
    case 61:
      return {
        label: 'Slight Rain',
        description: 'Light, gentle rain showers',
        iconName: 'CloudRain',
        themeColor: 'blue',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        description: 'Steady rain, good to carry an umbrella',
        iconName: 'CloudRain',
        themeColor: 'blue',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        description: 'Intense rain showers, potential minor flooding',
        iconName: 'CloudRainWind',
        themeColor: 'blue',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Icy cold rain with potential slick surfaces',
        iconName: 'CloudSnow',
        themeColor: 'cyan',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: 'Snowfall',
        description: 'Snow accumulation on surfaces',
        iconName: 'Snowflake',
        themeColor: 'teal',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        description: 'Passing, brief moderate-to-heavy rain showers',
        iconName: 'CloudRain',
        themeColor: 'sky',
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        description: 'Passing brief snow flurries',
        iconName: 'Snowflake',
        themeColor: 'teal',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        description: 'Active lightning strikes and thunder cracks',
        iconName: 'CloudLightning',
        themeColor: 'violet',
      };
    case 96:
    case 99:
      return {
        label: 'Severe Thunderstorm',
        description: 'Strong storms with heavy rain and hail risk',
        iconName: 'CloudLightning',
        themeColor: 'red',
      };
    default:
      return {
        label: 'Unknown',
        description: 'Atypical atmospheric conditions',
        iconName: 'HelpCircle',
        themeColor: 'gray',
      };
  }
}

/**
 * Transforms raw Open-Meteo api response into styled, application-friendly TypeScript WeatherData structure
 */
export function mapWeatherData(cityName: string, countryName: string | undefined, raw: any): WeatherData {
  const currentRaw = raw.current;
  const dailyRaw = raw.daily;

  const current: CurrentWeather = {
    temperature: currentRaw.temperature_2m,
    apparentTemperature: currentRaw.apparent_temperature,
    weatherCode: currentRaw.weather_code,
    precipitation: currentRaw.precipitation,
    rain: currentRaw.rain || 0,
    showers: currentRaw.showers || 0,
    snowfall: currentRaw.snowfall || 0,
    relativeHumidity: currentRaw.relative_humidity_2m,
    windSpeed: currentRaw.wind_speed_10m,
    windDirection: currentRaw.wind_direction_10m,
    cloudCover: currentRaw.cloud_cover,
    isDay: currentRaw.is_day === 1 || currentRaw.is_day === true,
  };

  const daily: DailyForecastDay[] = [];
  const daysCount = dailyRaw.time.length;

  for (let i = 0; i < daysCount; i++) {
    daily.push({
      date: dailyRaw.time[i],
      tempMax: dailyRaw.temperature_2m_max[i],
      tempMin: dailyRaw.temperature_2m_min[i],
      apparentTempMax: dailyRaw.apparent_temperature_max[i],
      apparentTempMin: dailyRaw.apparent_temperature_min[i],
      weatherCode: dailyRaw.weather_code[i],
      precipitationSum: dailyRaw.precipitation_sum[i],
      precipitationProbability: dailyRaw.precipitation_probability_max[i],
      windSpeedMax: dailyRaw.wind_speed_10m_max[i],
      windGustsMax: dailyRaw.wind_gusts_10m_max[i],
      uvIndexMax: dailyRaw.uv_index_max[i],
      sunrise: dailyRaw.sunrise[i],
      sunset: dailyRaw.sunset[i],
    });
  }

  return {
    city: cityName,
    country: countryName,
    latitude: raw.latitude,
    longitude: raw.longitude,
    timezone: raw.timezone,
    elevation: raw.elevation,
    current,
    daily,
  };
}

/**
 * Intelligent Weather Recommendation Engine. Generates planning insights, activity ratings,
 * and safety recommendations locally in the client based on empirical weather rules.
 */
export function generateLocalRecommendations(weather: WeatherData): WeatherRecommendation {
  const { current, daily } = weather;
  const temp = current.temperature;
  const code = current.weatherCode;
  const probRain = daily[0]?.precipitationProbability ?? 0;
  const wind = current.windSpeed;
  const humidity = current.relativeHumidity;
  const isRainy = code >= 51 && code <= 67 || code >= 80 && code <= 82 || current.precipitation > 0;
  const isStormy = code >= 95;
  const isSnowy = code >= 71 && code <= 77 || code === 85 || code === 86;

  // Initializing default recommendation response
  let summary = '';
  let persona = 'Breezy Intelligence Engine';
  let outdoorSuitability: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Good';
  let indoorSuitability: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Excellent';
  let travelStatus: 'Go' | 'Caution' | 'Delay' | 'Dangerous' = 'Go';
  let travelStatusReason = 'Normal dry road conditions with stable visibility.';
  let outdoorActivities: string[] = [];
  let indoorActivities: string[] = [];
  let clothingSuggestions: string[] = [];
  let healthSafetyTips: string[] = [];

  // Case 1: Extreme weather / Storms
  if (isStormy || wind > 40 || temp > 40 || temp < -10) {
    persona = 'The Safety Strategist';
    outdoorSuitability = 'Poor';
    indoorSuitability = 'Excellent';
    travelStatus = isStormy || temp > 43 || temp < -15 ? 'Dangerous' : 'Delay';
    
    if (isStormy) {
      summary = 'A thunderstorm or severe warning is active. Safe shelter is highly recommended.';
      travelStatusReason = 'High risk of lightning strikes, wind shear, and temporary local flooding.';
      outdoorActivities = ['Avoid all outdoor activities', 'Seek concrete lightning-shielded shelter'];
      indoorActivities = ['Board games & cozy storytelling', 'Indoor cooking', 'Check weather warnings online'];
      clothingSuggestions = ['Comfortable indoor apparel', 'Keep footwear nearby in case of alerts'];
      healthSafetyTips = ['Unplug sensitive electronic appliances', 'Stay away from windows', 'Have an emergency flashlight ready'];
    } else if (temp > 40) {
      summary = 'Dangerous extreme heat conditions are currently active in the area.';
      travelStatusReason = 'Extreme heat can cause engine strain, tire pressure spikes, and human fatigue.';
      outdoorActivities = ['None recommended', 'Limit walking to shaded regions strictly under 5 minutes'];
      indoorActivities = ['Air-conditioned museum visits', 'Indoor pool swimming', 'Hydrated cinema relaxation'];
      clothingSuggestions = ['Loose-fitting linens', 'Wide-brimmed hats', 'High UV protective sunglasses'];
      healthSafetyTips = ['Drink electrolyte-fortified fluids', 'Apply SPF 50+ sunscreen hourly', 'Do not leave children or pets in parked vehicles'];
    } else {
      summary = 'Extreme polar sub-zero temperatures. High risk of frostbite and icy paths.';
      travelStatusReason = 'Extreme cold causes direct black ice hazards, frozen fuel lines, and reduced tire grip.';
      outdoorActivities = ['Limit outdoor exposures to strictly necessary tasks'];
      indoorActivities = ['Read warm books next to the radiator', 'Hot cocoa or soup preparation', 'Home workout routine'];
      clothingSuggestions = ['Thermal base layers', 'Heavy-duty insulated down coat', 'Thermal wool socks & gloves', 'Balaclava'];
      healthSafetyTips = ['Dress in multiple dense layers', 'Monitor fingers and toes for numbness', 'Minimize skin exposure to raw wind'];
    }
  }
  // Case 2: Rainy weather
  else if (isRainy) {
    persona = 'The Cozy Curator';
    outdoorSuitability = 'Poor';
    indoorSuitability = 'Excellent';
    travelStatus = current.precipitation > 10 || wind > 25 ? 'Delay' : 'Caution';
    travelStatusReason = 'Slick roads and decreased visibility due to active precipitation. Carry wipers on full.';
    summary = 'Active rain showers mean it’s a perfect day to stay warm, dry, and focus on indoor highlights.';
    
    outdoorActivities = ['Puddle walking with rubber boots', 'Rain photography (with waterproof gear)'];
    indoorActivities = ['Visiting a local cozy library or cafe', 'Art gallery exhibition tour', 'Relaxing spa session', 'Working from a local hub'];
    clothingSuggestions = ['Heavy duty waterproof rain jacket', 'Sturdy umbrella', 'Waterproof leather boots', 'Warm light sweater'];
    healthSafetyTips = ['Watch out for slippery tiled lobby entrances', 'Keep your wet gear isolated from electronic equipment', 'Drive slower with extended spacing buffers'];
  }
  // Case 3: Snowy weather
  else if (isSnowy) {
    persona = 'The Alpine Planner';
    outdoorSuitability = 'Fair';
    indoorSuitability = 'Excellent';
    travelStatus = 'Caution';
    travelStatusReason = 'Active snow accumulation can hide curbs and introduce slick, slushy spots.';
    summary = 'Winter snowfall is creating a scenic white landscape! Perfect for mountain sports or cozy fire talks.';
    
    outdoorActivities = ['Skiing or snowboarding', 'Building a snowman', 'Winter landscape photography', 'Relaxed walk in the park'];
    indoorActivities = ['Sipping warm herbal tea near a window', 'Relaxing in hot springs', 'Local history museum exploration'];
    clothingSuggestions = ['Waterproof windbreaker outer shell', 'Flannel shirts', 'Knitted beanie and scarf', 'Insulated snow boots'];
    healthSafetyTips = ['Watch for hidden patches of ice under thin snow layers', 'Stretch before shoveling to prevent back injuries', 'Keep hydration levels high; cold air dries lungs'];
  }
  // Case 4: Warm & Pleasant Weather (Temperature between 18°C and 30°C, low rain)
  else if (temp >= 18 && temp <= 30 && probRain < 30) {
    persona = 'The Sun-Seeking Explorer';
    outdoorSuitability = 'Excellent';
    indoorSuitability = 'Fair';
    travelStatus = 'Go';
    travelStatusReason = 'Perfect clear road visibility and stable dry asphalt.';
    summary = 'Beautifully moderate, pleasant weather. An ideal invitation to head outdoors and seize the day!';
    
    outdoorActivities = ['Afternoon picnic in a botanical garden', 'Scenic bicycle ride or light jogging', 'Al fresco dining at an outdoor patio', 'Exploring hiking trails'];
    indoorActivities = ['Air conditioning break if temperature rises', 'Quick shopping in shaded galleries'];
    clothingSuggestions = ['Breathable cotton t-shirts', 'Lightweight shorts or breathable trousers', 'Sneakers', 'Polarized sunglasses'];
    healthSafetyTips = ['Apply SPF 30+ sunscreen', 'Carry a reusable water bottle for outdoor treks', 'Wear a cap during peak afternoon sunshine'];
  }
  // Case 5: Hot weather (Temperature between 30°C and 40°C)
  else if (temp > 30 && temp <= 40) {
    persona = 'The Shaded Strategist';
    outdoorSuitability = 'Fair';
    indoorSuitability = 'Excellent';
    travelStatus = 'Go';
    travelStatusReason = 'Good road conditions, but watch out for heat-stressed highway surfaces.';
    summary = 'Very warm and high-UV conditions. It is best to stay hydrated and plan heavy efforts during cooler hours.';
    
    outdoorActivities = ['Early morning running (before 8 AM)', 'Late evening walk in the park', 'Beaches or lake swims with high-shade setups'];
    indoorActivities = ['Visiting air-conditioned shopping malls', 'Reading at the public library', 'Relaxing in indoor pools'];
    clothingSuggestions = ['Ultra-light colored loose garments', 'Linen shirts', 'UV blocking sunglasses', 'Wide floppy sun hat'];
    healthSafetyTips = ['Drink at least 2.5L of water today', 'Stay in shaded areas from 11 AM to 4 PM', 'Limit heavy physical cardio under the direct sun'];
  }
  // Case 6: Cool / Brisk Weather (Temperature between 5°C and 18°C)
  else {
    persona = 'The Brisk Wanderer';
    outdoorSuitability = 'Good';
    indoorSuitability = 'Good';
    travelStatus = 'Go';
    travelStatusReason = 'Dry but chilly air. Standard operating conditions.';
    summary = 'Crisp, refreshing air with a chilly breeze. Ideal for a spirited brisk walk or a stroll with a warm beverage.';
    
    outdoorActivities = ['Sightseeing around city markets', 'Photography of autumn/spring foliage', 'Brisk trail walking', 'Dine-out with outdoor patio heaters'];
    indoorActivities = ['Browsing a boutique bookstore', 'Enjoying artisan flat whites at local roasteries', 'Board game cafe hangout'];
    clothingSuggestions = ['Windbreaker or denim jacket', 'Light knit cardigan or pullover', 'Stylish wool scarf', 'Closed sneakers or leather loafers'];
    healthSafetyTips = ['Keep neck and hands protected from cold drafts', 'A quick hot beverage will maintain core temperature', 'Keep moving to naturally generate body heat'];
  }

  return {
    summary,
    persona,
    outdoorSuitability,
    indoorSuitability,
    travelStatus,
    travelStatusReason,
    outdoorActivities,
    indoorActivities,
    clothingSuggestions,
    healthSafetyTips,
  };
}
