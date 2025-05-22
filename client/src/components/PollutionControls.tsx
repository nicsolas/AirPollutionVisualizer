import { PollutantType, VisualizationSettings } from "@/lib/types";
import { usePollution } from "@/lib/stores/usePollution";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sun, Moon, SwitchCamera, PlayCircle, PauseCircle } from "lucide-react";
import { useState } from "react";

const PollutionControls = () => {
  const { 
    visualizationSettings, 
    setVisualizationSetting,
    selectedPollutant,
    setSelectedPollutant 
  } = usePollution();
  
  const [animating, setAnimating] = useState(true);
  
  // Attiva/disattiva animazione
  const toggleAnimation = () => {
    setAnimating(prev => !prev);
  };
  
  // Cambia orario (giorno/notte)
  const toggleTimeOfDay = () => {
    setVisualizationSetting('timeOfDay', 
      visualizationSettings.timeOfDay === 'day' ? 'night' : 'day'
    );
  };
  
  // Cambia modalità di visualizzazione
  const toggleViewMode = () => {
    setVisualizationSetting('viewMode',
      visualizationSettings.viewMode === 'city' ? 'room' : 'city'
    );
  };
  
  return (
    <Card className="min-w-[300px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Controlli Visualizzazione</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selettore inquinante */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Inquinante</label>
          <Select 
            value={selectedPollutant} 
            onValueChange={(value) => setSelectedPollutant(value as PollutantType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona inquinante" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PollutantType.PM25}>{PollutantType.PM25} - Particelle Fini</SelectItem>
              <SelectItem value={PollutantType.PM10}>{PollutantType.PM10} - Particelle Grossolane</SelectItem>
              <SelectItem value={PollutantType.NO2}>{PollutantType.NO2} - Biossido di Azoto</SelectItem>
              <SelectItem value={PollutantType.SO2}>{PollutantType.SO2} - Biossido di Zolfo</SelectItem>
              <SelectItem value={PollutantType.O3}>{PollutantType.O3} - Ozono</SelectItem>
              <SelectItem value={PollutantType.CO}>{PollutantType.CO} - Monossido di Carbonio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Controllo densità */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Densità Particelle</label>
            <span className="text-sm text-muted-foreground">{visualizationSettings.density}%</span>
          </div>
          <Slider
            min={10}
            max={100}
            step={5}
            value={[visualizationSettings.density]}
            onValueChange={(value) => setVisualizationSetting('density', value[0])}
          />
        </div>
        
        {/* Controllo dimensione */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Dimensione Particelle</label>
            <span className="text-sm text-muted-foreground">{visualizationSettings.particleSize.toFixed(1)}</span>
          </div>
          <Slider
            min={0.5}
            max={3.0}
            step={0.1}
            value={[visualizationSettings.particleSize]}
            onValueChange={(value) => setVisualizationSetting('particleSize', value[0])}
          />
        </div>
        
        {/* Controllo velocità */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Velocità Particelle</label>
            <span className="text-sm text-muted-foreground">{visualizationSettings.particleSpeed.toFixed(1)}</span>
          </div>
          <Slider
            min={0.1}
            max={2.0}
            step={0.1}
            value={[visualizationSettings.particleSpeed]}
            onValueChange={(value) => setVisualizationSetting('particleSpeed', value[0])}
          />
        </div>
        
        {/* Controlli rapidi */}
        <div className="pt-2 flex items-center justify-between">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleTimeOfDay}
            title={visualizationSettings.timeOfDay === 'day' ? 'Passa a modalità notturna' : 'Passa a modalità diurna'}
          >
            {visualizationSettings.timeOfDay === 'day' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleViewMode}
            title={visualizationSettings.viewMode === 'city' ? 'Passa a vista stanza' : 'Passa a vista città'}
          >
            <SwitchCamera className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleAnimation}
            title={animating ? 'Metti in pausa animazione' : 'Riprendi animazione'}
          >
            {animating ? (
              <PauseCircle className="h-4 w-4" />
            ) : (
              <PlayCircle className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PollutionControls;
