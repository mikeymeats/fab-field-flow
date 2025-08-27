import { useState } from "react";
import { useDB } from "@/store/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Eye, 
  Package, 
  MapPin, 
  Wrench, 
  FileText, 
  Info,
  Settings,
  Search
} from "lucide-react";

export function Hangers() {
  const { scopedHangers, scopedPackages, setHangerState, projects, activeProjectId } = useDB();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHanger, setSelectedHanger] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const hangers = scopedHangers();
  const packages = scopedPackages();
  const activeProject = projects.find(p => p.id === activeProjectId);
  
  const filteredHangers = hangers.filter(hanger =>
    hanger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hanger.system.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hanger.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ApprovedForFab': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Planned': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Kitted': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Assembled': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'ShopQAPassed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const findHangerPackage = (hangerId: string) => {
    return packages.find(pkg => pkg.hangerIds.includes(hangerId));
  };

  const openHangerDetails = (hanger: any) => {
    setSelectedHanger(hanger);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hangers</h1>
          <p className="text-muted-foreground">
            Manage hanger assemblies and track fabrication progress
            {activeProject && (
              <span className="ml-2 text-primary">• {activeProject.name}</span>
            )}
          </p>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          {hangers.length} hangers in {packages.length} packages
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search hangers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredHangers.map((hanger) => {
          const hangerPackage = findHangerPackage(hanger.id);
          return (
            <Card key={hanger.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openHangerDetails(hanger)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold truncate">{hanger.id}</CardTitle>
                  <Badge variant="outline" className={getStatusColor(hanger.status)}>
                    {hanger.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {hanger.type} • {hanger.system} • Level {hanger.level}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Zone:</span>
                    <div className="font-medium">{hanger.zone}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Package:</span>
                    <div className="font-medium">{hangerPackage?.name || 'None'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Est Cost:</span>
                    <div className="font-medium">${hanger.estMatCost.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Grid:</span>
                    <div className="font-medium">{hanger.grid}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedHanger && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {selectedHanger.name}
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="bom">BOM</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Basic Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div><strong>Type:</strong> {selectedHanger.type}</div>
                        <div><strong>System:</strong> {selectedHanger.system}</div>
                        <div><strong>Level:</strong> {selectedHanger.level}</div>
                        <div><strong>Zone:</strong> {selectedHanger.zone}</div>
                        <div><strong>Grid:</strong> {selectedHanger.grid}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Package Info</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const pkg = findHangerPackage(selectedHanger.id);
                          return pkg ? (
                            <div className="space-y-2 text-sm">
                              <div><strong>Package:</strong> {pkg.name}</div>
                              <div><strong>State:</strong> {pkg.state}</div>
                              <div><strong>Total Hangers:</strong> {pkg.hangerIds.length}</div>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No package assigned</p>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="bom">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bill of Materials</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>SKU</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>UOM</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedHanger.items?.map((item: any, i: number) => (
                            <TableRow key={i}>
                              <TableCell>{item.sku}</TableCell>
                              <TableCell>{item.desc}</TableCell>
                              <TableCell>{item.qty}</TableCell>
                              <TableCell>{item.uom}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="actions">
                  <Card>
                    <CardHeader>
                      <CardTitle>Update Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {['ApprovedForFab', 'Planned', 'Kitted', 'Assembled', 'ShopQAPassed'].map(status => (
                          <Button
                            key={status}
                            size="sm"
                            onClick={() => setHangerState(selectedHanger.id, status)}
                            variant={selectedHanger.status === status ? 'default' : 'outline'}
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}