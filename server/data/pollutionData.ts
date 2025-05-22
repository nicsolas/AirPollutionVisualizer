import { CityPollutionData, PollutantType, AQILevel, PollutantData, PollutantTimeData } from "@shared/types";
import { getCityById } from "./cities";

// This file provides realistic pollution data for the application
// Note: In a production app, this would be replaced with calls to a real air quality API

// Generate pollution data for a specific city
export function getPollutionData(cityId: string, timeOffset: number = 0): CityPollutionData {
  const city = getCityById(cityId);
  
  if (!city) {
    throw new Error(`City with ID ${cityId} not found`);
  }
  
  // Different cities have different baseline pollution profiles
  const cityProfiles: Record<string, {
    baseAQI: number,
    dominantPollutant: PollutantType,
    pollutantLevels: Partial<Record<PollutantType, number>>
  }> = {
    "london": {
      baseAQI: 65,
      dominantPollutant: PollutantType.NO2,
      pollutantLevels: {
        [PollutantType.PM25]: 18,
        [PollutantType.PM10]: 35,
        [PollutantType.NO2]: 85,
        [PollutantType.SO2]: 15,
        [PollutantType.O3]: 40,
        [PollutantType.CO]: 1.2
      }
    },
    "paris": {
      baseAQI: 70,
      dominantPollutant: PollutantType.PM25,
      pollutantLevels: {
        [PollutantType.PM25]: 22,
        [PollutantType.PM10]: 40,
        [PollutantType.NO2]: 75,
        [PollutantType.SO2]: 12,
        [PollutantType.O3]: 45,
        [PollutantType.CO]: 1.0
      }
    },
    "nyc": {
      baseAQI: 58,
      dominantPollutant: PollutantType.PM25,
      pollutantLevels: {
        [PollutantType.PM25]: 17,
        [PollutantType.PM10]: 28,
        [PollutantType.NO2]: 70,
        [PollutantType.SO2]: 10,
        [PollutantType.O3]: 38,
        [PollutantType.CO]: 0.9
      }
    },
    "beijing": {
      baseAQI: 160,
      dominantPollutant: PollutantType.PM25,
      pollutantLevels: {
        [PollutantType.PM25]: 75,
        [PollutantType.PM10]: 110,
        [PollutantType.NO2]: 95,
        [PollutantType.SO2]: 35,
        [PollutantType.O3]: 60,
        [PollutantType.CO]: 2.5
      }
    },
    "delhi": {
      baseAQI: 220,
      dominantPollutant: PollutantType.PM25,
      pollutantLevels: {
        [PollutantType.PM25]: 130,
        [PollutantType.PM10]: 160,
        [PollutantType.NO2]: 85,
        [PollutantType.SO2]: 30,
        [PollutantType.O3]: 55,
        [PollutantType.CO]: 3.2
      }
    },
    "tokyo": {
      baseAQI: 45,
      dominantPollutant: PollutantType.NO2,
      pollutantLevels: {
        [PollutantType.PM25]: 10,
        [PollutantType.PM10]: 25,
        [PollutantType.NO2]: 60,
        [PollutantType.SO2]: 8,
        [PollutantType.O3]: 35,
        [PollutantType.CO]: 0.7
      }
    },
    "mexico_city": {
      baseAQI: 110,
      dominantPollutant: PollutantType.O3,
      pollutantLevels: {
        [PollutantType.PM25]: 32,
        [PollutantType.PM10]: 60,
        [PollutantType.NO2]: 65,
        [PollutantType.SO2]: 25,
        [PollutantType.O3]: 105,
        [PollutantType.CO]: 1.8
      }
    },
    "cairo": {
      baseAQI: 140,
      dominantPollutant: PollutantType.PM10,
      pollutantLevels: {
        [PollutantType.PM25]: 60,
        [PollutantType.PM10]: 150,
        [PollutantType.NO2]: 70,
        [PollutantType.SO2]: 40,
        [PollutantType.O3]: 50,
        [PollutantType.CO]: 2.0
      }
    },
    "sydney": {
      baseAQI: 30,
      dominantPollutant: PollutantType.O3,
      pollutantLevels: {
        [PollutantType.PM25]: 8,
        [PollutantType.PM10]: 18,
        [PollutantType.NO2]: 25,
        [PollutantType.SO2]: 5,
        [PollutantType.O3]: 50,
        [PollutantType.CO]: 0.4
      }
    },
    "rio": {
      baseAQI: 75,
      dominantPollutant: PollutantType.PM10,
      pollutantLevels: {
        [PollutantType.PM25]: 20,
        [PollutantType.PM10]: 85,
        [PollutantType.NO2]: 55,
        [PollutantType.SO2]: 18,
        [PollutantType.O3]: 65,
        [PollutantType.CO]: 1.5
      }
    }
  };
  
  // Get city profile or use a default
  const profile = cityProfiles[cityId] || {
    baseAQI: 50,
    dominantPollutant: PollutantType.PM25,
    pollutantLevels: {
      [PollutantType.PM25]: 15,
      [PollutantType.PM10]: 30,
      [PollutantType.NO2]: 50,
      [PollutantType.SO2]: 10,
      [PollutantType.O3]: 35,
      [PollutantType.CO]: 1.0
    }
  };
  
  // Apply time-of-day variations (simplified model)
  // Negative timeOffset means looking into the past
  // 0 = current, -1 = 1 hour ago, -24 = 24 hours ago
  const baselineHour = new Date().getHours();
  const dataHour = (baselineHour + timeOffset + 24) % 24;
  
  // Traffic patterns affect pollution (rush hours)
  const isRushHour = (dataHour >= 7 && dataHour <= 9) || (dataHour >= 16 && dataHour <= 19);
  const isNight = dataHour >= 22 || dataHour <= 5;
  const isMidDay = dataHour >= 11 && dataHour <= 14;
  
  // Factors for time-based variations
  const timeFactor = isRushHour ? 1.3 : (isNight ? 0.7 : (isMidDay ? 1.1 : 1.0));
  
  // Calculate AQI value based on city profile and time factor
  const aqi = Math.round(profile.baseAQI * timeFactor);
  
  // Determine AQI level
  let level: AQILevel;
  if (aqi <= 50) level = AQILevel.Good;
  else if (aqi <= 100) level = AQILevel.Moderate;
  else if (aqi <= 150) level = AQILevel.UnhealthyForSensitive;
  else if (aqi <= 200) level = AQILevel.Unhealthy;
  else if (aqi <= 300) level = AQILevel.VeryUnhealthy;
  else level = AQILevel.Hazardous;
  
  // Generate pollutant data
  const pollutants: Record<PollutantType, PollutantData> = {
    [PollutantType.PM25]: {
      pollutant: PollutantType.PM25,
      value: Math.round(profile.pollutantLevels[PollutantType.PM25]! * timeFactor * (isRushHour ? 1.2 : 1.0)),
      unit: "µg/m³",
      timestamp: new Date().toISOString()
    },
    [PollutantType.PM10]: {
      pollutant: PollutantType.PM10,
      value: Math.round(profile.pollutantLevels[PollutantType.PM10]! * timeFactor * (isMidDay && cityId === "cairo" ? 1.3 : 1.0)),
      unit: "µg/m³",
      timestamp: new Date().toISOString()
    },
    [PollutantType.NO2]: {
      pollutant: PollutantType.NO2,
      value: Math.round(profile.pollutantLevels[PollutantType.NO2]! * timeFactor * (isRushHour ? 1.4 : 0.9)),
      unit: "µg/m³",
      timestamp: new Date().toISOString()
    },
    [PollutantType.SO2]: {
      pollutant: PollutantType.SO2,
      value: Math.round(profile.pollutantLevels[PollutantType.SO2]! * timeFactor),
      unit: "µg/m³",
      timestamp: new Date().toISOString()
    },
    [PollutantType.O3]: {
      pollutant: PollutantType.O3,
      value: Math.round(profile.pollutantLevels[PollutantType.O3]! * (isMidDay ? 1.5 : 0.8) * (isNight ? 0.5 : 1.0)),
      unit: "µg/m³",
      timestamp: new Date().toISOString()
    },
    [PollutantType.CO]: {
      pollutant: PollutantType.CO,
      value: parseFloat((profile.pollutantLevels[PollutantType.CO]! * timeFactor * (isRushHour ? 1.3 : 0.9)).toFixed(1)),
      unit: "mg/m³",
      timestamp: new Date().toISOString()
    }
  };
  
  // Generate time series data (hourly and daily)
  const hourlyMeasurements: PollutantTimeData[] = generateTimeSeriesData(
    24, // 24 hours
    profile,
    cityId
  );
  
  const dailyMeasurements: PollutantTimeData[] = generateDailyData(
    7, // 7 days
    profile,
    cityId
  );
  
  // Compile and return the full dataset
  return {
    cityId: city.id,
    cityName: city.name,
    countryCode: city.country,
    data: {
      aqi,
      level,
      dominantPollutant: profile.dominantPollutant,
      pollutants,
      measurements: {
        hourly: hourlyMeasurements,
        daily: dailyMeasurements
      }
    }
  };
}

