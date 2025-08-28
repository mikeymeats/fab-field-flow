import { useState } from 'react';
import { useDB } from '@/store/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';

interface BOMItem {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  unit: string;
  location?: string;
  onHand: number;
  verified?: boolean;
  notes?: string;
}

interface BOMPanelProps {
  hangerId: string;
  onItemVerified: (itemId: string, verified: boolean) => void;
}

export function BOMPanel({ hangerId, onItemVerified }: BOMPanelProps) {
  const { hangers, inventory } = useDB();
  const [verifiedItems, setVerifiedItems] = useState<Set<string>>(new Set());
  
  const hanger = hangers.find(h => h.id === hangerId);
  
  // Generate BOM based on hanger specifications
  const generateBOM = (): BOMItem[] => {
    if (!hanger) return [];
    
    const bom: BOMItem[] = [];
    
    // Rod materials
    const rodSize = '3/8'; // Default rod size
    const rodLength = 8; // Default rod length
    if (rodSize) {
      if (rodLength > 0) {
        bom.push({
          id: `rod-${rodSize}`,
          sku: `ROD-${rodSize}`,
          description: `${rodSize}" Threaded Rod`,
          quantity: Math.ceil(rodLength),
          unit: 'ft',
          location: 'Rack A-12',
          onHand: 250
        });
      }
    }
    
    // Upper attachment
    if (hanger.upperAttachment?.model) {
      bom.push({
        id: `upper-${hanger.upperAttachment.model}`,
        sku: `UA-${hanger.upperAttachment.model}`,
        description: `${hanger.upperAttachment.type} - ${hanger.upperAttachment.model}`,
        quantity: 1,
        unit: 'ea',
        location: 'Bin B-5',
        onHand: 45
      });
    }
    
    // Hanger assembly parts
    const hangerSize = '4';
    bom.push({
      id: `hanger-${hangerSize}`,
      sku: `HNG-${hangerSize}`,
      description: `${hangerSize}" Hanger Assembly`,
      quantity: 1,
      unit: 'ea',
      location: 'Shelf C-3',
      onHand: 28
    });
    
    // Nuts and washers
    bom.push({
      id: `nuts-${rodSize}`,
      sku: `NUT-${rodSize}`,
      description: `${rodSize}" Hex Nuts`,
      quantity: 4,
      unit: 'ea',
      location: 'Bin D-8',
      onHand: 500
    });
    
    bom.push({
      id: `washers-${rodSize}`,
      sku: `WASH-${rodSize}`,
      description: `${rodSize}" Flat Washers`,
      quantity: 4,
      unit: 'ea',
      location: 'Bin D-9',
      onHand: 350
    });
    
    // Additional hardware based on system type
    if (hanger.system?.includes('Fire')) {
      bom.push({
        id: 'fire-sealant',
        sku: 'SEAL-FIRE',
        description: 'Fire-rated Sealant',
        quantity: 1,
        unit: 'ea',
        location: 'Cabinet E-1',
        onHand: 12
      });
    }
    
    return bom;
  };
  
  const bomItems = generateBOM();
  
  const handleItemVerification = (itemId: string, checked: boolean) => {
    const newVerified = new Set(verifiedItems);
    if (checked) {
      newVerified.add(itemId);
    } else {
      newVerified.delete(itemId);
    }
    setVerifiedItems(newVerified);
    onItemVerified(itemId, checked);
  };
  
  const totalItems = bomItems.length;
  const verifiedCount = verifiedItems.size;
  const shortageItems = bomItems.filter(item => item.quantity > item.onHand);
  
  const getAvailabilityBadge = (item: BOMItem) => {
    if (item.quantity > item.onHand) {
      return <Badge variant="destructive" className="text-xs">Short</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">Available</Badge>;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Bill of Materials
          </div>
          <div className="text-sm text-muted-foreground">
            {verifiedCount}/{totalItems} verified
          </div>
        </CardTitle>
        {shortageItems.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            {shortageItems.length} items short
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Progress indicator */}
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(verifiedCount / totalItems) * 100}%` }}
          />
        </div>
        
        {/* BOM Items */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {bomItems.map((item) => (
            <div 
              key={item.id} 
              className={`p-3 rounded-lg border transition-colors ${
                verifiedItems.has(item.id) 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-card border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={verifiedItems.has(item.id)}
                  onCheckedChange={(checked) => 
                    handleItemVerification(item.id, checked as boolean)
                  }
                  className="mt-0.5"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{item.sku}</span>
                    {getAvailabilityBadge(item)}
                    {verifiedItems.has(item.id) && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  
                  <div className="text-sm text-foreground mb-1">
                    {item.description}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Need: {item.quantity} {item.unit} • 
                      On Hand: {item.onHand} {item.unit}
                    </span>
                    {item.location && (
                      <span className="text-accent">📍 {item.location}</span>
                    )}
                  </div>
                  
                  {item.quantity > item.onHand && (
                    <div className="text-xs text-destructive mt-1">
                      Short: {item.quantity - item.onHand} {item.unit}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {bomItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No BOM items generated for this hanger
          </div>
        )}
      </CardContent>
    </Card>
  );
}