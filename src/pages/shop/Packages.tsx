import { useState } from "react";
import { useDB } from "@/store/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Package, FileText, Plus, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const stateColors = {
  Planned: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Kitted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Assembled: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  ShopQAPassed: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Staged: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  Loaded: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
};

export default function Packages() {
  const { packages, hangers, createWorkOrder, createPickList, advancePackage } = useDB();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.level?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.zone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPackageHangers = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    return hangers.filter(h => pkg?.hangerIds.includes(h.id));
  };

  const handleCreatePickList = (packageId: string) => {
    const pickListId = createPickList(packageId);
    // Auto-advance to Kitted state
    advancePackage(packageId, "Kitted");
  };

  const handleCreateWorkOrder = (packageId: string) => {
    createWorkOrder(packageId, {
      team: "Team A",
      station: "Station 1",
      due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: "Med" as const
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Packages</h1>
          <p className="text-muted-foreground">Manage hanger packages by level and zone</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          New Package
        </Button>
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
        <Button variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Print Labels
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPackages.map((pkg) => (
          <Card key={pkg.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  {pkg.name}
                </CardTitle>
                <Badge className={stateColors[pkg.state as keyof typeof stateColors] || "bg-gray-100"}>
                  {pkg.state}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Level:</span>
                  <p className="font-medium">{pkg.level}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Zone:</span>
                  <p className="font-medium">{pkg.zone}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Hangers:</span>
                  <p className="font-medium">{pkg.hangerIds.length}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Pick List:</span>
                  <p className="font-medium">{pkg.pickListId || "None"}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{pkg.name} - Package Details</DialogTitle>
                      <DialogDescription>
                        Package contents and specifications
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Package Info</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Level:</span> {pkg.level}</p>
                            <p><span className="text-muted-foreground">Zone:</span> {pkg.zone}</p>
                            <p><span className="text-muted-foreground">State:</span> {pkg.state}</p>
                            <p><span className="text-muted-foreground">Pick List:</span> {pkg.pickListId || "Not created"}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Contents ({pkg.hangerIds.length} hangers)</h4>
                          <div className="max-h-40 overflow-y-auto space-y-1">
                            {getPackageHangers(pkg.id).map(hanger => (
                              <div key={hanger.id} className="text-sm p-2 bg-muted rounded">
                                <p className="font-medium">{hanger.name}</p>
                                <p className="text-muted-foreground">{hanger.type} - {hanger.system}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {pkg.state === "Planned" && (
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => handleCreatePickList(pkg.id)}
                  >
                    Create Pick List
                  </Button>
                )}

                {pkg.state === "Planned" && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCreateWorkOrder(pkg.id)}
                  >
                    Create Work Order
                  </Button>
                )}

                {pkg.state === "Kitted" && (
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => advancePackage(pkg.id, "Assembled")}
                  >
                    Mark Assembled
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No packages found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms" : "Create packages from hangers to get started"}
          </p>
        </div>
      )}
    </div>
  );
}