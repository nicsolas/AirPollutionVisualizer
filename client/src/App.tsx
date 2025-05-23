import { Suspense, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import PageScroller from "./components/PageScroller";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";

// Components
import NavBar from "./components/NavBar";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Pollutants from "./pages/Pollutants";
import NotFound from "./pages/not-found";

function App() {
  // Using functions directly from the store
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  const initialized = useRef(false);
  
  // Carica l'audio per l'applicazione - solo una volta all'avvio
  useEffect(() => {
    // Previene la reinizializzazione
    if (initialized.current) return;
    initialized.current = true;
    
    // Configurazione musica di sottofondo (sarà silenziata di default)
    const backgroundMusic = new Audio("/sounds/background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    
    // Effetti sonori
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");
    
    // Configura l'audio nello store
    setBackgroundMusic(backgroundMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);
    
    // Avvia la musica di sottofondo (sarà silenziata in base allo stato dello store)
    backgroundMusic.play().catch(error => {
      console.log("Riproduzione automatica impedita:", error);
    });
    
    // Pulizia quando il componente viene smontato
    return () => {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <div className="flex flex-col bg-background text-foreground w-full min-h-screen">
      <NavBar />
      
      <main className="flex-1 w-full px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto pb-24 min-h-[calc(100vh-4rem)] relative">
        <Suspense fallback={<div className="p-8 text-center">Caricamento in corso...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/pollutants" element={<Pollutants />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      </main>
      
      <Toaster position="bottom-right" />
      <PageScroller />
    </div>
  );
}

export default App;
