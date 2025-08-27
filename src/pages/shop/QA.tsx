import { useState } from "react";
import { useDB } from "@/store/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, CheckCircle, Camera, FileSignature, AlertTriangle, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const qaChecklists = {
  "Bang-It+": [
    { id: "torque", label: "Torque specification met (65 ft-lbs)", type: "number", unit: "ft-lbs" },
    { id: "lot", label: "Lot/Heat number recorded", type: "text" },
    { id: "alignment", label: "Proper alignment verified", type: "checkbox" },
    { id: "photo", label: "Installation photos taken", type: "file" }
  ],
  "Steel Drop-In": [
    { id: "torque", label: "Torque specification met (25 ft-lbs)", type: "number", unit: "ft-lbs" },
    { id: "depth", label: "Embedment depth verified", type: "number", unit: "inches" },
    { id: "lot", label: "Lot number recorded", type: "text" },
    { id: "photo", label: "Installation photos taken", type: "file" }
  ],
  "Power-Stud+": [
    { id: "torque", label: "Torque specification met (50 ft-lbs)", type: "number", unit: "ft-lbs" },
    { id: "wedge", label: "Wedge expansion verified", type: "checkbox" },
    { id: "lot", label: "Lot/Heat number recorded", type: "text" },
    { id: "photo", label: "Installation photos taken", type: "file" }
  ],
  "UltraCon+": [
    { id: "torque", label: "Torque specification met (35 ft-lbs)", type: "number", unit: "ft-lbs" },
    { id: "thread", label: "Thread engagement verified", type: "checkbox" },
    { id: "lot", label: "Lot number recorded", type: "text" },
    { id: "photo", label: "Installation photos taken", type: "file" }
  ],
  "Hangermate": [
    { id: "load", label: "Load rating verified", type: "number", unit: "lbs" },
    { id: "connection", label: "Connection integrity checked", type: "checkbox" },
    { id: "lot", label: "Serial number recorded", type: "text" },
    { id: "photo", label: "Installation photos taken", type: "file" }
  ],
  "TOUGHWIRE": [
    { id: "tension", label: "Wire tension verified", type: "number", unit: "lbs" },
    { id: "crimp", label: "Crimp connections inspected", type: "checkbox" },
    { id: "safety", label: "Safety factor confirmed", type: "checkbox" },
    { id: "photo", label: "Installation photos taken", type: "file" }
  ]
};

