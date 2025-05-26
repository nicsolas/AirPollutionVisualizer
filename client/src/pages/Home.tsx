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
          {/* Scheda effetti sull'ambiente, con icona globo illustrata e illustrazioni */}
          <div className="rounded-2xl border border-primary/40 bg-gradient-to-br from-blue-100/80 to-green-100/80 shadow-2xl p-0 overflow-hidden flex flex-col items-stretch animate-fadeIn">
            <div className="flex items-center gap-3 px-6 py-4 bg-primary/10 border-b border-primary/20">
              <img src="/textures/earth.png" alt="Globo" className="h-8 w-8 object-contain drop-shadow-md" />
              <span className="font-bold text-xl text-blue-900 tracking-wide">Effetti sull'ambiente</span>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 p-6">
              <div className="flex flex-col items-center text-center">
                <img src="https://cdn.pixabay.com/photo/2017/01/31/13/14/earth-2025489_1280.png" alt="Inquinamento aria" className="w-28 h-28 object-contain mb-2 rounded-full shadow" />
                <div className="font-semibold text-blue-800 mb-1">Inquinamento dell'aria</div>
                <div className="text-blue-900 text-sm">Danni a ecosistemi, foreste e colture a causa di ozono, particolato e altri inquinanti.</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <img src="https://cdn.pixabay.com/photo/2016/03/31/19/14/water-1298818_1280.png" alt="Acidificazione" className="w-28 h-28 object-contain mb-2 rounded-full shadow" />
                <div className="font-semibold text-blue-800 mb-1">Acidificazione</div>
                <div className="text-blue-900 text-sm">Piogge acide che alterano il pH di suoli e acque, danneggiando flora e fauna.</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <img src="https://cdn.pixabay.com/photo/2017/01/31/13/13/earth-2025487_1280.png" alt="Cambiamento climatico" className="w-28 h-28 object-contain mb-2 rounded-full shadow" />
                <div className="font-semibold text-blue-800 mb-1">Cambiamento climatico</div>
                <div className="text-blue-900 text-sm">Emissioni di gas serra (CO₂, metano) che contribuiscono al riscaldamento globale.</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <img src="https://cdn.pixabay.com/photo/2017/01/31/13/13/earth-2025488_1280.png" alt="Perdita biodiversità" className="w-28 h-28 object-contain mb-2 rounded-full shadow" />
                <div className="font-semibold text-blue-800 mb-1">Perdita di biodiversità</div>
                <div className="text-blue-900 text-sm">Specie animali e vegetali minacciate da habitat degradati e inquinamento.</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <img src="https://cdn.pixabay.com/photo/2016/03/31/19/14/water-1298818_1280.png" alt="Contaminazione acque" className="w-28 h-28 object-contain mb-2 rounded-full shadow" />
                <div className="font-semibold text-blue-800 mb-1">Contaminazione delle acque</div>
                <div className="text-blue-900 text-sm">Deposizione di inquinanti atmosferici nei laghi, fiumi e mari.</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <img src="https://cdn.pixabay.com/photo/2017/01/31/13/13/earth-2025486_1280.png" alt="Effetti su suolo e colture" className="w-28 h-28 object-contain mb-2 rounded-full shadow" />
                <div className="font-semibold text-blue-800 mb-1">Effetti su suolo e colture</div>
                <div className="text-blue-900 text-sm">Riduzione della fertilità e della produttività agricola.</div>
              </div>
            </div>
          </div>
          {/* Fine scheda effetti ambiente */}
          <InfoPanel />

          <AnimatedButton asChild motionEffect="bounce" variant="gradient" className="mt-auto">
            <Link to="/pollutants">
              Scopri di più sugli inquinanti
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