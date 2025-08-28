import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { siteManager, type ToolInfo } from '@/lib/toolsSiteManager';
import { useDB } from '@/store/db';
import { 
  Wrench, 
  Battery, 
  Bluetooth, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';

interface ToolStatus extends ToolInfo {
  battery: number;
  connected: boolean;
  inUse: boolean;
  lastUsed?: string;
  certificationStatus: 'Valid' | 'Expiring' | 'Expired';
  maintenanceDue?: string;
}

interface ToolStatusPanelProps {
  assignmentId?: string;
  currentStation?: 'RodCut' | 'UnistrutCut' | 'Assembly' | 'ShopQA';
  onToolSelected?: (toolId: string) => void;
}

export function ToolStatusPanel({ 
  assignmentId, 
  currentStation, 
  onToolSelected 
}: ToolStatusPanelProps) {
  const { currentUser, pushToolEvent } = useDB();
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [toolStatuses, setToolStatuses] = useState<ToolStatus[]>([]);
  
  // Simulate real-time tool status updates
  useEffect(() => {
    // Get all available tools
    const allTools = [
      ...siteManager.getToolsForStation('RodCut'),
      ...siteManager.getToolsForStation('UnistrutCut'),
      ...siteManager.getToolsForStation('Assembly'),
      ...siteManager.getToolsForStation('ShopQA')
    ];
    
    // Add mock real-time status data
    const enhancedTools: ToolStatus[] = allTools.map(tool => ({
      ...tool,
      battery: Math.floor(Math.random() * 100),
      connected: Math.random() > 0.2, // 80% connected
      inUse: Math.random() > 0.7, // 30% in use
      lastUsed: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      certificationStatus: ['Valid', 'Valid', 'Valid', 'Expiring', 'Expired'][
        Math.floor(Math.random() * 5)
      ] as 'Valid' | 'Expiring' | 'Expired',
      maintenanceDue: Math.random() > 0.8 ? 
        new Date(Date.now() + Math.random() * 30 * 24 * 3600000).toISOString() : 
        undefined
    }));
    
    setToolStatuses(enhancedTools);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setToolStatuses(prev => prev.map(tool => ({
        ...tool,
        battery: Math.max(0, tool.battery - (Math.random() * 2)),
        connected: Math.random() > 0.1, // Occasional disconnects
        inUse: tool.inUse ? (Math.random() > 0.3) : (Math.random() > 0.9)
      })));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Filter tools by current station if specified
  const relevantTools = currentStation 
    ? toolStatuses.filter(tool => tool.station === currentStation)
    : toolStatuses;
  
  const handleToolAction = (toolId: string, action: 'start' | 'stop' | 'pair') => {
    if (action === 'pair') {
      // Simulate pairing
      setToolStatuses(prev => prev.map(tool => 
        tool.id === toolId 
          ? { ...tool, connected: true }
          : tool
      ));
      return;
    }
    
    if (assignmentId && currentStation) {
      pushToolEvent({
        assignmentId,
        station: currentStation,
        toolId,
        event: action
      });
      
      // Update tool status
      setToolStatuses(prev => prev.map(tool => 
        tool.id === toolId 
          ? { 
              ...tool, 
              inUse: action === 'start',
              lastUsed: new Date().toISOString()
            }
          : tool
      ));
    }
    
    onToolSelected?.(toolId);
  };
  
  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-green-500';
    if (level > 30) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getCertificationBadge = (status: string) => {
    const variants = {
      'Valid': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Expiring': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'Expired': 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return variants[status as keyof typeof variants] || 'bg-muted';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            DEWALT Site Manager
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-green-500" />
            <span className="text-xs text-muted-foreground">Connected</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Tool Status Overview */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 bg-green-500/10 rounded">
            <div className="font-medium text-green-400">
              {toolStatuses.filter(t => t.connected && !t.inUse).length}
            </div>
            <div className="text-muted-foreground">Available</div>
          </div>
          <div className="p-2 bg-blue-500/10 rounded">
            <div className="font-medium text-blue-400">
              {toolStatuses.filter(t => t.inUse).length}
            </div>
            <div className="text-muted-foreground">In Use</div>
          </div>
          <div className="p-2 bg-red-500/10 rounded">
            <div className="font-medium text-red-400">
              {toolStatuses.filter(t => !t.connected).length}
            </div>
            <div className="text-muted-foreground">Offline</div>
          </div>
        </div>
        
        {/* Tool List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {relevantTools.map(tool => (
            <div 
              key={tool.id}
              className={`p-3 rounded-lg border transition-colors ${
                selectedTool === tool.id 
                  ? 'bg-primary/10 border-primary/30' 
                  : 'bg-card border-border hover:bg-muted/50'
              }`}
            >
              {/* Tool Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Wrench className="h-4 w-4" />
                    <span className="font-medium text-sm">{tool.id}</span>
                  </div>
                  {tool.connected ? (
                    <Bluetooth className="h-3 w-3 text-blue-500" />
                  ) : (
                    <WifiOff className="h-3 w-3 text-red-500" />
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Battery Status */}
                  <div className="flex items-center gap-1">
                    <Battery className={`h-4 w-4 ${getBatteryColor(tool.battery)}`} />
                    <span className="text-xs text-muted-foreground">{Math.round(tool.battery)}%</span>
                  </div>
                  
                  {/* Status Badge */}
                  {tool.inUse ? (
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                      In Use
                    </Badge>
                  ) : tool.connected ? (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      Ready
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                      Offline
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Tool Info */}
              <div className="text-sm text-muted-foreground mb-2">
                {tool.name}
              </div>
              
              {/* Tool Details */}
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                <div>Station: {tool.station}</div>
                <div>
                  Last Used: {tool.lastUsed 
                    ? new Date(tool.lastUsed).toLocaleTimeString() 
                    : 'Never'
                  }
                </div>
                {tool.calibrationDue && (
                  <>
                    <div>Cal Due: {new Date(tool.calibrationDue).toLocaleDateString()}</div>
                    <div>
                      <Badge className={getCertificationBadge(tool.certificationStatus)}>
                        {tool.certificationStatus}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
              
              {/* Alerts */}
              {(tool.battery < 20 || tool.certificationStatus === 'Expiring' || tool.maintenanceDue) && (
                <div className="mb-2 space-y-1">
                  {tool.battery < 20 && (
                    <div className="flex items-center gap-1 text-xs text-red-400">
                      <AlertTriangle className="h-3 w-3" />
                      Low battery
                    </div>
                  )}
                  {tool.certificationStatus === 'Expiring' && (
                    <div className="flex items-center gap-1 text-xs text-yellow-400">
                      <Clock className="h-3 w-3" />
                      Calibration due soon
                    </div>
                  )}
                  {tool.maintenanceDue && (
                    <div className="flex items-center gap-1 text-xs text-orange-400">
                      <Wrench className="h-3 w-3" />
                      Maintenance scheduled
                    </div>
                  )}
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-2">
                {!tool.connected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToolAction(tool.id, 'pair')}
                    className="h-7 px-2 text-xs"
                  >
                    <Bluetooth className="h-3 w-3 mr-1" />
                    Pair
                  </Button>
                ) : (
                  <>
                    <Button
                      variant={tool.inUse ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToolAction(
                        tool.id, 
                        tool.inUse ? 'stop' : 'start'
                      )}
                      className="h-7 px-2 text-xs"
                      disabled={!assignmentId || !currentStation}
                    >
                      {tool.inUse ? 'Stop' : 'Start'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTool(tool.id)}
                      className="h-7 px-2 text-xs"
                    >
                      Select
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {relevantTools.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No tools available for this station
          </div>
        )}
        
        {/* Connection Status */}
        <div className="pt-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Site Manager Status:</span>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Connected</span>
            </div>
          </div>
          <div className="mt-1">
            Worker: {currentUser?.name} • Shift: {currentUser?.shift || 'Day'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}