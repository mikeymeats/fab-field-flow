import { useState } from "react";
import { useDB } from "@/store/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Zap, Users, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const stateColumns = [
  { id: "Planned", title: "Planned", color: "bg-blue-50 dark:bg-blue-900/20" },
  { id: "Kitted", title: "Kitted", color: "bg-green-50 dark:bg-green-900/20" },
  { id: "Assembled", title: "Assembled", color: "bg-purple-50 dark:bg-purple-900/20" },
  { id: "ShopQAPassed", title: "Shop QA", color: "bg-orange-50 dark:bg-orange-900/20" },
  { id: "Staged", title: "Staged", color: "bg-gray-50 dark:bg-gray-900/20" }
];

const priorityColors = {
  High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Med: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
};

export default function Scheduler() {
  const { workOrders, packages, hangers, updateWorkOrder, autoSchedule } = useDB();
  const [isAutoScheduling, setIsAutoScheduling] = useState(false);

  const getWorkOrdersByState = (state: string) => {
    return workOrders.filter(wo => {
      const pkg = packages.find(p => p.id === wo.packageId);
      return pkg?.state === state;
    });
  };

  const getPackageInfo = (packageId: string) => {
    return packages.find(p => p.id === packageId);
  };

  const getEstimatedHours = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return 0;
    
    return pkg.hangerIds.reduce((total, hangerId) => {
      const hanger = hangers.find(h => h.id === hangerId);
      return total + (hanger?.estHours || 0);
    }, 0);
  };

  const getActualHours = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return 0;
    
    return pkg.hangerIds.reduce((total, hangerId) => {
      const hanger = hangers.find(h => h.id === hangerId);
      return total + (hanger?.actHours || 0);
    }, 0);
  };

  const handleAutoSchedule = async () => {
    setIsAutoScheduling(true);
    // Simulate async scheduling with animation
    setTimeout(() => {
      autoSchedule();
      setIsAutoScheduling(false);
    }, 1500);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scheduler</h1>
          <p className="text-muted-foreground">Optimize work order scheduling and resource allocation</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            className={cn(
              "bg-primary hover:bg-primary/90",
              isAutoScheduling && "animate-pulse"
            )}
            onClick={handleAutoSchedule}
            disabled={isAutoScheduling}
          >
            <Zap className="mr-2 h-4 w-4" />
            {isAutoScheduling ? "Auto Scheduling..." : "AutoSchedule"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Work Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workOrders.length}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <BarChart3 className="mr-1 h-3 w-3" />
              Active jobs
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Behind Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3" />
              Need attention
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{workOrders.length - 3}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3" />
              On track
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              Est vs Actual
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="board" className="space-y-4">
        <TabsList>
          <TabsTrigger value="board">Board View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-4">
          <div className="grid grid-cols-5 gap-4 min-h-[600px]">
            {stateColumns.map((column) => (
              <div key={column.id} className={cn("rounded-lg p-4", column.color)}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {getWorkOrdersByState(column.id).length}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {getWorkOrdersByState(column.id).map((wo) => {
                    const pkg = getPackageInfo(wo.packageId);
                    const estHours = getEstimatedHours(wo.packageId);
                    const actHours = getActualHours(wo.packageId);
                    const variance = actHours > 0 ? ((actHours - estHours) / estHours) * 100 : 0;
                    
                    return (
                      <Card 
                        key={wo.id} 
                        className={cn(
                          "cursor-pointer hover:shadow-md transition-all",
                          isAutoScheduling && "animate-bounce"
                        )}
                      >
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{wo.id}</p>
                              <Badge 
                                className={priorityColors[wo.priority || "Med"]}
                              >
                                {wo.priority}
                              </Badge>
                            </div>
                            
                            <p className="text-xs text-muted-foreground">{pkg?.name}</p>
                            
                            <div className="text-xs space-y-1">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Team:</span>
                                <span>{wo.team || "Unassigned"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Due:</span>
                                <span>{formatDate(wo.due)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Est Hours:</span>
                                <span>{estHours.toFixed(1)}h</span>
                              </div>
                              {actHours > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Variance:</span>
                                  <span className={variance > 10 ? "text-red-600" : variance < -10 ? "text-green-600" : ""}>
                                    {variance > 0 ? "+" : ""}{variance.toFixed(0)}%
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="space-y-2">
            {workOrders.map((wo) => {
              const pkg = getPackageInfo(wo.packageId);
              const estHours = getEstimatedHours(wo.packageId);
              
              return (
                <Card key={wo.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{wo.id}</p>
                          <p className="text-sm text-muted-foreground">{pkg?.name}</p>
                        </div>
                        <Badge className={priorityColors[wo.priority || "Med"]}>
                          {wo.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{wo.team || "Unassigned"}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{estHours.toFixed(1)}h</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formatDate(wo.due)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Timeline bar simulation */}
                    <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${Math.min(50, 100)}%` }}
                          />
                        </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}