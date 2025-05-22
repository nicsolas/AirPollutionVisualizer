import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About Air Pollution Visualization</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Understanding Air Pollution</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p>
              Air pollution is the presence of substances in the atmosphere that are harmful to the health of humans 
              and other living beings, or cause damage to the climate or to materials.
            </p>
            
            <p>
              There are many different types of air pollutants, such as gases, particulate matter, and biological 
              molecules. Air pollution can cause diseases, allergies, and even death to humans; it can also cause 
              harm to other living organisms such as animals and food crops, and may damage the natural or built 
              environment.
            </p>
            
            <h3>Key Pollutants</h3>
            <ul>
              <li>
                <strong>Particulate Matter (PM2.5 and PM10)</strong> - Tiny particles or droplets in the air that 
                are small enough to be inhaled and potentially cause serious health problems.
              </li>
              <li>
                <strong>Nitrogen Dioxide (NO₂)</strong> - A gas primarily emitted from vehicle exhausts and power plants. 
                It contributes to the formation of smog and acid rain.
              </li>
              <li>
                <strong>Sulfur Dioxide (SO₂)</strong> - A gas produced from burning fossil fuels containing sulfur, 
                industrial processes, and volcanoes.
              </li>
              <li>
                <strong>Ozone (O₃)</strong> - While beneficial in the upper atmosphere, ground-level ozone is harmful 
                and forms when pollutants from cars, power plants, and other sources react chemically in sunlight.
              </li>
              <li>
                <strong>Carbon Monoxide (CO)</strong> - A colorless, odorless gas that is formed when carbon in fuel 
                is not burned completely.
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Our Visualization</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p>
              This application provides an interactive 3D visualization of air pollution data, allowing you to:
            </p>
            
            <ul>
              <li>Visualize different pollutants in urban and indoor environments</li>
              <li>Compare pollution levels across different cities</li>
              <li>Learn about health effects and sources of various pollutants</li>
              <li>Explore how pollution levels change over time</li>
            </ul>
            
            <h3>How to Use This Tool</h3>
            <ol>
              <li>Select a city from the dropdown menu</li>
              <li>Choose a pollutant to visualize</li>
              <li>Use the controls to adjust visualization parameters</li>
              <li>Toggle between day/night views and city/room perspectives</li>
              <li>Use the time slider to see how pollution levels change throughout the day</li>
            </ol>
            
            <h3>About the Data</h3>
            <p>
              The pollution data used in this application is sourced from public air quality monitoring networks 
              and environmental agencies worldwide. The visualization intensity and particle density are proportional 
              to actual pollutant concentrations.
            </p>
            
            <p>
              Air Quality Index (AQI) values follow standard international classifications:
            </p>
            <ul>
              <li>0-50: Good (Green)</li>
              <li>51-100: Moderate (Yellow)</li>
              <li>101-150: Unhealthy for Sensitive Groups (Orange)</li>
              <li>151-200: Unhealthy (Red)</li>
              <li>201-300: Very Unhealthy (Purple)</li>
              <li>301+: Hazardous (Maroon)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="https://www.who.int/health-topics/air-pollution" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors">
                <ExternalLink className="h-5 w-5 flex-shrink-0" />
                <span>World Health Organization - Air Pollution</span>
              </a>
              
              <a href="https://www.epa.gov/air-pollution-transportation" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors">
                <ExternalLink className="h-5 w-5 flex-shrink-0" />
                <span>EPA - Air Pollution Transportation</span>
              </a>
              
              <a href="https://www.unep.org/explore-topics/air" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors">
                <ExternalLink className="h-5 w-5 flex-shrink-0" />
                <span>UN Environment Programme - Air Quality</span>
              </a>
              
              <a href="https://www.lung.org/clean-air" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors">
                <ExternalLink className="h-5 w-5 flex-shrink-0" />
                <span>American Lung Association - Clean Air</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
