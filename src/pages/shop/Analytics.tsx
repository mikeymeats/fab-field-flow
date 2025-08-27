import { useDB } from "@/store/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  Target,
  Users,
  Package
} from "lucide-react";

export default function Analytics() {
  const { hangers, packages, workOrders, audits } = useDB();

  // Calculate KPIs
  const totalHangers = hangers.length;
  const completedHangers = hangers.filter(h => h.status === "ShopQAPassed").length;
  const wipPackages = packages.filter(p => ["Planned", "Kitted", "Assembled"].includes(p.state)).length;
  const activeWorkOrders = workOrders.filter(wo => wo.state !== "Completed").length;

  // Calculate time and cost variances
  const totalEstHours = hangers.reduce((sum, h) => sum + h.estHours, 0);
  const totalActHours = hangers.reduce((sum, h) => sum + h.actHours, 0);
  const hoursVariance = totalActHours > 0 ? ((totalActHours - totalEstHours) / totalEstHours) * 100 : 0;

  const totalEstCost = hangers.reduce((sum, h) => sum + h.estMatCost, 0);
  const totalActCost = hangers.reduce((sum, h) => sum + h.actMatCost, 0);
  const costVariance = totalActCost > 0 ? ((totalActCost - totalEstCost) / totalEstCost) * 100 : 0;

  // Calculate completion rate
  const completionRate = totalHangers > 0 ? (completedHangers / totalHangers) * 100 : 0;

  // Station utilization (mock data)
  const stationData = [
    { station: "Station 1", utilization: 85, capacity: 100, current: "WO-002" },
    { station: "Station 2", utilization: 92, capacity: 100, current: "WO-005" },
    { station: "Station 3", utilization: 67, capacity: 100, current: "WO-001" },
    { station: "Station 4", utilization: 78, capacity: 100, current: "WO-008" }
  ];

  // QA defect analysis (mock data)
  const defectData = [
    { type: "Torque Issues", count: 12, percentage: 35 },
    { type: "Alignment", count: 8, percentage: 24 },
    { type: "Documentation", count: 7, percentage: 21 },
    { type: "Material Defects", count: 4, percentage: 12 },
    { type: "Other", count: 3, percentage: 8 }
  ];

  // Cycle time analysis
  const avgKittingTime = 2.3; // hours
  const avgAssemblyTime = 4.7; // hours
  const avgQATime = 1.2; // hours

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Shop Analytics</h1>
        <p className="text-muted-foreground">Performance metrics and operational insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="mr-2 h-4 w-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {completedHangers} of {totalHangers} hangers completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Hours Variance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${hoursVariance > 10 ? 'text-red-600' : hoursVariance < -5 ? 'text-green-600' : ''}`}>
              {hoursVariance > 0 ? '+' : ''}{hoursVariance.toFixed(1)}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {hoursVariance > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-red-600" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-green-600" />
              )}
              Est: {totalEstHours.toFixed(1)}h, Act: {totalActHours.toFixed(1)}h
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              Cost Variance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${costVariance > 5 ? 'text-red-600' : costVariance < -2 ? 'text-green-600' : ''}`}>
              {costVariance > 0 ? '+' : ''}{costVariance.toFixed(1)}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {costVariance > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-red-600" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-green-600" />
              )}
              Est: ${totalEstCost.toFixed(0)}, Act: ${totalActCost.toFixed(0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="mr-2 h-4 w-4" />
              WIP Packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wipPackages}</div>
            <p className="text-xs text-muted-foreground">
              {activeWorkOrders} active work orders
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="utilization" className="space-y-4">
        <TabsList>
          <TabsTrigger value="utilization">Station Utilization</TabsTrigger>
          <TabsTrigger value="quality">Quality Analysis</TabsTrigger>
          <TabsTrigger value="cycle">Cycle Times</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="utilization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Station Utilization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stationData.map((station) => (
                <div key={station.station} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{station.station}</span>
                      <Badge variant="outline">{station.current}</Badge>
                    </div>
                    <span className="text-sm font-medium">{station.utilization}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        station.utilization > 90 ? 'bg-red-500' :
                        station.utilization > 75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${station.utilization}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>QA Defect Pareto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {defectData.map((defect, index) => (
                  <div key={defect.type} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{defect.type}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{defect.count}</span>
                        <Badge variant="outline">{defect.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-red-500 h-1.5 rounded-full"
                        style={{ width: `${defect.percentage * 2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QA Pass Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-green-600">94.2%</div>
                  <p className="text-muted-foreground">First-time pass rate this month</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This Week:</span>
                      <span className="font-medium">96.1%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Week:</span>
                      <span className="font-medium">92.3%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Month Avg:</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cycle" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Kitting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgKittingTime}h</div>
                <p className="text-sm text-muted-foreground">Average cycle time</p>
                <div className="mt-2 flex items-center text-xs">
                  <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-600">-12% vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Assembly
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgAssemblyTime}h</div>
                <p className="text-sm text-muted-foreground">Average cycle time</p>
                <div className="mt-2 flex items-center text-xs">
                  <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-600">+8% vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  QA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgQATime}h</div>
                <p className="text-sm text-muted-foreground">Average cycle time</p>
                <div className="mt-2 flex items-center text-xs">
                  <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-600">-5% vs last month</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Key metrics over the last 7 days
                </div>
                
                {/* Simple trend visualization */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Hangers Completed</span>
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">📈</div>
                      <span className="text-lg font-bold">156</span>
                      <Badge className="bg-green-100 text-green-800">+23%</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Avg Efficiency</span>
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">📊</div>
                      <span className="text-lg font-bold">94.2%</span>
                      <Badge className="bg-blue-100 text-blue-800">+2.1%</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Defect Rate</span>
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">⚠️</div>
                      <span className="text-lg font-bold">5.8%</span>
                      <Badge className="bg-yellow-100 text-yellow-800">-0.4%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}