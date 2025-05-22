import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { City } from "@/lib/types";
import { usePollution } from "@/lib/stores/usePollution";

const CitySelector = () => {
  const { selectedCity, setSelectedCity } = usePollution();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch cities from API
  const { data: cities, isLoading, error } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });
  
  // Handle city selection
  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
  };
  
  // Find currently selected city
  const currentCity = cities?.find(city => city.id === selectedCity);
  
  if (isLoading) {
    return (
      <div className="relative w-full max-w-md">
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Loading cities..." />
          </SelectTrigger>
        </Select>
      </div>
    );
  }
  
  if (error || !cities) {
    return (
      <div className="relative w-full max-w-md">
        <Select disabled>
          <SelectTrigger className="border-destructive">
            <SelectValue placeholder="Failed to load cities" />
          </SelectTrigger>
        </Select>
      </div>
    );
  }
  
  return (
    <div className="relative w-full max-w-md">
      <Select value={selectedCity} onValueChange={handleCityChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a city">
            {currentCity ? `${currentCity.name}, ${currentCity.country}` : "Select a city"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city.id} value={city.id}>
              {city.name}, {city.country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;
