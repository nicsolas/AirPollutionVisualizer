// Air quality index levels
export enum AQILevel {
  Good = "Good",
  Moderate = "Moderate",
  UnhealthyForSensitive = "Unhealthy for Sensitive Groups",
  Unhealthy = "Unhealthy", 
  VeryUnhealthy = "Very Unhealthy",
  Hazardous = "Hazardous"
}

// Pollutant types 
export enum PollutantType {
  PM25 = "PM2.5",
  PM10 = "PM10",
  NO2 = "NO2", 
  SO2 = "SO2",
  O3 = "O3",
  CO = "CO"
}

// Information about each pollutant
export interface PollutantInfo {
  id: PollutantType;
  name: string;
  fullName: string;
  description: string;
  sources: string[];
  healthEffects: string[];
  limits: {
    who: number;
    unit: string;
  };
  color: string;
}

// City data
export interface City {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Pollutant data point
export interface PollutantData {
  pollutant: PollutantType;
  value: number;
  unit: string;
  timestamp: string;
}

// City pollution data
export interface CityPollutionData {
  cityId: string;
  cityName: string;
  countryCode: string;
  data: {
    aqi: number;
    level: AQILevel;
    dominantPollutant: PollutantType;
    pollutants: Record<PollutantType, PollutantData>;
    measurements: {
      hourly: PollutantTimeData[];
      daily: PollutantTimeData[];
    };
  };
}

// Pollutant time series data
export interface PollutantTimeData {
  timestamp: string;
  values: Record<PollutantType, number>;
}

// 3D visualization settings
export interface VisualizationSettings {
  pollutant: PollutantType;
  density: number;
  particleSize: number;
  particleSpeed: number;
  timeOfDay: 'day' | 'night';
  viewMode: 'city' | 'room';
}
