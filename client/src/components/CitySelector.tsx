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

  const apiKey = import.meta.env.VITE_OPENAQ_API_KEY;
  // Fetch cities from OpenAQ v3 (Italy, unique city names)
  const { data: cities, isLoading, error } = useQuery({
    queryKey: ["openaq-cities-it"],
    queryFn: async () => {
      const res = await fetch("https://api.openaq.org/v3/cities?country=IT&limit=1000&order_by=city", {
        headers: {
          "accept": "application/json",
          ...(apiKey ? { "X-API-Key": apiKey } : {})
        },
      });
      const json = await res.json();
      // OpenAQ v3: json.data è l'array delle città
      const unique = Array.from(new Set((json.data || []).map((c: any) => String(c.city)))).filter((city): city is string => Boolean(city));
      return unique.map(city => ({ id: city, name: city, country: "IT" }));
    },
    staleTime: 1000 * 60 * 60,
  });

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
  };

  const filteredCities = cities ? cities.filter((city: any) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

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
      <input
        type="text"
        placeholder="Cerca città..."
        className="mb-2 w-full border rounded px-2 py-1"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <Select value={selectedCity} onValueChange={handleCityChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleziona una città">
            {currentCity ? `${currentCity.name}, Italia` : "Seleziona una città"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {(filteredCities && filteredCities.length > 0 ? filteredCities : cities || []).map((city: any) => (
            <SelectItem key={city.id} value={city.id}>
              {city.name}, Italia
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;