export default function QA() {
  const { packages, hangers, advancePackage, setHangerState } = useDB();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [qaData, setQAData] = useState<Record<string, any>>({});

  // Get packages ready for QA (Assembled state)
  const qaPackages = packages.filter(pkg => pkg.state === "Assembled");

  const filteredPackages = qaPackages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPackageHangers = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    return hangers.filter(h => pkg?.hangerIds.includes(h.id));
  };

  const getAttachmentType = (hanger: any) => {
    const model = hanger.upperAttachment?.model || "";
    if (model.includes("Bang-It")) return "Bang-It+";
    if (model.includes("Drop-In") || model.includes("Steel")) return "Steel Drop-In";
    if (model.includes("Power-Stud")) return "Power-Stud+";
    if (model.includes("UltraCon")) return "UltraCon+";
    if (model.includes("Hangermate")) return "Hangermate";
    if (model.includes("TOUGHWIRE")) return "TOUGHWIRE";
    return "Bang-It+"; // Default
  };

  const handleQAValue = (hangerId: string, checkId: string, value: any) => {
    setQAData(prev => ({
      ...prev,
      [hangerId]: {
        ...prev[hangerId],
        [checkId]: value
      }
    }));
  };

  const isHangerQAComplete = (hangerId: string, attachmentType: string) => {
    const checklist = qaChecklists[attachmentType as keyof typeof qaChecklists];
    const hangerData = qaData[hangerId] || {};
    
    return checklist.every(check => {
      const value = hangerData[check.id];
      if (check.type === "checkbox") return value === true;
      if (check.type === "number") return value && value > 0;
      if (check.type === "text") return value && value.trim().length > 0;
      if (check.type === "file") return value === true; // Simulated file upload
      return false;
    });
  };

  const isPackageQAComplete = (packageId: string) => {
    const packageHangers = getPackageHangers(packageId);
    return packageHangers.every(hanger => {
      const attachmentType = getAttachmentType(hanger);
      return isHangerQAComplete(hanger.id, attachmentType);
    });
  };

  const handlePassQA = (packageId: string) => {
    const packageHangers = getPackageHangers(packageId);
    
    // Update all hangers in package to passed state
    packageHangers.forEach(hanger => {
      setHangerState(hanger.id, "ShopQAPassed");
    });
    
    // Advance package state
    advancePackage(packageId, "ShopQAPassed");
    
    // Clear QA data for this package
    packageHangers.forEach(hanger => {
      setQAData(prev => {
        const newData = { ...prev };
        delete newData[hanger.id];
        return newData;
      });
    });
    
    setSelectedPackage(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shop QA</h1>
          <p className="text-muted-foreground">Quality assurance for fabricated hangers</p>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPackages.map((pkg) => {
          const packageHangers = getPackageHangers(pkg.id);
          const completedHangers = packageHangers.filter(hanger => 
            isHangerQAComplete(hanger.id, getAttachmentType(hanger))
          ).length;
          const isComplete = isPackageQAComplete(pkg.id);

          return (
            <Card key={pkg.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    {pkg.name}
                  </CardTitle>
                  <Badge variant={isComplete ? "default" : "secondary"}>
                    {completedHangers}/{packageHangers.length} QA'd
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hangers:</span>
                    <span>{packageHangers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Progress:</span>
                    <span>{Math.round((completedHangers / packageHangers.length) * 100)}%</span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={cn(
                      "h-2 rounded-full transition-all",
                      isComplete ? "bg-green-500" : "bg-primary"
                    )}
                    style={{ width: `${(completedHangers / packageHangers.length) * 100}%` }}
                  />
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      Start QA Inspection
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>QA Inspection - {pkg.name}</DialogTitle>
                      <DialogDescription>
                        Complete quality assurance checks for all hangers in this package
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {packageHangers.map((hanger) => {
                        const attachmentType = getAttachmentType(hanger);
                        const checklist = qaChecklists[attachmentType as keyof typeof qaChecklists];
                        const isHangerComplete = isHangerQAComplete(hanger.id, attachmentType);
                        
                        return (
                          <Card key={hanger.id} className={cn(
                            "border-2",
                            isHangerComplete ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20" : ""
                          )}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold">{hanger.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {attachmentType} - {hanger.type}
                                  </p>
                                </div>
                                {isHangerComplete && (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Complete
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {checklist.map((check) => (
                                <div key={check.id} className="space-y-2">
                                  <Label className="text-sm font-medium">{check.label}</Label>
                                  
                                  {check.type === "number" && (
                                    <div className="flex items-center space-x-2">
                                      <Input
                                        type="number"
                                        placeholder={`Enter ${check.unit}`}
                                        value={qaData[hanger.id]?.[check.id] || ""}
                                        onChange={(e) => handleQAValue(hanger.id, check.id, parseFloat(e.target.value))}
                                        className="w-32"
                                      />
                                      <span className="text-sm text-muted-foreground">{check.unit}</span>
                                    </div>
                                  )}
                                  
                                  {check.type === "text" && (
                                    <Input
                                      placeholder="Enter value"
                                      value={qaData[hanger.id]?.[check.id] || ""}
                                      onChange={(e) => handleQAValue(hanger.id, check.id, e.target.value)}
                                    />
                                  )}
                                  
                                  {check.type === "checkbox" && (
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        checked={qaData[hanger.id]?.[check.id] || false}
                                        onCheckedChange={(checked) => handleQAValue(hanger.id, check.id, checked)}
                                      />
                                      <span className="text-sm">Verified</span>
                                    </div>
                                  )}
                                  
                                  {check.type === "file" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleQAValue(hanger.id, check.id, true)}
                                      className={qaData[hanger.id]?.[check.id] ? "bg-green-100" : ""}
                                    >
                                      <Camera className="mr-2 h-4 w-4" />
                                      {qaData[hanger.id]?.[check.id] ? "Photos Taken ✓" : "Take Photos"}
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setSelectedPackage(null)}>
                        Cancel
                      </Button>
                      <Button
                        disabled={!isPackageQAComplete(pkg.id)}
                        onClick={() => handlePassQA(pkg.id)}
                        className={cn(
                          "bg-green-600 hover:bg-green-700 text-white",
                          !isPackageQAComplete(pkg.id) && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Pass QA & Advance to Staging
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {isComplete && (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handlePassQA(pkg.id)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Pass QA
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No packages ready for QA</h3>
          <p className="text-muted-foreground">
            Complete assembly work to move packages into QA
          </p>
        </div>
      )}
    </div>
  );
}