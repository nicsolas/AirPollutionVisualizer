import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePollution } from "@/lib/stores/usePollution";

// Lista statica di città italiane principali con coordinate
export const ITALIAN_CITIES = [
  { id: "roma", name: "Roma", lat: 41.9028, lon: 12.4964 },
  { id: "milano", name: "Milano", lat: 45.4642, lon: 9.19 },
  { id: "napoli", name: "Napoli", lat: 40.8522, lon: 14.2681 },
  { id: "torino", name: "Torino", lat: 45.0703, lon: 7.6869 },
  { id: "palermo", name: "Palermo", lat: 38.1157, lon: 13.3615 },
  { id: "genova", name: "Genova", lat: 44.4056, lon: 8.9463 },
  { id: "bologna", name: "Bologna", lat: 44.4949, lon: 11.3426 },
  { id: "firenze", name: "Firenze", lat: 43.7696, lon: 11.2558 },
  { id: "bari", name: "Bari", lat: 41.1171, lon: 16.8719 },
  { id: "catania", name: "Catania", lat: 37.5079, lon: 15.083 },
  // ...aggiungi altre città se vuoi
];

const CitySelector = () => {
  const { selectedCity, setSelectedCity } = usePollution();

  const filteredCities = ITALIAN_CITIES;
  const currentCity = ITALIAN_CITIES.find((city) => city.id === selectedCity);

  return (
    <div className="relative w-full max-w-md">
      <Select value={selectedCity} onValueChange={setSelectedCity}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleziona una città">
            {currentCity ? `${currentCity.name}, Italia` : "Seleziona una città"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {filteredCities.length === 0 ? (
            <div className="px-4 py-2 text-muted-foreground">
              Nessuna città trovata
            </div>
          ) : (
            filteredCities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}, Italia
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;
