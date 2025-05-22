import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
