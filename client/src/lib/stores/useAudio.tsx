import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  
  // Funzioni setter
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
  // Funzioni di controllo
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: false, // Inizia non silenziato
  
  setBackgroundMusic: (music) => {
    set({ backgroundMusic: music });
    // Applica lo stato di silenziamento attuale
    const { isMuted } = get();
    music.muted = isMuted;
  },
  
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  
  toggleMute: () => {
    const { isMuted, backgroundMusic } = get();
    const newMutedState = !isMuted;
    
    // Aggiorna lo stato
    set({ isMuted: newMutedState });
    
    // Applica direttamente il silenziamento alla musica di sottofondo
    if (backgroundMusic) {
      backgroundMusic.muted = newMutedState;
    }
    
    // Registra il cambiamento
    console.log(`Audio ${newMutedState ? 'silenziato' : 'attivato'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      // Se l'audio è silenziato, non riprodurre nulla
      if (isMuted) {
        console.log("Effetto sonoro saltato (silenziato)");
        return;
      }
      
      // Clona il suono per consentire la riproduzione sovrapposta
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Riproduzione effetto sonoro impedita:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      // Se l'audio è silenziato, non riprodurre nulla
      if (isMuted) {
        console.log("Effetto sonoro successo saltato (silenziato)");
        return;
      }
      
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Riproduzione effetto sonoro successo impedita:", error);
      });
    }
  }
}));
