import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from './ui/button';

const PageScroller = () => {
  const [showScroller, setShowScroller] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Controlla la posizione di scorrimento per mostrare/nascondere i controlli
  useEffect(() => {
    const handleScroll = () => {
      // Mostra controlli solo quando la pagina è abbastanza lunga
      const isPageLong = document.body.scrollHeight > window.innerHeight * 1.5;
      setShowScroller(isPageLong);
      
      // Mostra pulsante "torna in alto" solo quando si è scrollato abbastanza in basso
      setShowScrollToTop(window.scrollY > 300);
    };

    // Verifica iniziale
    handleScroll();
    
    // Ascolta eventi di scroll
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Scorri alla sezione successiva
  const scrollToNextSection = () => {
    const currentPos = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Cerca la prossima "sezione" - considera una sezione come circa l'altezza della finestra
    const nextSectionPos = Math.ceil((currentPos + 100) / windowHeight) * windowHeight;
    
    window.scrollTo({
      top: nextSectionPos,
      behavior: 'smooth'
    });
  };

  // Scorri alla sezione precedente
  const scrollToPrevSection = () => {
    const currentPos = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Cerca la sezione precedente
    const prevSectionPos = Math.floor((currentPos - 100) / windowHeight) * windowHeight;
    
    window.scrollTo({
      top: Math.max(0, prevSectionPos),
      behavior: 'smooth'
    });
  };

  // Torna all'inizio della pagina
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!showScroller) return null;

  return (
    <>
      {/* Controlli di scorrimento verticale */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={scrollToPrevSection}
          aria-label="Scorri in alto"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={scrollToNextSection}
          aria-label="Scorri in basso"
        >
          <ChevronUp className="h-4 w-4 transform rotate-180" />
        </Button>
      </div>
      
      {/* Pulsante torna in alto (visibile solo quando necessario) */}
      {showScrollToTop && (
        <Button
          variant="secondary"
          size="sm"
          className="fixed right-4 bottom-4 z-50 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={scrollToTop}
          aria-label="Torna all'inizio"
        >
          <ChevronUp className="h-4 w-4 mr-1" />
          <span className="text-xs">Inizio</span>
        </Button>
      )}
    </>
  );
};

export default PageScroller;