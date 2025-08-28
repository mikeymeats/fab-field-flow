import { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Clock, Users, Package as PackageIcon, Target, Zap } from 'lucide-react';
import type { Package, Team, Assignment } from '@/store/db';

interface ProductionIntelligenceProps {
  packages: Package[];
  teams: Team[];
  assignments: Assignment[];
}

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
  unit?: string;
}

interface Alert {
  id: string;
  type: 'bottleneck' | 'delay' | 'resource' | 'quality';
  severity: 'low' | 'medium' | 'high';
  message: string;
  action?: string;
}

export function ProductionIntelligence({ packages, teams, assignments }: ProductionIntelligenceProps) {
  // Calculate performance metrics
  const metrics = useMemo((): PerformanceMetric[] => {
    const totalPackages = packages.length;
    const completedPackages = packages.filter(p => p.state === 'Delivered').length;
    const inProgressPackages = packages.filter(p => 
      ['Fabrication', 'InProduction', 'QA', 'Inspection', 'Packaging', 'Kitting'].includes(p.state)
    ).length;
    
    // Calculate throughput (packages per day)
    const throughput = Math.floor(Math.random() * 15) + 5; // Mock data
    
    // Calculate cycle time (hours)
    const cycleTime = Math.floor(Math.random() * 48) + 24; // Mock data
    
    // Calculate efficiency percentage
    const efficiency = Math.floor(Math.random() * 20) + 75; // Mock data
    
    // Calculate team utilization
    const totalTeamCapacity = teams.reduce((sum, team) => sum + (team.dailyHours || team.members.length * 8), 0);
    const utilization = totalTeamCapacity > 0 ? 
      Math.min(100, (assignments.length * 8 / totalTeamCapacity) * 100) : 0;

    return [
      {
        id: 'throughput',
        name: 'Daily Throughput',
        value: throughput,
        change: Math.floor(Math.random() * 20) - 10,
        trend: throughput > 12 ? 'up' : throughput < 8 ? 'down' : 'stable',
        icon: PackageIcon,
        color: 'text-blue-500',
        unit: 'pkg/day'
      },
      {
        id: 'cycle-time',
        name: 'Avg Cycle Time',
        value: cycleTime,
        change: Math.floor(Math.random() * 10) - 5,
        trend: cycleTime < 30 ? 'up' : cycleTime > 40 ? 'down' : 'stable',
        icon: Clock,
        color: 'text-purple-500',
        unit: 'hours'
      },
      {
        id: 'efficiency',
        name: 'Production Efficiency',
        value: efficiency,
        change: Math.floor(Math.random() * 10) - 5,
        trend: efficiency > 85 ? 'up' : efficiency < 75 ? 'down' : 'stable',
        icon: Target,
        color: 'text-green-500',
        unit: '%'
      },
      {
        id: 'utilization',
        name: 'Team Utilization',
        value: Math.round(utilization),
        change: Math.floor(Math.random() * 15) - 7,
        trend: utilization > 85 ? 'up' : utilization < 60 ? 'down' : 'stable',
        icon: Users,
        color: 'text-orange-500',
        unit: '%'
      }
    ];
  }, [packages, teams, assignments]);

  // Generate intelligent alerts
  const alerts = useMemo((): Alert[] => {
    const generatedAlerts: Alert[] = [];

    // Check for bottlenecks
    const fabricationPackages = packages.filter(p => p.state === 'Fabrication' || p.state === 'InProduction');
    if (fabricationPackages.length > 10) {
      generatedAlerts.push({
        id: 'fab-bottleneck',
        type: 'bottleneck',
        severity: 'high',
        message: `Fabrication stage has ${fabricationPackages.length} packages. Consider adding resources.`,
        action: 'Reassign team members or expedite critical packages'
      });
    }

    // Check for team overutilization
    teams.forEach(team => {
      const teamAssignments = assignments.filter(a => a.teamId === team.id);
      const utilization = teamAssignments.length * 8 / (team.dailyHours || team.members.length * 8) * 100;
      if (utilization > 100) {
        generatedAlerts.push({
          id: `team-overutil-${team.id}`,
          type: 'resource',
          severity: 'medium',
          message: `Team ${team.name} is ${Math.round(utilization)}% utilized (over capacity).`,
          action: 'Redistribute workload or schedule overtime'
        });
      }
    });

    // Check for potential delays
    const urgentPackages = packages.filter(p => Math.random() < 0.1); // Mock urgent packages
    if (urgentPackages.length > 0) {
      generatedAlerts.push({
        id: 'urgent-packages',
        type: 'delay',
        severity: 'medium',
        message: `${urgentPackages.length} packages may miss delivery deadlines.`,
        action: 'Review and expedite critical packages'
      });
    }

    // Quality issues
    if (Math.random() < 0.3) { // Random quality alert
      generatedAlerts.push({
        id: 'quality-trend',
        type: 'quality',
        severity: 'low',
        message: 'QA rejection rate increased 15% this week.',
        action: 'Review fabrication quality controls'
      });
    }

    return generatedAlerts.slice(0, 5); // Limit to 5 alerts
  }, [packages, teams, assignments]);

  // Stage analysis
  const stageAnalysis = useMemo(() => {
    const stages = ['Fabrication', 'QA', 'Packaging', 'Shipping'];
    return stages.map(stage => {
      const stagePackages = packages.filter(p => 
        stage === 'Fabrication' ? ['Fabrication', 'InProduction'].includes(p.state) :
        stage === 'QA' ? ['QA', 'Inspection'].includes(p.state) :
        stage === 'Packaging' ? ['Packaging', 'Kitting'].includes(p.state) :
        ['Shipping', 'Shipped'].includes(p.state)
      );

      const avgTime = Math.floor(Math.random() * 24) + 8; // Mock average time
      const throughput = Math.floor(stagePackages.length / 2) + 1;
      const isBottleneck = stagePackages.length > 8;

      return {
        name: stage,
        count: stagePackages.length,
        avgTime,
        throughput,
        isBottleneck,
        efficiency: Math.floor(Math.random() * 30) + 70,
      };
    });
  }, [packages]);

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50 text-red-700';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'low': return 'border-blue-500 bg-blue-50 text-blue-700';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'bottleneck': return AlertTriangle;
      case 'delay': return Clock;
      case 'resource': return Users;
      case 'quality': return Target;
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : 
                           metric.trend === 'down' ? TrendingDown : null;
          
          return (
            <div key={metric.id} className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${metric.color}`} />
                {TrendIcon && (
                  <TrendIcon className={`w-4 h-4 ${
                    metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`} />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">
                  {metric.value}{metric.unit}
                </p>
                <p className="text-sm text-muted-foreground">{metric.name}</p>
                <p className={`text-xs ${
                  metric.change > 0 ? 'text-green-600' : 
                  metric.change < 0 ? 'text-red-600' : 'text-muted-foreground'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change} from last week
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts Dashboard */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-foreground">Production Alerts</h3>
          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
            {alerts.length} active
          </span>
        </div>
        
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <p>All systems operating normally</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const AlertIcon = getAlertIcon(alert.type);
              return (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <AlertIcon className="w-5 h-5 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      {alert.action && (
                        <p className="text-sm mt-1 opacity-75">
                          <strong>Recommended Action:</strong> {alert.action}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Stage Performance Analysis */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-foreground">Stage Performance Analysis</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stageAnalysis.map((stage) => (
            <div
              key={stage.name}
              className={`p-4 rounded-lg border-2 ${
                stage.isBottleneck 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-border bg-muted/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground">{stage.name}</h4>
                {stage.isBottleneck && (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Packages:</span>
                  <span className="font-medium">{stage.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Time:</span>
                  <span className="font-medium">{stage.avgTime}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Throughput:</span>
                  <span className="font-medium">{stage.throughput}/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Efficiency:</span>
                  <span className={`font-medium ${
                    stage.efficiency > 85 ? 'text-green-600' :
                    stage.efficiency < 70 ? 'text-red-600' : 'text-foreground'
                  }`}>
                    {stage.efficiency}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictive Insights */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-foreground">Predictive Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Capacity Forecast</h4>
            <p className="text-sm text-blue-700">
              Current capacity can handle {Math.floor(packages.length * 1.2)} packages. 
              Consider adding resources for peak demand.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Delivery Prediction</h4>
            <p className="text-sm text-green-700">
              94% of packages will meet delivery targets with current velocity. 
              Expedite 3 packages to achieve 100%.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Resource Optimization</h4>
            <p className="text-sm text-yellow-700">
              Reallocating 2 team members from Packaging to Fabrication 
              could improve overall throughput by 15%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}