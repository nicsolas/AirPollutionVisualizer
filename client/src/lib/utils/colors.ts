import { AQILevel, PollutantType } from "../types";

// AQI color coding based on standard air quality index colors
export const aqiColors: Record<AQILevel, string> = {
  [AQILevel.Good]: "#00e400", // Green
  [AQILevel.Moderate]: "#ffff00", // Yellow
  [AQILevel.UnhealthyForSensitive]: "#ff7e00", // Orange
  [AQILevel.Unhealthy]: "#ff0000", // Red
  [AQILevel.VeryUnhealthy]: "#99004c", // Purple
  [AQILevel.Hazardous]: "#7e0023", // Maroon
};

// Get color based on AQI value (0-500 scale)
export function getAQIColor(value: number): string {
  if (value <= 50) return aqiColors[AQILevel.Good];
  if (value <= 100) return aqiColors[AQILevel.Moderate];
  if (value <= 150) return aqiColors[AQILevel.UnhealthyForSensitive];
  if (value <= 200) return aqiColors[AQILevel.Unhealthy];
  if (value <= 300) return aqiColors[AQILevel.VeryUnhealthy];
  return aqiColors[AQILevel.Hazardous];
}

// Pollutant-specific colors for visualization
export const pollutantColors: Record<PollutantType, string> = {
  [PollutantType.PM25]: "#ff7e00", // Orange
  [PollutantType.PM10]: "#964B00", // Brown
  [PollutantType.NO2]: "#ff0000", // Red
  [PollutantType.SO2]: "#ffff00", // Yellow
  [PollutantType.O3]: "#66cdaa", // Medium Aquamarine
  [PollutantType.CO]: "#808080", // Gray
};

// Get a hex color from RGB values
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => {
    const hex = Math.min(255, Math.max(0, Math.floor(x))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

// Convert hex color to RGB values
export function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { r: 0, g: 0, b: 0 };
  }
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

// Create an alpha version of a color
export function withAlpha(color: string, alpha: number): string {
  const { r, g, b } = hexToRgb(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Create a gradient between two colors
export function createGradient(color1: string, color2: string, steps: number): string[] {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  return Array.from({ length: steps }, (_, i) => {
    const ratio = i / (steps - 1);
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio);
    return rgbToHex(r, g, b);
  });
}
