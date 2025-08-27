import { useMemo, useState } from 'react'
import { useDB } from '@/store/db'
import { 
  Activity, 
  Users, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  AlertTriangle,
  CheckCircle2,
  Wrench,
  BarChart3,
  PieChart,
  Settings
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Station = {
  id: string
  name: string
  type: 'RodCut' | 'UnistrutCut' | 'Assembly' | 'ShopQA'
  status: 'Running' | 'Idle' | 'Maintenance' | 'Down'
  efficiency: number
  currentJob?: string
  targetRate: number // pieces per hour
  actualRate: number
  capacity: number
  utilization: number
  lastMaintenance: string
  nextMaintenance: string
}

export function ProductionDashboard() {
  const { teams, assignments, scopedPackages, scopedHangers, exceptions } = useDB()
  
  // Mock station data - in real app this would come from equipment sensors/PLCs
  const stations: Station[] = [
    {
      id: 'RC-01',
      name: 'Rod Cutting Station 1',
      type: 'RodCut',
      status: 'Running',
      efficiency: 87,
      currentJob: 'PKG-001',
      targetRate: 45,
      actualRate: 39,
      capacity: 50,
      utilization: 78,
      lastMaintenance: '2025-01-20',
      nextMaintenance: '2025-02-03'
    },
    {
      id: 'RC-02', 
      name: 'Rod Cutting Station 2',
      type: 'RodCut',
      status: 'Maintenance',
      efficiency: 0,
      targetRate: 45,
      actualRate: 0,
      capacity: 50,
      utilization: 0,
      lastMaintenance: '2025-01-27',
      nextMaintenance: '2025-01-28'
    },
    {
      id: 'UC-01',
      name: 'Unistrut Cutting Station',
      type: 'UnistrutCut', 
      status: 'Running',
      efficiency: 94,
      currentJob: 'PKG-003',
      targetRate: 35,
      actualRate: 33,
      capacity: 40,
      utilization: 82,
      lastMaintenance: '2025-01-18',
      nextMaintenance: '2025-02-15'
    },
    {
      id: 'AS-01',
      name: 'Assembly Station Alpha',
      type: 'Assembly',
      status: 'Running',
      efficiency: 76,
      currentJob: 'PKG-001',
      targetRate: 12,
      actualRate: 9,
      capacity: 15,
      utilization: 60,
      lastMaintenance: '2025-01-22',
      nextMaintenance: '2025-02-05'
    },
    {
      id: 'AS-02',
      name: 'Assembly Station Beta', 
      type: 'Assembly',
      status: 'Idle',
      efficiency: 0,
      targetRate: 12,
      actualRate: 0,
      capacity: 15,
      utilization: 0,
      lastMaintenance: '2025-01-25',
      nextMaintenance: '2025-02-08'
    },
    {
      id: 'QA-01',
      name: 'Quality Control Station',
      type: 'ShopQA',
      status: 'Running',
      efficiency: 91,
      currentJob: 'PKG-005',
      targetRate: 20,
      actualRate: 18,
      capacity: 25,
      utilization: 72,
      lastMaintenance: '2025-01-19',
      nextMaintenance: '2025-02-02'
    }
  ]

  // Calculate production metrics
  const metrics = useMemo(() => {
    const runningStations = stations.filter(s => s.status === 'Running')
    const totalCapacity = stations.reduce((sum, s) => sum + s.capacity, 0)
    const totalUtilization = stations.reduce((sum, s) => sum + s.utilization, 0) / stations.length
    const avgEfficiency = runningStations.length > 0 
      ? runningStations.reduce((sum, s) => sum + s.efficiency, 0) / runningStations.length 
      : 0

    // Team metrics
    const teamMetrics = teams.map(team => {
      const teamAssignments = assignments.filter(a => a.teamId === team.id)
      const inProgress = teamAssignments.filter(a => a.state === 'InProgress').length
      const queued = teamAssignments.filter(a => a.state === 'Queued').length
      const completed = teamAssignments.filter(a => a.state === 'Done').length
      
      return {
        ...team,
        inProgress,
        queued,
        completed,
        totalHours: team.members.length * (team.dailyHours || 8),
        utilization: Math.min(100, ((inProgress * 4) / (team.members.length * 8)) * 100) // rough calc
      }
    })

    // Identify bottlenecks
    const bottlenecks = stations
      .filter(s => s.utilization > 85 || s.efficiency < 80)
      .sort((a, b) => (b.utilization - b.efficiency) - (a.utilization - a.efficiency))

    return {
      totalCapacity,
      totalUtilization,
      avgEfficiency,
      runningStations: runningStations.length,
      totalStations: stations.length,
      teamMetrics,
      bottlenecks: bottlenecks.slice(0, 3)
    }
  }, [teams, assignments, stations])

  const getStatusColor = (status: Station['status']) => {
    switch(status) {
      case 'Running': return 'text-emerald-400'
      case 'Idle': return 'text-amber-400'  
      case 'Maintenance': return 'text-blue-400'
      case 'Down': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: Station['status']) => {
    switch(status) {
      case 'Running': return <Activity className="w-4 h-4" />
      case 'Idle': return <Clock className="w-4 h-4" />
      case 'Maintenance': return <Wrench className="w-4 h-4" />
      case 'Down': return <AlertTriangle className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-400">{metrics.avgEfficiency.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Overall Efficiency</div>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <Progress value={metrics.avgEfficiency} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400">{metrics.totalUtilization.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Capacity Utilization</div>
              </div>
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <Progress value={metrics.totalUtilization} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-400">{metrics.runningStations}</div>
                <div className="text-sm text-muted-foreground">Stations Online</div>
              </div>
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {metrics.totalStations - metrics.runningStations} offline
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-amber-400">{metrics.bottlenecks.length}</div>
                <div className="text-sm text-muted-foreground">Active Bottlenecks</div>
              </div>
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Station Status Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Equipment Status
          </CardTitle>
          <CardDescription>Real-time monitoring of all production stations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {stations.map(station => (
              <Card key={station.id} className={`border ${
                station.status === 'Down' ? 'border-red-500/50' :
                station.status === 'Maintenance' ? 'border-blue-500/50' :
                station.status === 'Idle' ? 'border-amber-500/50' :
                'border-emerald-500/50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-sm">{station.name}</h4>
                      <p className="text-xs text-muted-foreground">{station.id}</p>
                    </div>
                    <div className={`flex items-center gap-1 ${getStatusColor(station.status)}`}>
                      {getStatusIcon(station.status)}
                      <span className="text-xs font-medium">{station.status}</span>
                    </div>
                  </div>

                  {station.currentJob && (
                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs">
                        Current: {station.currentJob}
                      </Badge>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Efficiency</span>
                      <span className={station.efficiency >= 85 ? 'text-emerald-400' : 
                                     station.efficiency >= 70 ? 'text-amber-400' : 'text-red-400'}>
                        {station.efficiency}%
                      </span>
                    </div>
                    <Progress value={station.efficiency} className="h-1" />

                    <div className="flex justify-between text-xs">
                      <span>Utilization</span>
                      <span>{station.utilization}%</span>
                    </div>
                    <Progress value={station.utilization} className="h-1" />

                    <div className="flex justify-between text-xs pt-2">
                      <span>Rate: {station.actualRate}/{station.targetRate}/hr</span>
                      <span className="text-muted-foreground">Cap: {station.capacity}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Performance
          </CardTitle>
          <CardDescription>Current workload and productivity by team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {metrics.teamMetrics.map(team => (
              <Card key={team.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{team.name}</h4>
                    <Badge variant={team.utilization > 90 ? 'destructive' : 
                                   team.utilization > 75 ? 'default' : 'secondary'}>
                      {team.utilization.toFixed(0)}% busy
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Members:</span>
                      <span>{team.members.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">In Progress:</span>
                      <span className="text-amber-400">{team.inProgress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Queued:</span>
                      <span className="text-blue-400">{team.queued}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completed:</span>
                      <span className="text-emerald-400">{team.completed}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Capacity Utilization</span>
                      <span>{team.utilization.toFixed(0)}%</span>
                    </div>
                    <Progress value={team.utilization} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottlenecks & Alerts */}
      {metrics.bottlenecks.length > 0 && (
        <Card className="border-amber-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              Bottlenecks & Performance Alerts
            </CardTitle>
            <CardDescription>Stations requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.bottlenecks.map(station => (
                <div key={station.id} className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  <div>
                    <h4 className="font-semibold text-sm">{station.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {station.utilization > 85 && station.efficiency < 80 
                        ? 'High utilization with low efficiency - investigate equipment' :
                        station.utilization > 85 
                        ? 'Over-utilized - consider load balancing' :
                        'Low efficiency - maintenance may be needed'
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Utilization</div>
                      <div className="font-semibold">{station.utilization}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Efficiency</div>
                      <div className="font-semibold">{station.efficiency}%</div>
                    </div>
                    <Button size="sm" variant="outline">
                      Investigate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}