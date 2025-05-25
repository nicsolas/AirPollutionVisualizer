import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePollution } from "@/lib/stores/usePollution";

const CitySelector = () => {
  const { selectedCity, setSelectedCity } = usePollution();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch cities from OpenAQ
  const { data: cities, isLoading, error } = useQuery({
    queryKey: ["openaq-cities"],
    queryFn: async () => {
      const res = await fetch("https://api.openaq.org/v2/cities?limit=1000&country_id=IT");
      const json = await res.json();
      // Map to { id, name, country }
      return json.results.map((c: any) => ({
        id: c.city,
        name: c.city,
        country: c.country,
      }));
    },
    staleTime: 1000 * 60 * 60,
  });

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
  };

  const currentCity = cities?.find((city: any) => city.id === selectedCity);

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
          {cities.map((city: any) => (
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
