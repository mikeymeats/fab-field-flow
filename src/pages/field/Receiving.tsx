import { useState } from 'react';
import { useDB } from '@/store/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { QrCode, Package, AlertTriangle, CheckCircle } from 'lucide-react';

export default function FieldReceiving() {
  const { shipments, packages, scopedPackages } = useDB();
  const [scanInput, setScanInput] = useState('');
  const [recentScans, setRecentScans] = useState<string[]>([]);

  const inTransitShipments = shipments.filter(s => s.state === 'InTransit');
  const scoped = scopedPackages();

  const handleScan = () => {
    if (scanInput.trim()) {
      setRecentScans(prev => [scanInput.trim(), ...prev.slice(0, 9)]);
      setScanInput('');
      // Here we would update shipment/package state to "DeliveredToSite"
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Field Receiving</h1>
          <p className="text-muted-foreground">Scan deliveries, reconcile shipments, manage exceptions</p>
        </div>
      </div>

      {/* Quick Scan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Quick Scan
          </CardTitle>
          <CardDescription>Scan QR codes or enter package/shipment IDs manually</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Scan QR or enter PKG-xxx, SHP-xxx..."
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            />
            <Button onClick={handleScan}>Scan</Button>
          </div>
          
          {recentScans.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Recent Scans:</p>
              <div className="space-y-1">
                {recentScans.map((scan, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-mono">{scan}</span>
                    <span className="text-muted-foreground">• {new Date().toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* In Transit Shipments */}
      <Card>
        <CardHeader>
          <CardTitle>Expected Deliveries</CardTitle>
          <CardDescription>Shipments currently in transit to this site</CardDescription>
        </CardHeader>
        <CardContent>
          {inTransitShipments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No shipments currently in transit</p>
          ) : (
            <div className="space-y-4">
              {inTransitShipments.map((shipment) => (
                <div key={shipment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span className="font-medium">{shipment.id}</span>
                    </div>
                    <Badge>In Transit</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {shipment.packages.length} packages • {shipment.stops.length} stops
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Packages:</p>
                      <div className="space-y-1">
                        {shipment.packages.slice(0, 3).map(pkgId => {
                          const pkg = packages.find(p => p.id === pkgId);
                          return (
                            <div key={pkgId} className="text-muted-foreground">
                              {pkg?.name || pkgId}
                            </div>
                          );
                        })}
                        {shipment.packages.length > 3 && (
                          <div className="text-muted-foreground">
                            +{shipment.packages.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Route:</p>
                      <div className="space-y-1">
                        {shipment.stops.map((stop, idx) => (
                          <div key={idx} className="text-muted-foreground">
                            {idx + 1}. {stop.location} ({stop.type})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Package Status */}
      <Card>
        <CardHeader>
          <CardTitle>Package Status</CardTitle>
          <CardDescription>Current status of packages for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scoped.slice(0, 10).map((pkg) => (
              <div key={pkg.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{pkg.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {pkg.level} / {pkg.zone} • {pkg.hangerIds.length} hangers
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    pkg.state === 'Delivered' ? 'default' :
                    pkg.state === 'InTransit' ? 'secondary' :
                    'outline'
                  }>
                    {pkg.state}
                  </Badge>
                  {pkg.state === 'InTransit' && (
                    <Button size="sm" variant="outline">
                      Mark Received
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}