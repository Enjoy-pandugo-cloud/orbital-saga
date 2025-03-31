
import { useState } from 'react';
import { CelestialBodyData } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Sun, 
  CircleDashed, 
  Timer, 
  Tag, 
  ChevronDown,
  ChevronUp,
  Info,
  ZoomIn,
  Eye
} from 'lucide-react';

interface ControlsProps {
  bodies: CelestialBodyData[];
  selectedBody: CelestialBodyData;
  onBodySelect: (id: string) => void;
  showOrbits: boolean;
  setShowOrbits: (show: boolean) => void;
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
  timeSpeed: number;
  setTimeSpeed: (speed: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
  bodies,
  selectedBody,
  onBodySelect,
  showOrbits,
  setShowOrbits,
  showLabels,
  setShowLabels,
  timeSpeed,
  setTimeSpeed
}) => {
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded
  const [showHelp, setShowHelp] = useState(false);
  
  const speedOptions = [
    { label: '0.1x', value: 0.1 },
    { label: '0.5x', value: 0.5 },
    { label: '1x', value: 1 },
    { label: '10x', value: 10 },
    { label: '100x', value: 100 },
    { label: '1000x', value: 1000 }
  ];
  
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 solar-system-ui">
      <div className="flex flex-col items-center">
        {/* Quick view button */}
        <div className="bg-card/90 backdrop-blur-sm rounded-lg border border-border shadow-lg p-3 mb-3 w-fit">
          <div className="flex space-x-2 mb-3">
            <Button variant="default" size="sm" onClick={() => onBodySelect('sun')} className="bg-yellow-500 hover:bg-yellow-600">
              <Sun className="w-4 h-4 mr-1" /> View Sun
            </Button>
            {bodies.slice(1, 5).map(body => (
              <Button
                key={body.id}
                variant="secondary"
                size="sm"
                onClick={() => onBodySelect(body.id)}
                className="text-xs"
              >
                <Globe className="w-3 h-3 mr-1" />
                {body.name}
              </Button>
            ))}
          </div>
          
          <div className="flex justify-between">
            <div className="text-xs">
              <span className="text-muted-foreground mr-2">Try these planet views!</span>
              <span className="text-primary font-medium">Currently viewing: {selectedBody.name}</span>
            </div>
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-primary/20 text-xs"
                onClick={() => setTimeSpeed(0.1)}
              >
                <Eye className="w-3 h-3 mr-1" />
                Slow Motion
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main controls panel */}
        <div className="bg-card/90 backdrop-blur-sm rounded-lg border border-border shadow-lg p-3 w-fit">
          {isExpanded && (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Celestial bodies */}
              <div className="bg-secondary/30 p-3 rounded-md">
                <h3 className="text-sm font-medium mb-2 text-primary flex items-center">
                  <Globe className="w-4 h-4 mr-1" /> Celestial Bodies
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {bodies.map(body => (
                    <Button
                      key={body.id}
                      variant={selectedBody.id === body.id ? "default" : "outline"}
                      size="sm"
                      className={`text-xs ${selectedBody.id === body.id ? "bg-primary" : "bg-secondary/50"}`}
                      onClick={() => onBodySelect(body.id)}
                    >
                      {body.id === 'sun' ? <Sun className="w-3 h-3 mr-1" /> : <Globe className="w-3 h-3 mr-1" />}
                      {body.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Speed controls */}
              <div className="bg-secondary/30 p-3 rounded-md">
                <h3 className="text-sm font-medium mb-2 text-primary flex items-center">
                  <Timer className="w-4 h-4 mr-1" /> Simulation Speed
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {speedOptions.map(option => (
                    <Button
                      key={option.value}
                      variant={timeSpeed === option.value ? "default" : "outline"}
                      size="sm"
                      className={`text-xs ${timeSpeed === option.value ? "bg-primary" : "bg-secondary/50"}`}
                      onClick={() => setTimeSpeed(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Toggles and options */}
              <div className="bg-secondary/30 p-3 rounded-md">
                <h3 className="text-sm font-medium mb-2 text-primary flex items-center">
                  <Info className="w-4 h-4 mr-1" /> Display Options
                </h3>
                <div className="space-y-2">
                  <Button 
                    variant={showOrbits ? "default" : "outline"}
                    size="sm"
                    className={`text-xs w-full justify-start ${showOrbits ? "bg-primary" : "bg-secondary/50"}`}
                    onClick={() => setShowOrbits(!showOrbits)}
                  >
                    <CircleDashed className="w-3 h-3 mr-1" />
                    Show Orbit Paths
                  </Button>
                  
                  <Button 
                    variant={showLabels ? "default" : "outline"}
                    size="sm"
                    className={`text-xs w-full justify-start ${showLabels ? "bg-primary" : "bg-secondary/50"}`}
                    onClick={() => setShowLabels(!showLabels)}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    Show Labels
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs w-full justify-start bg-secondary/50"
                    onClick={() => setShowHelp(!showHelp)}
                  >
                    <Info className="w-3 h-3 mr-1" />
                    Help / Controls
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Help panel */}
          {showHelp && (
            <div className="mb-4 bg-secondary/30 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-2 text-primary">Controls</h3>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• <strong>Left Mouse</strong>: Rotate camera</li>
                <li>• <strong>Right Mouse</strong>: Pan camera</li>
                <li>• <strong>Mouse Wheel</strong>: Zoom in/out</li>
                <li>• <strong>Select planet</strong>: Focus camera on planet</li>
                <li>• <strong>Speed controls</strong>: Change simulation speed</li>
                <li>• <strong>Quick Tips</strong>: Use slow motion (0.1x) to observe planets better</li>
              </ul>
            </div>
          )}
          
          {/* Bottom toolbar */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="bg-secondary/50" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Hide Controls
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Show Controls
                  </>
                )}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Currently viewing: <span className="text-primary font-medium">{selectedBody.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
