import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, ArrowUp, ArrowDown, Home } from 'lucide-react';
import { Button } from './ui/button';

const PageScroller = () => {
  // Mostra sempre lo scroller (non lo nascondiamo più)
  const [scrollPosition, setScrollPosition] = useState(0);
  const [totalHeight, setTotalHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  
  // Aggiorna le informazioni sulla posizione di scroll
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const height = document.body.scrollHeight;
      const viewport = window.innerHeight;
      const percentage = (position / (height - viewport)) * 100;
      
      setScrollPosition(position);
      setTotalHeight(height);
      setViewportHeight(viewport);
      setScrollPercentage(Math.min(100, Math.max(0, percentage)));
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

  // Scorri verso il basso di una sezione
  const scrollDownSection = () => {
    const nextPosition = scrollPosition + viewportHeight * 0.8;
    window.scrollTo({
      top: Math.min(totalHeight - viewportHeight, nextPosition),
      behavior: 'smooth'
    });
  };

  // Scorri verso l'alto di una sezione
  const scrollUpSection = () => {
    const prevPosition = scrollPosition - viewportHeight * 0.8;
    window.scrollTo({
      top: Math.max(0, prevPosition),
      behavior: 'smooth'
    });
  };

  // Scorri verso il basso di una piccola quantità
  const scrollDownSmall = () => {
    window.scrollBy({
      top: 100,
      behavior: 'smooth'
    });
  };

  // Scorri verso l'alto di una piccola quantità
  const scrollUpSmall = () => {
    window.scrollBy({
      top: -100,
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

  // Vai alla fine della pagina
  const scrollToBottom = () => {
    window.scrollTo({
      top: totalHeight,
      behavior: 'smooth'
    });
  };

  const progressBarWidth = `${scrollPercentage}%`;

  return (
    <>
      {/* Barra di progresso verticale */}
      <div className="fixed right-2 top-1/2 transform -translate-y-1/2 h-[60vh] w-2 bg-gray-200 rounded-full z-50 flex flex-col items-center">
        <div 
          className="absolute top-0 left-0 w-full bg-primary rounded-full transition-all duration-200"
          style={{ height: progressBarWidth, maxHeight: '100%' }}
        />
        
        {/* Thumb/indicatore della barra che è trascinabile */}
        <div 
          className="absolute w-5 h-5 rounded-full bg-primary shadow-md cursor-pointer transform -translate-x-1.5 hover:scale-110 transition-transform"
          style={{ top: `calc(${scrollPercentage}% - 10px)` }}
          onClick={(e) => {
            // Calcola la posizione di click relativa alla barra
            const bar = e.currentTarget.parentElement;
            if (!bar) return;
            
            const rect = bar.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            const percentage = clickY / rect.height;
            
            // Scrolliamo alla posizione corrispondente
            window.scrollTo({
              top: (totalHeight - viewportHeight) * percentage,
              behavior: 'smooth'
            });
          }}
        />
      </div>
      
      {/* Controlli di navigazione principali */}
      <div className="fixed left-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-50">
        <Button
          variant="secondary"
          size="icon"
          onClick={scrollToTop}
          className="rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all"
          title="Vai all'inizio"
        >
          <Home className="h-5 w-5" />
        </Button>
        
        <Button
          variant="secondary"
          size="icon"
          onClick={scrollUpSection}
          className="rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all"
          title="Pagina su"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={scrollUpSmall}
          className="rounded-full bg-background/80 backdrop-blur-sm shadow hover:bg-background/90"
          title="Scorri su"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={scrollDownSmall}
          className="rounded-full bg-background/80 backdrop-blur-sm shadow hover:bg-background/90"
          title="Scorri giù"
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
        
        <Button
          variant="secondary"
          size="icon"
          onClick={scrollDownSection}
          className="rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all"
          title="Pagina giù"
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Indicatore di posizione */}
      <div className="fixed right-2 bottom-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs shadow z-50">
        {Math.round(scrollPercentage)}%
      </div>
    </>
  );
};

export default PageScroller;