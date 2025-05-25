import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import PageScroller from "@/components/PageScroller";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageScroller />
      <h1 className="text-3xl font-bold mb-6">Informazioni sulla Visualizzazione dell'Inquinamento Atmosferico</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Comprendere l'Inquinamento Atmosferico</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p>
              L'inquinamento atmosferico è la presenza di sostanze nell'atmosfera che sono dannose per la salute umana 
              e di altri esseri viventi, o che causano danni al clima o ai materiali.
            </p>
            
            <p>
              Esistono molti tipi diversi di inquinanti atmosferici, come gas, particolato e molecole biologiche. 
              L'inquinamento atmosferico può causare malattie, allergie e persino la morte negli esseri umani; 
              può anche danneggiare altri organismi viventi come animali e colture alimentari, e danneggiare l'ambiente 
              naturale o costruito.
            </p>
            
            <h3>Inquinanti Principali</h3>
            <ul>
              <li>
                <strong>Particolato (PM2.5 e PM10)</strong> - Minuscole particelle o goccioline nell'aria abbastanza 
                piccole da essere inalate e potenzialmente causare gravi problemi di salute.
              </li>
              <li>
                <strong>Biossido di Azoto (NO₂)</strong> - Gas emesso principalmente dai gas di scarico dei veicoli e dalle 
                centrali elettriche. Contribuisce alla formazione di smog e piogge acide.
              </li>
              <li>
                <strong>Biossido di Zolfo (SO₂)</strong> - Gas prodotto dalla combustione di combustibili fossili contenenti 
                zolfo, processi industriali ed eruzioni vulcaniche.
              </li>
              <li>
                <strong>Ozono (O₃)</strong> - Mentre è benefico nell'alta atmosfera, l'ozono a livello del suolo è dannoso 
                e si forma quando gli inquinanti di auto, centrali elettriche e altre fonti reagiscono chimicamente alla luce solare.
              </li>
              <li>
                <strong>Monossido di Carbonio (CO)</strong> - Gas incolore e inodore che si forma quando il carbonio nel 
                combustibile non viene bruciato completamente.
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>La Nostra Visualizzazione</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p>
              Questa applicazione fornisce una visualizzazione 3D interattiva dei dati sull'inquinamento atmosferico, permettendoti di:
            </p>
            
            <ul>
              <li>Visualizzare diversi inquinanti in ambienti urbani e interni</li>
              <li>Confrontare i livelli di inquinamento tra diverse città</li>
              <li>Conoscere gli effetti sulla salute e le fonti di vari inquinanti</li>
              <li>Esplorare come i livelli di inquinamento cambiano nel tempo</li>
            </ul>
            
            <h3>Come Utilizzare Questo Strumento</h3>
            <ol>
              <li>Seleziona una città dal menu a tendina</li>
              <li>Scegli un inquinante da visualizzare</li>
              <li>Usa i controlli per regolare i parametri di visualizzazione</li>
              <li>Alterna tra viste giorno/notte e prospettive città/stanza</li>
              <li>Usa lo slider temporale per vedere come i livelli di inquinamento cambiano durante il giorno</li>
            </ol>
            
            <h3>Informazioni sui Dati</h3>
            <p>
              I dati sull'inquinamento utilizzati in questa applicazione provengono da reti pubbliche di monitoraggio 
              della qualità dell'aria e agenzie ambientali di tutto il mondo. L'intensità della visualizzazione e la densità 
              delle particelle sono proporzionali alle concentrazioni effettive degli inquinanti.
            </p>
            
            <p>
              I valori dell'Indice di Qualità dell'Aria (AQI) seguono le classificazioni internazionali standard:
            </p>
            <ul>
              <li>0-50: Buono (Verde)</li>
              <li>51-100: Moderato (Giallo)</li>
              <li>101-150: Non salutare per Gruppi Sensibili (Arancione)</li>
              <li>151-200: Non salutare (Rosso)</li>
              <li>201-300: Molto Non salutare (Viola)</li>
              <li>301+: Pericoloso (Bordeaux)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Risorse Aggiuntive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="https://www.who.int/health-topics/air-pollution" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors">
                <ExternalLink className="h-5 w-5 flex-shrink-0" />
                <span>Organizzazione Mondiale della Sanità - Inquinamento Atmosferico</span>
              </a>
              
              <a href="https://www.epa.gov/air-pollution-transportation" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors">
                <ExternalLink className="h-5 w-5 flex-shrink-0" />
                <span>EPA - Inquinamento Atmosferico da Trasporti</span>
              </a>
              
              <a href="https://www.unep.org/explore-topics/air" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors">
                <ExternalLink className="h-5 w-5 flex-shrink-0" />
                <span>Programma Ambientale ONU - Qualità dell'Aria</span>
              </a>
              
              <a href="https://www.snpambiente.it/aria/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors">
                <ExternalLink className="h-5 w-5 flex-shrink-0" />
                <span>SNPA - Sistema Nazionale Protezione Ambientale</span>
              </a>
              
              <a href="https://github.com/nicsolas/AirPollutionVisualizer" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 flex-shrink-0"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2Z" /></svg>
                <span>Depository GitHub - AirPollutionVisualizer</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
