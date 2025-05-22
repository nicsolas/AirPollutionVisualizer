import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePollution } from "@/lib/stores/usePollution";
import { Button } from "@/components/ui/button";
import CitySelector from "@/components/CitySelector";
import AirQualityIndex from "@/components/AirQualityIndex";
import PollutionControls from "@/components/PollutionControls";
import PollutionScene from "@/components/PollutionScene";
import InfoPanel from "@/components/InfoPanel";
import TimeSlider from "@/components/TimeSlider";
import { Card, CardContent } from "@/components/ui/card";
import { CityPollutionData } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const { 
    selectedCity, 
    timeOffset, 
    setCityData, 
    setError, 
    setLoading 
  } = usePollution();
  
  // Fetch pollution data for selected city
  const { data, isLoading, error } = useQuery<CityPollutionData>({
    queryKey: [`/api/pollution/${selectedCity}?offset=${timeOffset}`],
    enabled: selectedCity !== "",
  });
  
  // Update store when data changes
  useEffect(() => {
    setLoading(isLoading);
    
    if (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch pollution data");
    } else if (data) {
      setCityData(data);
    }
  }, [data, isLoading, error, setCityData, setError, setLoading]);
  
  return (
    <div className="container mx-auto px-4 py-6 flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Air Pollution Visualization</h1>
          <p className="text-muted-foreground">
            Explore air pollution data in an interactive 3D environment
          </p>
        </div>
        
        <CitySelector />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 flex-grow">
        {/* Main visualization area */}
        <div className="lg:col-span-2 flex flex-col">
          <Card className="flex-grow overflow-hidden">
            <CardContent className="p-0 h-[50vh] lg:h-full">
              <PollutionScene />
            </CardContent>
          </Card>
          
          <div className="mt-4">
            <TimeSlider />
          </div>
        </div>
        
        {/* Controls and information */}
        <div className="flex flex-col gap-6">
          <AirQualityIndex />
          <PollutionControls />
          <InfoPanel />
          
          <Button asChild className="mt-auto">
            <Link to="/pollutants">
              Learn more about pollutants
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
