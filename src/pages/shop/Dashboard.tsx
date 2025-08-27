import { useDB } from "@/store/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Dashboard() {
  const { hangers, packages, workOrders, shipments } = useDB();

  const stats = {
    totalHangers: hangers.length,
    wipPackages: packages.filter(p => ['Planned', 'Kitted', 'Assembled'].includes(p.state)).length,
    activeWorkOrders: workOrders.filter(wo => wo.state !== 'Completed').length,
    shipmentsToday: shipments.filter(s => s.state === 'InTransit').length,
    estHours: hangers.reduce((sum, h) => sum + h.estHours, 0),
    actHours: hangers.reduce((sum, h) => sum + h.actHours, 0),
  };

  const variance = ((stats.actHours - stats.estHours) / stats.estHours * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shop Dashboard</h1>
        <p className="text-muted-foreground">MEP hanger fabrication overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-card to-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hangers</CardTitle>
            <Badge variant="secondary">{stats.totalHangers}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalHangers}</div>
            <p className="text-xs text-muted-foreground">Ready for fabrication</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WIP Packages</CardTitle>
            <Badge variant="outline">{stats.wipPackages}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.wipPackages}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Orders</CardTitle>
            <Badge variant="outline">{stats.activeWorkOrders}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.activeWorkOrders}</div>
            <p className="text-xs text-muted-foreground">Active orders</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Variance</CardTitle>
            <Badge variant={parseFloat(variance) > 0 ? "destructive" : "secondary"}>
              {variance > '0' ? '+' : ''}{variance}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.actHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">vs {stats.estHours.toFixed(1)}h estimated</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Package States</CardTitle>
            <CardDescription>Current distribution of package states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {['Planned', 'Kitted', 'Assembled', 'ShopQAPassed', 'Staged'].map(state => {
              const count = packages.filter(p => p.state === state).length;
              return (
                <div key={state} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{state}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${(count / packages.length) * 100}%` }}
                      />
                    </div>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-muted-foreground">System initialized with {hangers.length} hangers</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-muted-foreground">Generated {packages.length} packages</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-muted-foreground">Created {workOrders.length} work orders</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}