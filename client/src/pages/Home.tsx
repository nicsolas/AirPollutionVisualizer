import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePollution } from "@/lib/stores/usePollution";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import CitySelector from "@/components/CitySelector";
import AirQualityIndex from "@/components/AirQualityIndex";
import PollutionControls from "@/components/PollutionControls";
import PollutionScene from "@/components/PollutionScene";
import InfoPanel from "@/components/InfoPanel";
import TimeSlider from "@/components/TimeSlider";
import PageScroller from "@/components/PageScroller";
import { Card, CardContent } from "@/components/ui/card";
import { CityPollutionData } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

const Home = () => {
  const { 
    selectedCity, 
    timeOffset, 
    setCityData, 
    setError, 
    setLoading 
  } = usePollution();

  // Ottiene i dati sull'inquinamento per la città selezionata
  const { data, isLoading, error } = useQuery<CityPollutionData>({
    queryKey: [`/api/pollution/${selectedCity}?offset=${timeOffset}`],
    enabled: selectedCity !== "",
  });

  // Aggiorna lo store quando cambiano i dati
  useEffect(() => {
    setLoading(isLoading);

    if (error) {
      setError(error instanceof Error ? error.message : "Impossibile recuperare i dati sull'inquinamento");
    } else if (data) {
      setCityData(data);
    }
  }, [data, isLoading, error, setCityData, setError, setLoading]);

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col min-h-[calc(100vh-4rem)] relative">
      <PageScroller />
      {/* Aggiungiamo il componente di scorrimento pagina */}
      <PageScroller />

      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Visualizzazione Inquinamento Atmosferico</h1>
          <p className="text-muted-foreground">
            Esplora i dati sull'inquinamento atmosferico in un ambiente 3D interattivo
          </p>
        </div>

        <CitySelector />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Area di visualizzazione principale */}
        <div className="lg:col-span-2 lg:sticky lg:top-0 h-screen">
          <PollutionScene />
          <div className="mt-2">
            <TimeSlider />
          </div>
        </div>

        {/* Controlli e informazioni */}
        <div className="flex flex-col gap-6">
          <AirQualityIndex />
          <PollutionControls />
          <InfoPanel />

          <AnimatedButton asChild motionEffect="bounce" variant="gradient" className="mt-auto">
            <Link to="/pollutants">
              Scopri di più sugli inquinanti
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </AnimatedButton>

          <AnimatedButton asChild motionEffect="bounce" variant="gradient" className="mt-2">
            <Link to="/effects">
              Scopri gli effetti sull'ambiente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};

export default Home;

// Nuova route per la scheda effetti sull'ambiente