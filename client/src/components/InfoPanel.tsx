import { PollutantType, PollutantInfo } from "@/lib/types";
import { usePollution } from "@/lib/stores/usePollution";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { pollutantColors } from "@/lib/utils/colors";

// Database informazioni inquinanti
const pollutantInfoData: Record<PollutantType, PollutantInfo> = {
  [PollutantType.PM25]: {
    id: PollutantType.PM25,
    name: "PM2.5",
    fullName: "Particolato Fine",
    description: "Particelle o goccioline nell'aria con diametro inferiore a 2,5 micron. Possono penetrare in profondità nel tratto respiratorio, raggiungendo i polmoni e potenzialmente entrando nel flusso sanguigno.",
    sources: [
      "Emissioni veicolari",
      "Centrali elettriche",
      "Processi industriali",
      "Combustione legna domestica",
      "Incendi boschivi"
    ],
    healthEffects: [
      "Aggravamento dell'asma",
      "Riduzione della funzione polmonare",
      "Battito cardiaco irregolare",
      "Morte prematura in persone con malattie cardiache o polmonari"
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
    fullName: "Particolato Grossolano",
    description: "Particelle inalabili con diametro inferiore a 10 micrometri, che possono entrare nei polmoni e causare problemi di salute.",
    sources: [
      "Polvere stradale",
      "Cantieri edili",
      "Operazioni minerarie",
      "Attività agricole",
      "Polvere trasportata dal vento"
    ],
    healthEffects: [
      "Irritazione respiratoria",
      "Riduzione della funzione polmonare",
      "Aggravamento dell'asma",
      "Sviluppo di bronchite cronica"
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
    fullName: "Biossido di Azoto",
    description: "Gas di colore rosso-bruno con odore pungente e acre. È uno di un gruppo di gas altamente reattivi noti come ossidi di azoto (NOx).",
    sources: [
      "Emissioni veicolari",
      "Centrali elettriche",
      "Processi industriali",
      "Attrezzature fuori strada"
    ],
    healthEffects: [
      "Infiammazione delle vie aeree",
      "Riduzione della funzione polmonare",
      "Aumento di attacchi d'asma",
      "Infezioni respiratorie"
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
    fullName: "Biossido di Zolfo",
    description: "Gas incolore con odore pungente. È prodotto dalla combustione di combustibili fossili contenenti composti di zolfo.",
    sources: [
      "Combustione di combustibili fossili",
      "Processi industriali",
      "Centrali a carbone",
      "Eruzioni vulcaniche"
    ],
    healthEffects: [
      "Difficoltà respiratorie",
      "Irritazione respiratoria",
      "Aggravamento dell'asma",
      "Contributo alla formazione di particelle con effetti sulla salute"
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
    fullName: "Ozono",
    description: "Gas composto da tre atomi di ossigeno. L'ozono a livello del suolo è un inquinante atmosferico dannoso e un componente chiave dello smog.",
    sources: [
      "Reazione chimica degli inquinanti (NOx e COV) con la luce solare",
      "Emissioni veicolari",
      "Emissioni industriali",
      "Solventi chimici"
    ],
    healthEffects: [
      "Irritazione alla gola",
      "Infiammazione polmonare",
      "Riduzione della funzione polmonare",
      "Aggravamento dell'asma",
      "Danni polmonari permanenti con esposizione ripetuta"
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
    fullName: "Monossido di Carbonio",
    description: "Gas incolore e inodore tossico ad alte concentrazioni. È prodotto dalla combustione incompleta di combustibili contenenti carbonio.",
    sources: [
      "Gas di scarico dei veicoli",
      "Combustione di carburanti",
      "Processi industriali",
      "Elettrodomestici",
      "Incendi"
    ],
    healthEffects: [
      "Riduzione del trasporto di ossigeno agli organi",
      "Mal di testa e vertigini",
      "Confusione",
      "Perdita di coscienza ad alte concentrazioni",
      "Morte a concentrazioni molto elevate"
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

  // Ottieni il valore corrente per l'inquinante selezionato
  const currentValue = cityData?.data.pollutants[selectedPollutant]?.value;
  const unit = cityData?.data.pollutants[selectedPollutant]?.unit;

  // Stile colore per l'inquinante
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
            <TabsTrigger value="sources">Fonti</TabsTrigger>
            <TabsTrigger value="health">Effetti sulla Salute</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <p>{pollutantInfo.description}</p>
            <div>
              <p className="text-sm font-medium">Limite OMS consigliato:</p>
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