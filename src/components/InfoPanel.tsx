
import { CelestialBodyData } from '@/lib/constants';

interface InfoPanelProps {
  body: CelestialBodyData;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const InfoPanel: React.FC<InfoPanelProps> = ({ body, position }) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };
  
  const formatWithCommas = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  return (
    <div className={`absolute ${positionClasses[position]} z-10 w-80 bg-card/90 backdrop-blur-sm p-4 rounded-lg border border-border shadow-lg solar-system-ui`}>
      <h2 className="text-xl font-bold mb-2 text-primary">{body.name}</h2>
      
      <div className="mb-3 text-sm">
        {body.description}
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-muted-foreground">Radius:</span>
          <span>{formatWithCommas(body.radius)} km</span>
        </div>
        
        {body.id !== 'sun' && (
          <>
            <div className="grid grid-cols-2 gap-x-2">
              <span className="text-muted-foreground">Distance from Sun:</span>
              <span>{body.distanceFromSun} AU</span>
            </div>
            
            <div className="grid grid-cols-2 gap-x-2">
              <span className="text-muted-foreground">Orbital Period:</span>
              <span>{body.orbitalPeriod} days</span>
            </div>
          </>
        )}
        
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-muted-foreground">Rotation Period:</span>
          <span>{Math.abs(body.rotationPeriod)} days {body.rotationPeriod < 0 ? '(retrograde)' : ''}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-muted-foreground">Axial Tilt:</span>
          <span>{body.axialTilt}°</span>
        </div>
        
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-muted-foreground">Size vs Earth:</span>
          <span>{body.relativeSize}x</span>
        </div>
        
        {body.moons && (
          <div className="grid grid-cols-2 gap-x-2">
            <span className="text-muted-foreground">Moons:</span>
            <span>{body.moons.length}</span>
          </div>
        )}
        
        {body.hasRings && (
          <div className="grid grid-cols-2 gap-x-2">
            <span className="text-muted-foreground">Rings:</span>
            <span>Yes</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;
