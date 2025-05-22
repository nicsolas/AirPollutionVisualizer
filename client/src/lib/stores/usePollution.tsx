import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { PollutantType, CityPollutionData, VisualizationSettings } from "../types";

interface PollutionState {
  // Selected parameters
  selectedCity: string;
  selectedPollutant: PollutantType;
  timeOffset: number; // 0 = current, negative = past hours
  
  // Visualization settings
  visualizationSettings: VisualizationSettings;
  
  // Data
  cityData: CityPollutionData | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSelectedCity: (cityId: string) => void;
  setSelectedPollutant: (pollutant: PollutantType) => void;
  setTimeOffset: (offset: number) => void;
  setVisualizationSetting: <K extends keyof VisualizationSettings>(
    key: K, 
    value: VisualizationSettings[K]
  ) => void;
  setCityData: (data: CityPollutionData | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePollution = create<PollutionState>()(
  subscribeWithSelector((set) => ({
    // Default values
    selectedCity: "london",
    selectedPollutant: PollutantType.PM25,
    timeOffset: 0,
    
    visualizationSettings: {
      pollutant: PollutantType.PM25,
      density: 50,
      particleSize: 1.0,
      particleSpeed: 0.5,
      timeOfDay: 'day',
      viewMode: 'city',
    },
    
    cityData: null,
    isLoading: false,
    error: null,
    
    // Actions
    setSelectedCity: (cityId) => {
      set({ selectedCity: cityId, isLoading: true, error: null });
    },
    
    setSelectedPollutant: (pollutant) => {
      set((state) => ({ 
        selectedPollutant: pollutant,
        visualizationSettings: {
          ...state.visualizationSettings,
          pollutant
        }
      }));
    },
    
    setTimeOffset: (offset) => {
      set({ timeOffset: offset });
    },
    
    setVisualizationSetting: (key, value) => {
      set((state) => ({
        visualizationSettings: {
          ...state.visualizationSettings,
          [key]: value
        }
      }));
    },
    
    setCityData: (data) => {
      set({ cityData: data, isLoading: false });
    },
    
    setLoading: (isLoading) => {
      set({ isLoading });
    },
    
    setError: (error) => {
      set({ error, isLoading: false });
    }
  }))
);
