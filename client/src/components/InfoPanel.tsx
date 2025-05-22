import { PollutantType, PollutantInfo } from "@/lib/types";
import { usePollution } from "@/lib/stores/usePollution";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { pollutantColors } from "@/lib/utils/colors";

// Pollutant information database
const pollutantInfoData: Record<PollutantType, PollutantInfo> = {
  [PollutantType.PM25]: {
    id: PollutantType.PM25,
    name: "PM2.5",
    fullName: "Fine Particulate Matter",
    description: "Tiny particles or droplets in the air that are 2.5 microns or less in width. They can travel deep into the respiratory tract, reaching the lungs and potentially entering the bloodstream.",
    sources: [
      "Vehicle emissions",
      "Power plants",
      "Industrial processes",
      "Residential wood burning",
      "Forest fires"
    ],
    healthEffects: [
      "Aggravated asthma",
      "Decreased lung function",
      "Irregular heartbeat",
      "Premature death in people with heart or lung disease"
    ],
    limits: {
      who: 5,
      unit: "μg/m³"
    },
    color: pollutantColors[PollutantType.PM25]
  },
  [PollutantType.PM10]: {
    id: PollutantType.PM10,
    name: "PM10",
    fullName: "Coarse Particulate Matter",
    description: "Inhalable particles that are 10 micrometers or less in diameter, which can enter the lungs and cause health problems.",
    sources: [
      "Road dust",
      "Construction",
      "Mining operations",
      "Agricultural activities",
      "Wind-blown dust"
    ],
    healthEffects: [
      "Respiratory irritation",
      "Decreased lung function",
      "Aggravated asthma",
      "Development of chronic bronchitis"
    ],
    limits: {
      who: 15,
      unit: "μg/m³"
    },
    color: pollutantColors[PollutantType.PM10]
  },
  [PollutantType.NO2]: {
    id: PollutantType.NO2,
    name: "NO₂",
    fullName: "Nitrogen Dioxide",
    description: "A reddish-brown gas with a pungent, acrid odor. It is one of a group of highly reactive gases known as nitrogen oxides (NOx).",
    sources: [
      "Vehicle emissions",
      "Power plants",
      "Industrial processes",
      "Off-road equipment"
    ],
    healthEffects: [
      "Airway inflammation",
      "Reduced lung function",
      "Increased asthma attacks",
      "Respiratory infections"
    ],
    limits: {
      who: 10,
      unit: "μg/m³"
    },
    color: pollutantColors[PollutantType.NO2]
  },
  [PollutantType.SO2]: {
    id: PollutantType.SO2,
    name: "SO₂",
    fullName: "Sulfur Dioxide",
    description: "A colorless gas with a sharp odor. It is produced from burning fossil fuels containing sulfur compounds.",
    sources: [
      "Fossil fuel combustion",
      "Industrial processes",
      "Coal-burning power plants",
      "Volcanic eruptions"
    ],
    healthEffects: [
      "Breathing difficulties",
      "Respiratory irritation",
      "Aggravated asthma",
      "Contribution to particle formation with associated health effects"
    ],
    limits: {
      who: 40,
      unit: "μg/m³"
    },
    color: pollutantColors[PollutantType.SO2]
  },
  [PollutantType.O3]: {
    id: PollutantType.O3,
    name: "O₃",
    fullName: "Ozone",
    description: "A gas composed of three atoms of oxygen. Ground-level ozone is a harmful air pollutant and a key component of smog.",
    sources: [
      "Chemical reaction of pollutants (NOx and VOCs) with sunlight",
      "Vehicle emissions",
      "Industrial emissions",
      "Chemical solvents"
    ],
    healthEffects: [
      "Throat irritation",
      "Lung inflammation",
      "Reduced lung function",
      "Aggravated asthma",
      "Permanent lung damage with repeated exposure"
    ],
    limits: {
      who: 100,
      unit: "μg/m³"
    },
    color: pollutantColors[PollutantType.O3]
  },
  [PollutantType.CO]: {
    id: PollutantType.CO,
    name: "CO",
    fullName: "Carbon Monoxide",
    description: "A colorless, odorless gas that is toxic at high levels. It is produced by the incomplete burning of carbon-containing fuels.",
    sources: [
      "Vehicle exhaust",
      "Fuel combustion",
      "Industrial processes",
      "Household appliances",
      "Wildfires"
    ],
    healthEffects: [
      "Reduced oxygen delivery to organs",
      "Headache and dizziness",
      "Confusion",
      "Unconsciousness at high concentrations",
      "Death at very high concentrations"
    ],
    limits: {
      who: 4,
      unit: "mg/m³"
    },
    color: pollutantColors[PollutantType.CO]
  }
};

const InfoPanel = () => {
  const { selectedPollutant, cityData } = usePollution();
  
  const pollutantInfo = pollutantInfoData[selectedPollutant];
  
  // Get the current value for the selected pollutant
  const currentValue = cityData?.data.pollutants[selectedPollutant]?.value;
  const unit = cityData?.data.pollutants[selectedPollutant]?.unit;
  
  // Color style for the pollutant
  const colorStyle = { color: pollutantInfo.color };
  const badgeStyle = { backgroundColor: pollutantInfo.color };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          <span style={colorStyle}>{pollutantInfo.name}</span> - {pollutantInfo.fullName}
        </CardTitle>
        
        {currentValue !== undefined && (
          <Badge style={badgeStyle} className="text-white ml-2">
            {currentValue} {unit}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="health">Health Effects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <p>{pollutantInfo.description}</p>
            <div>
              <p className="text-sm font-medium">WHO Guideline Limit:</p>
              <p className="text-sm">
                {pollutantInfo.limits.who} {pollutantInfo.limits.unit}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="sources">
            <ul className="space-y-2 list-disc pl-5">
              {pollutantInfo.sources.map((source, index) => (
                <li key={index} className="text-sm">{source}</li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="health">
            <ul className="space-y-2 list-disc pl-5">
              {pollutantInfo.healthEffects.map((effect, index) => (
                <li key={index} className="text-sm">{effect}</li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InfoPanel;
