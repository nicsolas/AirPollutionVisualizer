
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-is-mobile';

const PageScroller = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (position / maxScroll) * 100;
      
      setScrollPosition(position);
      setIsVisible(position > 100);

      // Smooth scroll animation
      const button = document.querySelector('.scroll-button');
      if (button) {
        button.style.transform = `translateY(${scrollPercentage}%)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isMobile) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      className={`fixed right-6 z-50 rounded-full transition-all duration-200 shadow-lg scroll-button ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        bottom: '1.5rem',
        transition: 'transform 0.2s ease-out, opacity 0.2s ease-out'
      }}
      onClick={scrollToTop}
    >
      <ChevronUp className="h-4 w-4" />
    </Button>
  );
};

export default PageScroller;