// Generate time series data
function generateTimeSeriesData(
  hours: number,
  profile: { 
    baseAQI: number,
    dominantPollutant: PollutantType,
    pollutantLevels: Partial<Record<PollutantType, number>>
  },
  cityId: string
): PollutantTimeData[] {
  const now = new Date();
  const result: PollutantTimeData[] = [];
  
  // For each hour
  for (let i = 0; i < hours; i++) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
    const hour = (now.getHours() - i + 24) % 24;
    
    // Apply time-based patterns
    const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19);
    const isNight = hour >= 22 || hour <= 5;
    const isMidDay = hour >= 11 && hour <= 14;
    const timeFactor = isRushHour ? 1.3 : (isNight ? 0.7 : (isMidDay ? 1.1 : 1.0));
    
    // Randomize values slightly for variation
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    
    // Calculate values for each pollutant
    const values: Record<PollutantType, number> = {
      [PollutantType.PM25]: Math.round(profile.pollutantLevels[PollutantType.PM25]! * timeFactor * randomFactor),
      [PollutantType.PM10]: Math.round(profile.pollutantLevels[PollutantType.PM10]! * timeFactor * randomFactor),
      [PollutantType.NO2]: Math.round(profile.pollutantLevels[PollutantType.NO2]! * timeFactor * (isRushHour ? 1.2 : 1.0) * randomFactor),
      [PollutantType.SO2]: Math.round(profile.pollutantLevels[PollutantType.SO2]! * timeFactor * randomFactor),
      [PollutantType.O3]: Math.round(profile.pollutantLevels[PollutantType.O3]! * (isMidDay ? 1.5 : 0.8) * randomFactor),
      [PollutantType.CO]: parseFloat((profile.pollutantLevels[PollutantType.CO]! * timeFactor * randomFactor).toFixed(1))
    };
    
    result.push({ timestamp, values });
  }
  
  return result;
}

