import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { usePollution } from "@/lib/stores/usePollution";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow, subHours, format } from "date-fns";

const TimeSlider = () => {
  const { timeOffset, setTimeOffset, cityData } = usePollution();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Ore massime che possiamo tornare indietro nel tempo (in base ai dati disponibili)
  const maxHoursBack = 24;
  
  // Aggiorna l'ora corrente
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Aggiorna ogni minuto
    
    return () => clearInterval(timer);
  }, []);
  
  // Riproduzione automatica dello slider temporale
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setTimeOffset((current) => {
        // Se raggiungiamo l'ora corrente, ferma la riproduzione
        if (current >= 0) {
          setIsPlaying(false);
          return 0;
        }
        return current + 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, setTimeOffset]);
  
  // Formatta l'etichetta dell'ora
  const getTimeLabel = () => {
    if (timeOffset === 0) {
      return "Attuale";
    }
    
    const pastTime = subHours(currentTime, Math.abs(timeOffset));
    return format(pastTime, "H:mm");
  };
  
  // Calcola il tempo come una stringa leggibile
  const getTimeDescription = () => {
    if (timeOffset === 0) {
      return "Ora corrente";
    }
    
    const pastTime = subHours(currentTime, Math.abs(timeOffset));
    return `${formatDistanceToNow(pastTime)} fa`;
  };
  
  // Gestisce il cambio dello slider temporale
  const handleTimeChange = (value: number[]) => {
    setTimeOffset(value[0]);
    // Ferma la riproduzione se l'utente cambia manualmente il tempo
    setIsPlaying(false);
  };
  
  // Attiva/disattiva la riproduzione temporale
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Ripristina all'ora corrente
  const resetToCurrentTime = () => {
    setTimeOffset(0);
    setIsPlaying(false);
  };
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{getTimeLabel()}</span>
            </div>
            <span className="text-sm text-muted-foreground">{getTimeDescription()}</span>
          </div>
          
          <div className="px-1">
            <Slider
              min={-maxHoursBack}
              max={0}
              step={1}
              value={[timeOffset]}
              onValueChange={handleTimeChange}
              disabled={!cityData}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToCurrentTime}
              disabled={timeOffset === 0 || !cityData}
            >
              <SkipBack className="h-3 w-3 mr-1" />
              Attuale
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayback}
              disabled={timeOffset === 0 || !cityData}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3 w-3 mr-1" />
                  Pausa
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Riproduci
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSlider;
