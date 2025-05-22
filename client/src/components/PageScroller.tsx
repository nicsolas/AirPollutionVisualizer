import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, ArrowUp, ArrowDown, Home } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const PageScroller = () => {
  // Mostra sempre lo scroller
  const [scrollPosition, setScrollPosition] = useState(0);
  const [totalHeight, setTotalHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  
  // Aggiorna le informazioni sulla posizione di scroll
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const height = document.body.scrollHeight;
      const viewport = window.innerHeight;
      
      // Previeni divisione per zero
      const maxScroll = Math.max(1, height - viewport);
      const percentage = (position / maxScroll) * 100;
      
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

  // Funzioni di navigazione

  // Scorri verso il basso di una sezione
  const scrollDownSection = () => {
    if (typeof window !== 'undefined') {
      const nextPosition = scrollPosition + viewportHeight * 0.8;
      window.scrollTo({
        top: Math.min(totalHeight - viewportHeight, nextPosition),
        behavior: 'smooth'
      });
    }
  };

  // Scorri verso l'alto di una sezione
  const scrollUpSection = () => {
    if (typeof window !== 'undefined') {
      const prevPosition = scrollPosition - viewportHeight * 0.8;
      window.scrollTo({
        top: Math.max(0, prevPosition),
        behavior: 'smooth'
      });
    }
  };

  // Scorri verso il basso di una piccola quantità
  const scrollDownSmall = () => {
    if (typeof window !== 'undefined') {
      window.scrollBy({
        top: 100,
        behavior: 'smooth'
      });
    }
  };

  // Scorri verso l'alto di una piccola quantità
  const scrollUpSmall = () => {
    if (typeof window !== 'undefined') {
      window.scrollBy({
        top: -100,
        behavior: 'smooth'
      });
    }
  };

  // Torna all'inizio della pagina
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Vai alla fine della pagina
  const scrollToBottom = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: totalHeight,
        behavior: 'smooth'
      });
    }
  };

  // Permette di trascinare la barra di scorrimento
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined') {
      const bar = e.currentTarget;
      if (!bar) return;
      
      const rect = bar.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const percentage = clickY / rect.height;
      
      // Scrolliamo alla posizione corrispondente
      window.scrollTo({
        top: Math.max(0, Math.min(totalHeight - viewportHeight, (totalHeight - viewportHeight) * percentage)),
        behavior: 'smooth'
      });
    }
  };

  // Animate button tooltip
  const ButtonTooltip = ({ text }: { text: string }) => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -10 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: -10 }}
        className="absolute left-12 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs shadow-lg whitespace-nowrap"
      >
        {text}
      </motion.div>
    </AnimatePresence>
  );

  // Verifica se il documento è abbastanza lungo per richiedere lo scroller
  const isPageScrollable = totalHeight > viewportHeight * 1.2;
  
  // Se la pagina non è scorrevole, non mostriamo lo scroller
  if (!isPageScrollable) return null;

  return (
    <>
      {/* Barra di progresso verticale - con animazione */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 h-[60vh] w-3 bg-gray-200/60 backdrop-blur-sm rounded-full z-50 flex flex-col items-center cursor-pointer"
        onClick={handleProgressBarClick}
      >
        <motion.div 
          className="absolute top-0 left-0 w-full bg-primary rounded-full"
          style={{ height: `${scrollPercentage}%`, maxHeight: '100%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          layout
        />
        
        {/* Thumb/indicatore della barra che è trascinabile */}
        <motion.div 
          className="absolute w-6 h-6 rounded-full bg-primary shadow-md cursor-pointer -translate-x-1.5"
          style={{ top: `calc(${scrollPercentage}% - 12px)` }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={(e, info) => {
            // Usa e.target invece di e.currentTarget.parentElement
            const parentElement = e.target as HTMLElement;
            const bar = parentElement.closest('div[class*="h-[60vh]"]');
            if (!bar) return;
            
            const rect = bar.getBoundingClientRect();
            const percentage = Math.max(0, Math.min(1, (info.point.y - rect.top) / rect.height));
            window.scrollTo({
              top: (totalHeight - viewportHeight) * percentage,
              behavior: 'auto'
            });
          }}
        />
      </motion.div>
      
      {/* Controlli di navigazione principali - con animazione */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-50"
      >
        <motion.div className="relative" onMouseEnter={() => setHoveredButton('top')} onMouseLeave={() => setHoveredButton(null)}>
          <motion.div 
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="secondary"
              size="icon"
              onClick={scrollToTop}
              className="rounded-full bg-primary text-primary-foreground shadow-lg"
            >
              <Home className="h-5 w-5" />
            </Button>
          </motion.div>
          {hoveredButton === 'top' && <ButtonTooltip text="Torna all'inizio" />}
        </motion.div>
        
        <motion.div className="relative" onMouseEnter={() => setHoveredButton('pageUp')} onMouseLeave={() => setHoveredButton(null)}>
          <motion.div 
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="secondary"
              size="icon"
              onClick={scrollUpSection}
              className="rounded-full bg-primary text-primary-foreground shadow-lg"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </motion.div>
          {hoveredButton === 'pageUp' && <ButtonTooltip text="Pagina su" />}
        </motion.div>
        
        <motion.div className="relative" onMouseEnter={() => setHoveredButton('up')} onMouseLeave={() => setHoveredButton(null)}>
          <motion.div 
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={scrollUpSmall}
              className="rounded-full bg-background/80 backdrop-blur-sm shadow"
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
          </motion.div>
          {hoveredButton === 'up' && <ButtonTooltip text="Scorri su" />}
        </motion.div>
        
        <motion.div className="relative" onMouseEnter={() => setHoveredButton('down')} onMouseLeave={() => setHoveredButton(null)}>
          <motion.div 
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={scrollDownSmall}
              className="rounded-full bg-background/80 backdrop-blur-sm shadow"
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </motion.div>
          {hoveredButton === 'down' && <ButtonTooltip text="Scorri giù" />}
        </motion.div>
        
        <motion.div className="relative" onMouseEnter={() => setHoveredButton('pageDown')} onMouseLeave={() => setHoveredButton(null)}>
          <motion.div 
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="secondary"
              size="icon"
              onClick={scrollDownSection}
              className="rounded-full bg-primary text-primary-foreground shadow-lg"
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </motion.div>
          {hoveredButton === 'pageDown' && <ButtonTooltip text="Pagina giù" />}
        </motion.div>
      </motion.div>
      
      {/* Indicatore di posizione - con animazione */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed right-4 bottom-4 bg-background/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium shadow-lg z-50"
      >
        {Math.round(scrollPercentage)}%
      </motion.div>
    </>
  );
};

export default PageScroller;