// Generate daily average data
function generateDailyData(
  days: number,
  profile: { 
    baseAQI: number,
    dominantPollutant: PollutantType,
    pollutantLevels: Partial<Record<PollutantType, number>>
  },
  cityId: string
): PollutantTimeData[] {
  const now = new Date();
  const result: PollutantTimeData[] = [];
  
  // For each day
  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    date.setHours(12, 0, 0, 0); // Noon each day
    const timestamp = date.toISOString();
    
    // Weekend vs weekday pattern
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;
    const dayFactor = isWeekend ? 0.8 : 1.1;
    
    // Weather and seasonal patterns (simplified)
    // This would be more accurate with real weather data
    const monthFactor = getSeasonalFactor(date, cityId);
    
    // Random variations between days
    const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
    
    // Calculate values for each pollutant
    const values: Record<PollutantType, number> = {
      [PollutantType.PM25]: Math.round(profile.pollutantLevels[PollutantType.PM25]! * dayFactor * monthFactor * randomFactor),
      [PollutantType.PM10]: Math.round(profile.pollutantLevels[PollutantType.PM10]! * dayFactor * monthFactor * randomFactor),
      [PollutantType.NO2]: Math.round(profile.pollutantLevels[PollutantType.NO2]! * dayFactor * randomFactor),
      [PollutantType.SO2]: Math.round(profile.pollutantLevels[PollutantType.SO2]! * dayFactor * randomFactor),
      [PollutantType.O3]: Math.round(profile.pollutantLevels[PollutantType.O3]! * (isWeekend ? 0.9 : 1.1) * monthFactor * randomFactor),
      [PollutantType.CO]: parseFloat((profile.pollutantLevels[PollutantType.CO]! * dayFactor * randomFactor).toFixed(1))
    };
    
    result.push({ timestamp, values });
  }
  
  return result;
}

// Get a seasonal factor based on the month and city location
function getSeasonalFactor(date: Date, cityId: string): number {
  const month = date.getMonth(); // 0-11
  
  // Northern hemisphere cities
  if (["london", "paris", "nyc", "beijing", "delhi", "tokyo", "mexico_city", "cairo"].includes(cityId)) {
    // Winter months have higher pollution in northern cities with heating
    if (month >= 10 || month <= 2) {
      return 1.3; // Winter
    } else if (month >= 3 && month <= 5) {
      return 0.9; // Spring
    } else if (month >= 6 && month <= 8) {
      return 0.85; // Summer
    } else {
      return 1.1; // Fall
    }
  }
  // Southern hemisphere cities
  else {
    // Reversed seasons
    if (month >= 10 || month <= 2) {
      return 0.85; // Summer
    } else if (month >= 3 && month <= 5) {
      return 1.1; // Fall
    } else if (month >= 6 && month <= 8) {
      return 1.3; // Winter
    } else {
      return 0.9; // Spring
    }
  }
}
