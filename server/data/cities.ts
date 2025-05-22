import { City } from "@shared/types";

// List of cities with pollution data available
const cities: City[] = [
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    coordinates: {
      lat: 51.5074,
      lng: -0.1278
    }
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    coordinates: {
      lat: 48.8566,
      lng: 2.3522
    }
  },
  {
    id: "nyc",
    name: "New York",
    country: "United States",
    coordinates: {
      lat: 40.7128,
      lng: -74.0060
    }
  },
  {
    id: "beijing",
    name: "Beijing",
    country: "China",
    coordinates: {
      lat: 39.9042,
      lng: 116.4074
    }
  },
  {
    id: "delhi",
    name: "Delhi",
    country: "India",
    coordinates: {
      lat: 28.7041,
      lng: 77.1025
    }
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    coordinates: {
      lat: 35.6762,
      lng: 139.6503
    }
  },
  {
    id: "mexico_city",
    name: "Mexico City",
    country: "Mexico",
    coordinates: {
      lat: 19.4326,
      lng: -99.1332
    }
  },
  {
    id: "cairo",
    name: "Cairo",
    country: "Egypt",
    coordinates: {
      lat: 30.0444,
      lng: 31.2357
    }
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    coordinates: {
      lat: -33.8688,
      lng: 151.2093
    }
  },
  {
    id: "rio",
    name: "Rio de Janeiro",
    country: "Brazil",
    coordinates: {
      lat: -22.9068,
      lng: -43.1729
    }
  }
];

// Get list of all cities
export function getCities(): City[] {
  return cities;
}

// Get a specific city by ID
export function getCityById(cityId: string): City | undefined {
  return cities.find(city => city.id === cityId);
}
