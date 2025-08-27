import { useState } from "react";
import { useDB } from "@/store/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, Package2, CheckCircle, Clock, Box } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock BOM data for demonstration
const mockBOM = {
  "Trapeze": [
    { id: "ROD-3/8-10", desc: "3/8\" Threaded Rod - 10ft", qty: 2, bin: "A-12", picked: false },
    { id: "CH-P1000", desc: "P1000 Channel - 4ft", qty: 1, bin: "B-05", picked: false },
    { id: "NUT-3/8-HEX", desc: "3/8\" Hex Nuts", qty: 4, bin: "C-18", picked: false },
    { id: "WASH-3/8-FLT", desc: "3/8\" Flat Washers", qty: 4, bin: "C-19", picked: false }
  ],
  "Clevis": [
    { id: "ROD-3/8-8", desc: "3/8\" Threaded Rod - 8ft", qty: 1, bin: "A-12", picked: false },
    { id: "CLEV-3/8", desc: "3/8\" Clevis Hanger", qty: 1, bin: "D-03", picked: false },
    { id: "NUT-3/8-HEX", desc: "3/8\" Hex Nuts", qty: 2, bin: "C-18", picked: false }
  ],
  "Seismic": [
    { id: "ROD-1/2-12", desc: "1/2\" Threaded Rod - 12ft", qty: 2, bin: "A-15", picked: false },
    { id: "CH-P1000", desc: "P1000 Channel - 6ft", qty: 1, bin: "B-05", picked: false },
    { id: "SEIS-BRC", desc: "Seismic Bracing Kit", qty: 1, bin: "E-07", picked: false },
    { id: "NUT-1/2-HEX", desc: "1/2\" Hex Nuts", qty: 6, bin: "C-22", picked: false }
  ]
};

export default function Kitting() {
  const { packages, hangers, advancePackage } = useDB();
  const [searchTerm, setSearchTerm] = useState("");
  const [pickedItems, setPickedItems] = useState<Record<string, Record<string, boolean>>>({});

  // Get packages that need kitting (Planned or with pick lists)
  const kittingPackages = packages.filter(pkg => 
    pkg.state === "Planned" || (pkg.pickListId && pkg.state === "Kitted")
  );

  const filteredPackages = kittingPackages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.pickListId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPackageBOM = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return [];

    const packageHangers = hangers.filter(h => pkg.hangerIds.includes(h.id));
    const bomItems: any[] = [];

    packageHangers.forEach(hanger => {
      const hangerType = hanger.type;
      const templateBOM = mockBOM[hangerType as keyof typeof mockBOM] || mockBOM.Trapeze;
      
      templateBOM.forEach(item => {
        const existingItem = bomItems.find(b => b.id === item.id);
        if (existingItem) {
          existingItem.qty += item.qty;
        } else {
          bomItems.push({
            ...item,
            hangerId: hanger.id,
            picked: pickedItems[packageId]?.[item.id] || false
          });
        }
      });
    });

    return bomItems;
  };

  const handleItemPicked = (packageId: string, itemId: string, picked: boolean) => {
    setPickedItems(prev => ({
      ...prev,
      [packageId]: {
        ...prev[packageId],
        [itemId]: picked
      }
    }));
  };

  const getPickedCount = (packageId: string) => {
    const bom = getPackageBOM(packageId);
    const picked = Object.values(pickedItems[packageId] || {}).filter(Boolean).length;
    return { picked, total: bom.length };
  };

  const isKittingComplete = (packageId: string) => {
    const { picked, total } = getPickedCount(packageId);
    return total > 0 && picked === total;
  };

  const handleCompleteKitting = (packageId: string) => {
    advancePackage(packageId, "Kitted");
    // Clear picked items for this package
    setPickedItems(prev => ({
      ...prev,
      [packageId]: {}
    }));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kitting</h1>
          <p className="text-muted-foreground">Pick and prepare packages for fabrication</p>
        </div>
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

      <div className="grid gap-6">
        {filteredPackages.map((pkg) => {
          const bom = getPackageBOM(pkg.id);
          const { picked, total } = getPickedCount(pkg.id);
          const isComplete = isKittingComplete(pkg.id);
          const progress = total > 0 ? (picked / total) * 100 : 0;

          return (
            <Card key={pkg.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package2 className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Pick List: {pkg.pickListId || "Not created"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={pkg.state === "Kitted" ? "default" : "secondary"}>
                      {pkg.state}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {picked} of {total} picked ({progress.toFixed(0)}%)
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      isComplete ? "bg-green-500" : "bg-primary"
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {bom.map((item) => {
                    const isPicked = pickedItems[pkg.id]?.[item.id] || false;
                    
                    return (
                      <div 
                        key={item.id} 
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-lg border",
                          isPicked ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" : "bg-white dark:bg-gray-800"
                        )}
                      >
                        <Checkbox
                          checked={isPicked}
                          onCheckedChange={(checked) => 
                            handleItemPicked(pkg.id, item.id, !!checked)
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={cn(
                              "text-sm font-medium",
                              isPicked && "line-through text-muted-foreground"
                            )}>
                              {item.desc}
                            </p>
                            <Badge variant="outline" className="ml-2">
                              Qty: {item.qty}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Box className="h-3 w-3" />
                              <span>Bin: {item.bin}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <span>SKU: {item.id}</span>
                            </div>
                          </div>
                        </div>
                        {isPicked && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end space-x-2">
                  {pkg.state === "Planned" && (
                    <Button
                      disabled={!isComplete}
                      className={cn(
                        "bg-primary hover:bg-primary/90",
                        isComplete && "bg-green-600 hover:bg-green-700"
                      )}
                      onClick={() => handleCompleteKitting(pkg.id)}
                    >
                      {isComplete ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Complete Kitting
                        </>
                      ) : (
                        <>
                          <Clock className="mr-2 h-4 w-4" />
                          Pick All Items ({picked}/{total})
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <Package2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No packages for kitting</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms" : "Create pick lists from packages to start kitting"}
          </p>
        </div>
      )}
    </div>
  );
}