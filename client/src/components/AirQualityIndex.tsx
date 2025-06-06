import { useQuery } from "@tanstack/react-query";
import { usePollution } from "@/lib/stores/usePollution";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aqiColors, getAQIColor } from "@/lib/utils/colors";
import { AQILevel } from "@/lib/types";
import { useMemo } from "react";
import { ITALIAN_CITIES } from "./CitySelector";

function pm25ToAQI(pm25: number): { aqi: number; level: AQILevel } {
	// Semplice conversione PM2.5 -> AQI (approssimativa, US EPA)
	if (pm25 <= 12) return { aqi: Math.round(pm25 * 4), level: AQILevel.Good };
	if (pm25 <= 35.4)
		return {
			aqi: Math.round(
				50 + ((pm25 - 12.1) * (100 - 51)) / (35.4 - 12.1)
			),
			level: AQILevel.Moderate,
		};
	if (pm25 <= 55.4)
		return {
			aqi: Math.round(
				100 + ((pm25 - 35.5) * (150 - 101)) / (55.4 - 35.5)
			),
			level: AQILevel.UnhealthyForSensitive,
		};
	if (pm25 <= 150.4)
		return {
			aqi: Math.round(
				150 + ((pm25 - 55.5) * (200 - 151)) / (150.4 - 55.5)
			),
			level: AQILevel.Unhealthy,
		};
	if (pm25 <= 250.4)
		return {
			aqi: Math.round(
				200 + ((pm25 - 150.5) * (300 - 201)) / (250.4 - 150.5)
			),
			level: AQILevel.VeryUnhealthy,
		};
	return { aqi: 300, level: AQILevel.Hazardous };
}

const AirQualityIndex = () => {
	const { selectedCity } = usePollution();
	const city = ITALIAN_CITIES.find((c) => c.id === selectedCity);

	const { data, isLoading, error } = useQuery({
		queryKey: ["openmeteo-aqi", city?.id],
		enabled: !!city,
		queryFn: async () => {
			if (!city) return null;
			// Open-Meteo Air Quality API (no key, CORS ok)
			const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&hourly=pm2_5&timezone=auto`;
			const res = await fetch(url);
			if (!res.ok) throw new Error("Errore caricamento AQI");
			const json = await res.json();
			// Prendi il valore PM2.5 più recente
			const values = json.hourly?.pm2_5;
			const last = Array.isArray(values) ? values[values.length - 1] : null;
			return last;
		},
		staleTime: 1000 * 60 * 10,
	});

	const aqiDisplay = useMemo(() => {
		if (!data || typeof data !== "number")
			return { aqi: 0, level: AQILevel.Good, color: aqiColors[AQILevel.Good] };
		const { aqi, level } = pm25ToAQI(data);
		return { aqi, level, color: getAQIColor(aqi) };
	}, [data]);

	if (!city) {
		return (
			<Card className="min-w-[300px]">
				<CardHeader className="pb-2">
					<CardTitle className="text-lg">Indice Qualità dell'Aria</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-24 flex items-center justify-center">
						<p className="text-muted-foreground">Seleziona una città</p>
					</div>
				</CardContent>
			</Card>
		);
	}

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
						<p className="text-muted-foreground">
							Dati AQI non disponibili per questa città
						</p>
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
					<div
						className="text-lg font-semibold mb-1"
						style={{ color: aqiDisplay.color }}
					>
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
