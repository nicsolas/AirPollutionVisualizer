import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Wind, Info, Home, VolumeX, Volume2 } from "lucide-react";
import { useAudio } from "@/lib/stores/useAudio";

const NavBar = () => {
  const location = useLocation();
  const { isMuted, toggleMute } = useAudio();
  
  return (
    <header className="sticky top-0 z-40 w-full bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="mr-4 flex items-center gap-2">
          <Wind className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">Visualizzatore Inquinamento Atmosferico</span>
        </div>
        
        <nav className="flex flex-1 items-center justify-between">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "text-muted-foreground", 
                location.pathname === "/" && "text-foreground font-medium"
              )}
            >
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "text-muted-foreground", 
                location.pathname === "/pollutants" && "text-foreground font-medium"
              )}
            >
              <Link to="/pollutants">
                <Wind className="mr-2 h-4 w-4" />
                <span>Inquinanti</span>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "text-muted-foreground", 
                location.pathname === "/about" && "text-foreground font-medium"
              )}
            >
              <Link to="/about">
                <Info className="mr-2 h-4 w-4" />
                <span>Info</span>
              </Link>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            aria-label={isMuted ? "Attiva audio" : "Disattiva audio"}
            className="text-muted-foreground hover:text-foreground"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
