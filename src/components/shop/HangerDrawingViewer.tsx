import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDB } from '@/store/db';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize, 
  Download, 
  Ruler,
  Info 
} from 'lucide-react';

interface HangerDrawingViewerProps {
  hangerId: string;
}

export function HangerDrawingViewer({ hangerId }: HangerDrawingViewerProps) {
  const { hangers } = useDB();
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showDimensions, setShowDimensions] = useState(true);
  const [viewMode, setViewMode] = useState<'2D' | '3D' | 'ISO'>('2D');
  
  const hanger = hangers.find(h => h.id === hangerId);
  
  if (!hanger) return null;
  
  // Mock drawing data - in real implementation, this would come from BIM/CAD system
  const drawingSpecs = {
    drawingNumber: `DWG-${hanger.id}`,
    revision: hanger.rev || 1,
    scale: '1:1',
    dimensions: {
      totalHeight: 8,
      hangerWidth: 4,
      rodDiameter: 0.375,
      attachmentHeight: 6 // inches
    }
  };
  
  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev + 25 : prev - 25;
      return Math.max(25, Math.min(400, newZoom));
    });
  };
  
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Technical Drawing
          </div>
          <Badge variant="outline" className="text-xs">
            {drawingSpecs.drawingNumber} Rev {drawingSpecs.revision}
          </Badge>
        </CardTitle>
        
        {/* Drawing Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-muted rounded-md p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom('out')}
              disabled={zoom <= 25}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs px-2 min-w-[3rem] text-center">{zoom}%</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom('in')}
              disabled={zoom >= 400}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRotate}
            className="h-8 w-8 p-0"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDimensions(!showDimensions)}
            className={`h-8 px-3 text-xs ${showDimensions ? 'bg-primary text-primary-foreground' : ''}`}
          >
            <Ruler className="h-4 w-4 mr-1" />
            Dims
          </Button>
          
          <div className="flex bg-muted rounded-md p-1">
            {(['2D', '3D', 'ISO'] as const).map(mode => (
              <Button
                key={mode}
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(mode)}
                className={`h-8 px-3 text-xs ${viewMode === mode ? 'bg-primary text-primary-foreground' : ''}`}
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Drawing Viewport */}
        <div 
          className="relative bg-white border-t overflow-hidden"
          style={{ height: 'calc(100vh - 400px)', minHeight: '400px' }}
        >
          {/* Mock Technical Drawing - Replace with actual CAD viewer */}
          <div 
            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
            style={{ 
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease'
            }}
          >
            <svg 
              width="300" 
              height="400" 
              viewBox="0 0 300 400" 
              className="drop-shadow-sm"
            >
              {/* Hanger Assembly Drawing */}
              
              {/* Upper Attachment */}
              <rect x="120" y="20" width="60" height="20" fill="#4a5568" stroke="#2d3748" strokeWidth="2"/>
              <text x="150" y="15" textAnchor="middle" fontSize="10" fill="#2d3748">
                {hanger.upperAttachment?.type}
              </text>
              
              {/* Vertical Rod */}
              <line x1="150" y1="40" x2="150" y2="320" stroke="#2d3748" strokeWidth="6" strokeLinecap="round"/>
              
              {/* Rod Extension - static for demo */}
              <g>
                <line x1="150" y1="320" x2="150" y2="340" stroke="#e53e3e" strokeWidth="4" strokeLinecap="round"/>
                <text x="160" y="330" fontSize="8" fill="#e53e3e">
                  EXT: 2"
                </text>
              </g>
              
              {/* Hanger Body */}
              <rect x="100" y="300" width="100" height="40" rx="5" fill="#4a5568" stroke="#2d3748" strokeWidth="2"/>
              <circle cx="125" cy="320" r="3" fill="#2d3748"/>
              <circle cx="175" cy="320" r="3" fill="#2d3748"/>
              
              {/* Lower Nuts */}
              <rect x="142" y="340" width="16" height="8" fill="#4a5568" stroke="#2d3748" strokeWidth="1"/>
              <rect x="142" y="350" width="16" height="8" fill="#4a5568" stroke="#2d3748" strokeWidth="1"/>
              
              {/* Dimensions (if enabled) */}
              {showDimensions && (
                <g stroke="#e53e3e" strokeWidth="1" fill="#e53e3e" fontSize="8">
                  {/* Total height dimension */}
                  <line x1="50" y1="40" x2="50" y2="360"/>
                  <line x1="45" y1="40" x2="55" y2="40"/>
                  <line x1="45" y1="360" x2="55" y2="360"/>
                  <text x="30" y="200" textAnchor="middle" transform="rotate(-90, 30, 200)">
                    {drawingSpecs.dimensions.totalHeight}'
                  </text>
                  
                  {/* Hanger width dimension */}
                  <line x1="100" y1="380" x2="200" y2="380"/>
                  <line x1="100" y1="375" x2="100" y2="385"/>
                  <line x1="200" y1="375" x2="200" y2="385"/>
                  <text x="150" y="395" textAnchor="middle">
                    {drawingSpecs.dimensions.hangerWidth}"
                  </text>
                  
                  {/* Rod diameter callout */}
                  <circle cx="150" cy="200" r="8" fill="none" stroke="#e53e3e"/>
                  <line x1="158" y1="192" x2="180" y2="170"/>
                  <text x="185" y="170" fontSize="8">
                    ⌀{drawingSpecs.dimensions.rodDiameter}"
                  </text>
                </g>
              )}
              
              {/* Grid background */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)"/>
            </svg>
          </div>
          
          {/* Drawing Info Overlay */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
            <div className="text-xs space-y-1">
              <div><strong>Scale:</strong> {drawingSpecs.scale}</div>
              <div><strong>Type:</strong> {hanger.type}</div>
              <div><strong>System:</strong> {hanger.system}</div>
              <div><strong>Level:</strong> {hanger.level}</div>
              <div><strong>Grid:</strong> {hanger.grid}</div>
            </div>
          </div>
          
          {/* Zoom indicator */}
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {zoom}% • {rotation}°
          </div>
        </div>
        
        {/* Drawing Actions */}
        <div className="p-3 border-t bg-muted/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Drawing generated from BIM model {hanger.bim?.elementId}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
              <Download className="h-4 w-4 mr-1" />
              Export PDF
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
              <Maximize className="h-4 w-4 mr-1" />
              Full Screen
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}