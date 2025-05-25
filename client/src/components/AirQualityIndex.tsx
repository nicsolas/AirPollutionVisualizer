import { useQuery } from "@tanstack/react-query";
import { usePollution } from "@/lib/stores/usePollution";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aqiColors, getAQIColor } from "@/lib/utils/colors";
import { AQILevel } from "@/lib/types";
import { useMemo } from "react";

function pm25ToAQI(pm25: number): { aqi: number; level: AQILevel } {
  // Semplice conversione PM2.5 -> AQI (approssimativa, US EPA)
  if (pm25 <= 12) return { aqi: Math.round(pm25 * 4), level: AQILevel.Good };
  if (pm25 <= 35.4) return { aqi: Math.round(50 + ((pm25 - 12.1) * (100 - 51) / (35.4 - 12.1))), level: AQILevel.Moderate };
  if (pm25 <= 55.4) return { aqi: Math.round(100 + ((pm25 - 35.5) * (150 - 101) / (55.4 - 35.5))), level: AQILevel.UnhealthyForSensitive };
  if (pm25 <= 150.4) return { aqi: Math.round(150 + ((pm25 - 55.5) * (200 - 151) / (150.4 - 55.5))), level: AQILevel.Unhealthy };
  if (pm25 <= 250.4) return { aqi: Math.round(200 + ((pm25 - 150.5) * (300 - 201) / (250.4 - 150.5))), level: AQILevel.VeryUnhealthy };
  return { aqi: 300, level: AQILevel.Hazardous };
}

const AirQualityIndex = () => {
  const { selectedCity } = usePollution();
  const apiKey = import.meta.env.VITE_OPENAQ_API_KEY;
  const { data, isLoading, error } = useQuery({
    queryKey: ["openaq-aqi", selectedCity],
    enabled: !!selectedCity,
    queryFn: async () => {
      if (!selectedCity) return null;
      const res = await fetch(
        `https://api.openaq.org/v2/latest?city=${encodeURIComponent(selectedCity)}&parameter=pm25&limit=1`,
        {
          headers: {
            accept: "application/json",
            ...(apiKey ? { "X-API-Key": apiKey } : {}),
          },
        }
      );
      if (!res.ok) throw new Error("Errore caricamento AQI");
      const json = await res.json();
      // json.results[0].measurements contiene i dati
      const pm25 = json.results?.[0]?.measurements?.find((m: any) => m.parameter === "pm25")?.value ?? null;
      return pm25;
    },
    staleTime: 1000 * 60 * 10,
  });

  const aqiDisplay = useMemo(() => {
    if (!data || typeof data !== "number") return { aqi: 0, level: AQILevel.Good, color: aqiColors[AQILevel.Good] };
    const { aqi, level } = pm25ToAQI(data);
    return { aqi, level, color: getAQIColor(aqi) };
  }, [data]);

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

  if (error || !data || typeof data !== "number") {
    return (
      <Card className="min-w-[300px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Indice Qualità dell'Aria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <p className="text-muted-foreground">Dati AQI non disponibili per questa città</p>
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
        <div className="flex flex-col items-center justify-center">
          <div
            className="rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold mb-2"
            style={{ backgroundColor: aqiDisplay.color, color: "#fff" }}
          >
            {aqiDisplay.aqi}
          </div>
          <div className="text-lg font-semibold mb-1" style={{ color: aqiDisplay.color }}>
            {aqiDisplay.level}
          </div>
          <div className="mt-3 text-center text-sm text-muted-foreground">
            <p>Inquinante principale: PM2.5</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirQualityIndex;
