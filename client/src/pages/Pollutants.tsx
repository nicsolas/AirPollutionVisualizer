import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PollutantType, PollutantInfo } from "@/lib/types";
import { pollutantColors } from "@/lib/utils/colors";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PageScroller from "@/components/PageScroller";

// Database informazioni inquinanti - uguale a InfoPanel.tsx
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

const Pollutants = () => {
  const [selectedPollutant, setSelectedPollutant] = useState<PollutantType>(PollutantType.PM25);
  
  // Informazioni sull'inquinante selezionato
  const pollutantInfo = pollutantInfoData[selectedPollutant];
  
  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      {/* Aggiungiamo il componente di scorrimento pagina */}
      <PageScroller />
      
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">Informazioni sugli Inquinanti Atmosferici</h1>
      </div>
      
      <Tabs 
        value={selectedPollutant} 
        onValueChange={(value) => setSelectedPollutant(value as PollutantType)}
        className="space-y-6"
      >
        <div className="bg-card rounded-lg p-1 sticky top-16 z-10">
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
                    <h3 className="text-lg font-medium mb-2">Limite Raccomandato OMS</h3>
                    <div className="text-3xl font-bold flex items-baseline">
                      {pollutantInfoData[pollutant].limits.who} 
                      <span className="text-base ml-1 text-muted-foreground">
                        {pollutantInfoData[pollutant].limits.unit}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      L'Organizzazione Mondiale della Sanità raccomanda che l'esposizione media non superi questo valore
                      per una protezione ottimale della salute umana.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Fonti Principali</CardTitle>
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
                    <CardTitle>Effetti sulla Salute</CardTitle>
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
                <CardTitle>Strategie di Mitigazione</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pollutant === PollutantType.PM25 || pollutant === PollutantType.PM10 ? (
                    <>
                      <div className="space-y-2">
                        <h3 className="font-medium">Per gli Individui</h3>
                        <ul className="text-sm space-y-1 list-disc pl-5">
                          <li>Utilizzare purificatori d'aria con filtri HEPA</li>
                          <li>Tenere le finestre chiuse nei giorni ad alto inquinamento</li>
                          <li>Indossare mascherine (N95 o migliori) quando la qualità dell'aria è scarsa</li>
                          <li>Evitare attività all'aperto durante i picchi di inquinamento</li>
                          <li>Sostituire regolarmente i filtri HVAC a casa</li>
                        </ul>
                      </div>
                    </>
                  ) : pollutant === PollutantType.NO2 || pollutant === PollutantType.SO2 ? (
                    <>
                      <div className="space-y-2">
                        <h3 className="font-medium">Per gli Individui</h3>
                        <ul className="text-sm space-y-1 list-disc pl-5">
                          <li>Utilizzare i mezzi pubblici o condividere l'auto</li>
                          <li>Garantire una ventilazione adeguata quando si usano apparecchi a gas</li>
                          <li>Evitare di lasciare il motore acceso da fermi</li>
                          <li>Considerare veicoli elettrici o ibridi</li>
                          <li>Utilizzare prodotti a basso contenuto di COV in casa</li>
                        </ul>
                      </div>
                    </>
                  ) : pollutant === PollutantType.O3 ? (
                    <>
                      <div className="space-y-2">
                        <h3 className="font-medium">Per gli Individui</h3>
                        <ul className="text-sm space-y-1 list-disc pl-5">
                          <li>Seguire gli avvisi locali sull'ozono e rimanere al chiuso nei momenti di picco</li>
                          <li>Programmare le attività all'aperto al mattino o alla sera</li>
                          <li>Utilizzare prodotti con basse emissioni di COV</li>
                          <li>Risparmiare energia per ridurre le emissioni delle centrali elettriche</li>
                          <li>Mantenere correttamente il proprio veicolo</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <h3 className="font-medium">Per gli Individui</h3>
                        <ul className="text-sm space-y-1 list-disc pl-5">
                          <li>Installare rilevatori di monossido di carbonio in casa</li>
                          <li>Garantire una ventilazione adeguata per gli apparecchi a gas</li>
                          <li>Far ispezionare professionalmente i sistemi di riscaldamento ogni anno</li>
                          <li>Non utilizzare mai generatori o griglie al chiuso</li>
                          <li>Evitare di lasciare i veicoli con motore acceso in spazi chiusi</li>
                        </ul>
                      </div>
                    </>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Per le Comunità</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Implementare standard di emissione più severi</li>
                      <li>Promuovere il trasporto pubblico</li>
                      <li>Creare zone senza auto nei centri città</li>
                      <li>Investire in fonti di energia rinnovabile</li>
                      <li>Stabilire reti di monitoraggio della qualità dell'aria</li>
                      <li>Sviluppare sistemi di allerta precoce per eventi di inquinamento</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Per le Industrie</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Adottare tecnologie di produzione più pulite</li>
                      <li>Installare depuratori e filtri sui camini</li>
                      <li>Migliorare l'efficienza energetica</li>
                      <li>Passare a combustibili più puliti</li>
                      <li>Implementare il monitoraggio continuo delle emissioni</li>
                      <li>Sostenere la ricerca per tecnologie più pulite</li>
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
