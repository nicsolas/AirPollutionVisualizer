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
  
  // Recupera le città dall'API
  const { data: cities, isLoading, error } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });
  
  // Gestisce la selezione della città
  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
  };
  
  // Trova la città attualmente selezionata
  const currentCity = cities?.find(city => city.id === selectedCity);
  
  if (isLoading) {
    return (
      <div className="relative w-full max-w-md">
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Caricamento città in corso..." />
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
            <SelectValue placeholder="Impossibile caricare le città" />
          </SelectTrigger>
        </Select>
      </div>
    );
  }
  
  return (
    <div className="relative w-full max-w-md">
      <Select value={selectedCity} onValueChange={handleCityChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleziona una città">
            {currentCity ? `${currentCity.name}, ${currentCity.country}` : "Seleziona una città"}
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
