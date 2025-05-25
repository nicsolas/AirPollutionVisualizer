import { PollutantType, AQILevel } from "@/lib/types";
import { aqiColors, getAQIColor } from "@/lib/utils/colors";
import { useQuery } from "@tanstack/react-query";
import { usePollution } from "@/lib/stores/usePollution";
import { getApiUrl } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

const AirQualityIndex = () => {
  const { selectedCity, timeOffset } = usePollution();
  const {
    data: cityData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      `/api/pollution/${selectedCity}?offset=${timeOffset}`
    ],
    enabled: !!selectedCity,
    queryFn: async ({ queryKey }) => {
      const url = getApiUrl(queryKey[0] as string);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Impossibile recuperare i dati AQI");
      return res.json();
    },
  });
  
  // Determina le classi CSS del livello AQI in base ai dati correnti
  const aqiDisplay = useMemo(() => {
    if (!cityData) return { level: AQILevel.Good, color: aqiColors[AQILevel.Good], value: 0 };
    
    const { aqi, level } = cityData.data;
    const color = getAQIColor(aqi);
    
    return { level, color, value: aqi };
  }, [cityData]);
  
  // Crea lo stile di animazione per l'indicatore
  const indicatorStyle = {
    backgroundColor: aqiDisplay.color,
    boxShadow: `0 0 12px ${aqiDisplay.color}`,
  };
  
  if (isLoading) {
    return (
      <Card className="min-w-[300px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Indice Qualità dell'Aria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <p className="text-muted-foreground">Caricamento dati in corso...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (error || !cityData) {
    return (
      <Card className="min-w-[300px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Indice Qualità dell'Aria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <p className="text-muted-foreground">Impossibile caricare i dati AQI</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="min-w-[300px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Indice Qualità dell'Aria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 flex items-center justify-center mb-2">
            <div className="absolute inset-0 rounded-full opacity-10" style={{ backgroundColor: aqiDisplay.color }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full transition-all duration-700" style={indicatorStyle}></div>
            <div className="relative z-10 text-4xl font-bold">{aqiDisplay.value}</div>
          </div>
          
          <div className="mt-1 text-lg font-medium" style={{ color: aqiDisplay.color }}>
            {aqiDisplay.level}
          </div>
          
          <div className="mt-3 text-center text-sm text-muted-foreground">
            {cityData.data.dominantPollutant && (
              <p>Inquinante principale: {cityData.data.dominantPollutant}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirQualityIndex;
