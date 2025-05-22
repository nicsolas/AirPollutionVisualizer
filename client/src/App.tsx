import { Suspense, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
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
  
  // Load audio for application - only once on mount
  useEffect(() => {
    // Prevent re-initialization
    if (initialized.current) return;
    initialized.current = true;
    
    // Background music setup (will be muted by default)
    const backgroundMusic = new Audio("/sounds/background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    
    // Sound effects
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");
    
    // Setup audio in store
    setBackgroundMusic(backgroundMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);
    
    // Start background music (will be muted based on store state)
    backgroundMusic.play().catch(error => {
      console.log("Auto-play prevented:", error);
    });
    
    // Cleanup when component unmounts
    return () => {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />
      
      <main className="flex-1">
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/pollutants" element={<Pollutants />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
