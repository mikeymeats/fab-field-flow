import { useState } from "react";
import { useDB } from "@/store/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Truck, FileText, Plus, MapPin, Calendar, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Shipping() {
  const { packages, shipments, createShipment, advancePackage } = useDB();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [shipmentStops, setShipmentStops] = useState<Array<{
    location: string;
    type: 'Shop' | 'Galvanizer' | 'Painter' | 'Site';
    date: string;
  }>>([
    { location: "Shop", type: "Shop" as const, date: new Date().toISOString().split('T')[0] }
  ]);

  // Get packages ready for shipping (ShopQAPassed or Staged)
  const shippablePackages = packages.filter(pkg => 
    pkg.state === "ShopQAPassed" || pkg.state === "Staged"
  );

  const filteredPackages = shippablePackages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePackageSelection = (packageId: string, selected: boolean) => {
    if (selected) {
      setSelectedPackages(prev => [...prev, packageId]);
    } else {
      setSelectedPackages(prev => prev.filter(id => id !== packageId));
    }
  };

  const addStop = () => {
    setShipmentStops(prev => [...prev, {
      location: "",
      type: "Site" as const,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }]);
  };

  const updateStop = (index: number, field: string, value: string) => {
    setShipmentStops(prev => prev.map((stop, i) => 
      i === index ? { ...stop, [field]: value } : stop
    ));
  };

  const removeStop = (index: number) => {
    if (shipmentStops.length > 1) {
      setShipmentStops(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleCreateShipment = () => {
    if (selectedPackages.length > 0 && shipmentStops.length > 0) {
      const shipmentId = createShipment(selectedPackages, shipmentStops);
      
      // Mark selected packages as Loaded
      selectedPackages.forEach(packageId => {
        advancePackage(packageId, "Loaded");
      });

      setIsCreateOpen(false);
      setSelectedPackages([]);
      setShipmentStops([
        { location: "Shop", type: "Shop" as const, date: new Date().toISOString().split('T')[0] }
      ]);
    }
  };

  const generateBOL = (shipment: any) => {
    // This would integrate with the PDF service
    const content = `
BILL OF LADING
Shipment ID: ${shipment.id}
Date: ${new Date().toLocaleDateString()}

Ship To: ${shipment.bol?.shipTo || 'Site'}

Items:
${shipment.bol?.items?.map((item: any) => 
  `${item.ref} - ${item.desc} (Qty: ${item.qty})`
).join('\n') || 'No items'}

Stops:
${shipment.stops.map((stop: any) => 
  `${stop.location} (${stop.type}) - ${stop.date || 'TBD'}`
).join('\n')}
    `;
    
    // Create and download blob
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BOL_${shipment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shipping</h1>
          <p className="text-muted-foreground">Create and manage shipments</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Shipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Shipment</DialogTitle>
              <DialogDescription>
                Select packages and configure shipment routing
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Package Selection */}
              <div>
                <h4 className="font-semibold mb-3">Select Packages ({selectedPackages.length} selected)</h4>
                <div className="max-h-60 overflow-y-auto border rounded-lg p-3 space-y-2">
                  {shippablePackages.map((pkg) => (
                    <div key={pkg.id} className="flex items-center space-x-3 p-2 hover:bg-muted rounded">
                      <Checkbox
                        checked={selectedPackages.includes(pkg.id)}
                        onCheckedChange={(checked) => handlePackageSelection(pkg.id, !!checked)}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{pkg.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {pkg.hangerIds.length} hangers • {pkg.state}
                        </p>
                      </div>
                      <Badge variant="outline">{pkg.state}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Stops */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Shipping Route</h4>
                  <Button variant="outline" size="sm" onClick={addStop}>
                    <Plus className="mr-1 h-3 w-3" />
                    Add Stop
                  </Button>
                </div>
                <div className="space-y-3">
                  {shipmentStops.map((stop, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1 grid grid-cols-3 gap-4">
                            <div>
                              <Label className="text-xs">Location</Label>
                              <Input
                                value={stop.location}
                                onChange={(e) => updateStop(index, 'location', e.target.value)}
                                placeholder="Enter location"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Type</Label>
                              <Select 
                                value={stop.type} 
                                onValueChange={(value) => updateStop(index, 'type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Shop">Shop</SelectItem>
                                  <SelectItem value="Galvanizer">Galvanizer</SelectItem>
                                  <SelectItem value="Painter">Painter</SelectItem>
                                  <SelectItem value="Site">Site</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs">Date</Label>
                              <Input
                                type="date"
                                value={stop.date}
                                onChange={(e) => updateStop(index, 'date', e.target.value)}
                              />
                            </div>
                          </div>
                          {shipmentStops.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeStop(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateShipment}
                disabled={selectedPackages.length === 0 || !shipmentStops.every(stop => stop.location)}
              >
                Create Shipment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Available Packages */}
        <Card>
          <CardHeader>
            <CardTitle>Ready for Shipping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{pkg.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {pkg.hangerIds.length} hangers
                      </p>
                    </div>
                  </div>
                  <Badge variant={pkg.state === "ShopQAPassed" ? "default" : "secondary"}>
                    {pkg.state}
                  </Badge>
                </div>
              ))}
              {filteredPackages.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No packages ready for shipping
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Shipments */}
        <Card>
          <CardHeader>
            <CardTitle>Active Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shipments.map((shipment) => (
                <div key={shipment.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{shipment.id}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateBOL(shipment)}
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      BOL
                    </Button>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>To: {shipment.bol?.shipTo}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package className="h-3 w-3" />
                      <span>{shipment.packages.length} packages</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Next: {shipment.stops[1]?.location || 'Destination'}</span>
                    </div>
                  </div>
                </div>
              ))}
              {shipments.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No active shipments
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}