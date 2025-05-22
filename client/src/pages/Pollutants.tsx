import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PollutantType, PollutantInfo } from "@/lib/types";
import { pollutantColors } from "@/lib/utils/colors";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Pollutant information database - same as in InfoPanel.tsx
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

const Pollutants = () => {
  const [selectedPollutant, setSelectedPollutant] = useState<PollutantType>(PollutantType.PM25);
  
  // Selected pollutant info
  const pollutantInfo = pollutantInfoData[selectedPollutant];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">Air Pollutants Information</h1>
      </div>
      
      <Tabs 
        value={selectedPollutant} 
        onValueChange={(value) => setSelectedPollutant(value as PollutantType)}
        className="space-y-6"
      >
        <div className="bg-card rounded-lg p-1">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full">
            {Object.values(PollutantType).map((pollutant) => (
              <TabsTrigger 
                key={pollutant} 
                value={pollutant}
                className="data-[state=active]:shadow-sm"
                style={{ 
                  '--tab-active-color': pollutantColors[pollutant],
                  borderBottom: selectedPollutant === pollutant 
                    ? `3px solid ${pollutantColors[pollutant]}` 
                    : 'none'
                } as any}
              >
                {pollutantInfoData[pollutant].name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {Object.values(PollutantType).map((pollutant) => (
          <TabsContent key={pollutant} value={pollutant} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader 
                  className="pb-2" 
                  style={{ borderBottom: `2px solid ${pollutantColors[pollutant]}` }}
                >
                  <CardTitle className="flex items-center">
                    <span style={{ color: pollutantColors[pollutant] }}>
                      {pollutantInfoData[pollutant].name}
                    </span>
                    <span className="ml-2">- {pollutantInfoData[pollutant].fullName}</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-6 prose dark:prose-invert">
                  <p>{pollutantInfoData[pollutant].description}</p>
                  
                  <div className="bg-muted p-4 rounded-md mt-4">
                    <h3 className="text-lg font-medium mb-2">WHO Guideline Limit</h3>
                    <div className="text-3xl font-bold flex items-baseline">
                      {pollutantInfoData[pollutant].limits.who} 
                      <span className="text-base ml-1 text-muted-foreground">
                        {pollutantInfoData[pollutant].limits.unit}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      The World Health Organization recommends that average exposure should not exceed this value
                      for optimal protection of human health.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Main Sources</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2">
                      {pollutantInfoData[pollutant].sources.map((source, index) => (
                        <li key={index} className="flex items-start">
                          <div 
                            className="mr-2 mt-1 h-2 w-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: pollutantColors[pollutant] }}
                          ></div>
                          <span>{source}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Health Effects</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2">
                      {pollutantInfoData[pollutant].healthEffects.map((effect, index) => (
                        <li key={index} className="flex items-start">
                          <div 
                            className="mr-2 mt-1 h-2 w-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: pollutantColors[pollutant] }}
                          ></div>
                          <span>{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Mitigation Strategies</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pollutant === PollutantType.PM25 || pollutant === PollutantType.PM10 ? (
                    <>
                      <div className="space-y-2">
                        <h3 className="font-medium">For Individuals</h3>
                        <ul className="text-sm space-y-1 list-disc pl-5">
                          <li>Use air purifiers with HEPA filters</li>
                          <li>Keep windows closed on high pollution days</li>
                          <li>Wear masks (N95 or better) when air quality is poor</li>
                          <li>Avoid outdoor exercise during peak pollution times</li>
                          <li>Regularly replace HVAC filters in your home</li>
                        </ul>
                      </div>
                    </>
                  ) : pollutant === PollutantType.NO2 || pollutant === PollutantType.SO2 ? (
                    <>
                      <div className="space-y-2">
                        <h3 className="font-medium">For Individuals</h3>
                        <ul className="text-sm space-y-1 list-disc pl-5">
                          <li>Use public transportation or carpool</li>
                          <li>Ensure proper ventilation when using gas appliances</li>
                          <li>Avoid idling your vehicle</li>
                          <li>Consider electric or hybrid vehicles</li>
                          <li>Use low-VOC products in your home</li>
                        </ul>
                      </div>
                    </>
                  ) : pollutant === PollutantType.O3 ? (
                    <>
                      <div className="space-y-2">
                        <h3 className="font-medium">For Individuals</h3>
                        <ul className="text-sm space-y-1 list-disc pl-5">
                          <li>Follow local ozone alerts and stay indoors during peak times</li>
                          <li>Schedule outdoor activities in the morning or evening</li>
                          <li>Use products with low VOC emissions</li>
                          <li>Conserve energy to reduce power plant emissions</li>
                          <li>Properly maintain your vehicle</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <h3 className="font-medium">For Individuals</h3>
                        <ul className="text-sm space-y-1 list-disc pl-5">
                          <li>Install carbon monoxide detectors in your home</li>
                          <li>Ensure proper ventilation for gas appliances</li>
                          <li>Have heating systems professionally inspected annually</li>
                          <li>Never run generators or grills indoors</li>
                          <li>Avoid idling vehicles in enclosed spaces</li>
                        </ul>
                      </div>
                    </>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">For Communities</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Implement stricter emission standards</li>
                      <li>Promote public transportation</li>
                      <li>Create car-free zones in city centers</li>
                      <li>Invest in renewable energy sources</li>
                      <li>Establish air quality monitoring networks</li>
                      <li>Develop early warning systems for pollution events</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">For Industries</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Adopt cleaner production technologies</li>
                      <li>Install scrubbers and filters on smokestacks</li>
                      <li>Improve energy efficiency</li>
                      <li>Switch to cleaner fuels</li>
                      <li>Implement continuous emissions monitoring</li>
                      <li>Support research for cleaner technologies</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Pollutants;
