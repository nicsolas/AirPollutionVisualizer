import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-is-mobile';

const PageScroller = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
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
      className={`fixed bottom-4 right-4 z-50 rounded-full transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={scrollToTop}
    >
      <ChevronUp className="h-4 w-4" />
    </Button>
  );
};

export default PageScroller;