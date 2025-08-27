import { useDB } from '@/store/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, DollarSign, Users, Package, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ExecutiveAnalytics() {
  const { projects, packages, hangers, assignments, inventory, workOrders } = useDB();
  
  // Calculate KPIs
  const totalProjects = projects.length;
  const activeProjects = projects.length; // All projects are active in demo
  const totalPackages = packages.length;
  const totalHangers = hangers.length;
  const completedHangers = hangers.filter(h => h.status === 'Complete').length;
  const wipHangers = hangers.filter(h => ['Planned', 'Kitted', 'InFabrication', 'Assembled'].includes(h.status)).length;
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.state === 'Done').length;
  const criticalInventory = inventory.filter(i => i.onHand <= i.min).length;
  
  // Financial metrics (demo calculations)
  const totalProjectValue = projects.reduce((sum, p) => sum + 2500000, 0); // $2.5M avg per project
  const estimatedCosts = hangers.reduce((sum, h) => sum + h.estMatCost, 0);
  const actualCosts = hangers.reduce((sum, h) => sum + h.actMatCost, 0);
  const costVariance = ((actualCosts - estimatedCosts) / estimatedCosts * 100) || 0;
  
  // Throughput metrics
  const avgCycleTime = 4.2; // days (demo)
  const throughputRate = completedHangers / Math.max(totalHangers, 1) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Executive Dashboard</h1>
          <p className="text-muted-foreground">Portfolio overview and key performance indicators</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Real-time</Badge>
          <Badge variant="default">Updated: {new Date().toLocaleTimeString()}</Badge>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalProjectValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last quarter
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Variance</CardTitle>
            {costVariance > 0 ? 
              <TrendingUp className="h-4 w-4 text-destructive" /> : 
              <TrendingDown className="h-4 w-4 text-green-500" />
            }
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${costVariance > 0 ? 'text-destructive' : 'text-green-500'}`}>
              {costVariance > 0 ? '+' : ''}{costVariance.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Est: ${estimatedCosts.toLocaleString()} | Act: ${actualCosts.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cycle Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCycleTime} days</div>
            <p className="text-xs text-muted-foreground">
              Target: 3.5 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{throughputRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {completedHangers} of {totalHangers} completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Operations Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>Current portfolio status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Projects</span>
              <span className="font-bold">{activeProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Packages</span>
              <span className="font-bold">{totalPackages}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Hangers</span>
              <span className="font-bold">{totalHangers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">WIP Hangers</span>
              <Badge variant="secondary">{wipHangers}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Metrics</CardTitle>
            <CardDescription>Shop floor performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Assignments</span>
              <span className="font-bold">{totalAssignments - completedAssignments}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Completed Today</span>
              <span className="font-bold text-green-500">{Math.floor(completedAssignments * 0.1)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Completion Rate</span>
              <span className="font-bold">{(completedAssignments / Math.max(totalAssignments, 1) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg Hours/Hanger</span>
              <span className="font-bold">4.2h</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Indicators</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-destructive" />
                Critical Inventory
              </span>
              <Badge variant="destructive">{criticalInventory}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Overdue Shipments</span>
              <Badge variant="secondary">2</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">QA Failures</span>
              <Badge variant="outline">1</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Schedule Risk</span>
              <Badge variant="secondary">Medium</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle>Project Performance</CardTitle>
          <CardDescription>Detailed breakdown by project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => {
              const projectPackages = packages.filter(p => p.projectId === project.id);
              const projectHangers = hangers.filter(h => h.projectId === project.id);
              const projectValue = 2500000; // Demo value
              const completion = projectHangers.filter(h => h.status === 'Complete').length / Math.max(projectHangers.length, 1) * 100;
              
              return (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${projectValue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{completion.toFixed(1)}% complete</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Packages</p>
                      <p className="font-medium">{projectPackages.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Hangers</p>
                      <p className="font-medium">{projectHangers.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge variant={completion > 80 ? 'default' : completion > 50 ? 'secondary' : 'outline'}>
                        {completion > 80 ? 'On Track' : completion > 50 ? 'In Progress' : 'Starting'}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}