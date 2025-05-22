import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { usePollution } from "@/lib/stores/usePollution";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow, subHours, format } from "date-fns";

const TimeSlider = () => {
  const { timeOffset, setTimeOffset, cityData } = usePollution();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Maximum hours we can go back in time (based on available data)
  const maxHoursBack = 24;
  
  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  // Auto-play time slider
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setTimeOffset((current) => {
        // If we reach current time, stop playback
        if (current >= 0) {
          setIsPlaying(false);
          return 0;
        }
        return current + 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, setTimeOffset]);
  
  // Format the time label
  const getTimeLabel = () => {
    if (timeOffset === 0) {
      return "Current";
    }
    
    const pastTime = subHours(currentTime, Math.abs(timeOffset));
    return format(pastTime, "h:mm a");
  };
  
  // Calculate the time as a human-readable string
  const getTimeDescription = () => {
    if (timeOffset === 0) {
      return "Current time";
    }
    
    const pastTime = subHours(currentTime, Math.abs(timeOffset));
    return `${formatDistanceToNow(pastTime)} ago`;
  };
  
  // Handle time slider change
  const handleTimeChange = (value: number[]) => {
    setTimeOffset(value[0]);
    // Stop playback if user manually changes time
    setIsPlaying(false);
  };
  
  // Toggle time playback
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Reset to current time
  const resetToCurrentTime = () => {
    setTimeOffset(0);
    setIsPlaying(false);
  };
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{getTimeLabel()}</span>
            </div>
            <span className="text-sm text-muted-foreground">{getTimeDescription()}</span>
          </div>
          
          <div className="px-1">
            <Slider
              min={-maxHoursBack}
              max={0}
              step={1}
              value={[timeOffset]}
              onValueChange={handleTimeChange}
              disabled={!cityData}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToCurrentTime}
              disabled={timeOffset === 0 || !cityData}
            >
              <SkipBack className="h-3 w-3 mr-1" />
              Current
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayback}
              disabled={timeOffset === 0 || !cityData}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3 w-3 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Play
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSlider;
