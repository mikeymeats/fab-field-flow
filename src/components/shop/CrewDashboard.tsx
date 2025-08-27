import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CrewCard } from '@/components/scheduler/CrewCard'
import { Users, TrendingUp, AlertTriangle, Clock } from 'lucide-react'
import type { Team, Assignment, Hanger } from '@/store/db'

interface CrewDashboardProps {
  teams: Team[]
  assignments: Assignment[]
  hangers: Hanger[]
  onAssignPackage: (packageId: string, teamId: string) => void
}

export function CrewDashboard({ teams, assignments, hangers, onAssignPackage }: CrewDashboardProps) {
  // Calculate dashboard metrics
  const totalCapacity = teams.reduce((total, team) => 
    total + (team.dailyHours || (team.members?.length || 3) * 8), 0
  )
  
  const totalPlanned = assignments
    .filter(a => a.state !== 'Done')
    .reduce((total, assignment) => {
      const hanger = hangers.find(h => h.id === assignment.hangerId)
      return total + (hanger?.estHours || 2)
    }, 0)

  const overCapacityTeams = teams.filter(team => {
    const teamAssignments = assignments.filter(a => a.teamId === team.id && a.state !== 'Done')
    const dailyHours = team.dailyHours || (team.members?.length || 3) * 8
    const plannedHours = teamAssignments.reduce((total, assignment) => {
      const hanger = hangers.find(h => h.id === assignment.hangerId)
      return total + (hanger?.estHours || 2)
    }, 0)
    return plannedHours > dailyHours
  })

  const averageUtilization = totalCapacity > 0 ? (totalPlanned / totalCapacity) * 100 : 0

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{teams.length}</div>
                  <div className="text-sm text-muted-foreground">Active Crews</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{averageUtilization.toFixed(0)}%</div>
                  <div className="text-sm text-muted-foreground">Avg Utilization</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{overCapacityTeams.length}</div>
                  <div className="text-sm text-muted-foreground">Over Capacity</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted/10 rounded-lg">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalPlanned.toFixed(0)}h</div>
                  <div className="text-sm text-muted-foreground">Total Planned</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Crew Cards Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Crew Capacity & Assignments
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Drag packages from the queue to assign them to crews
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {teams.map(team => (
                <CrewCard
                  key={team.id}
                  team={team}
                  assignments={assignments}
                  hangers={hangers}
                  onAssignPackage={onAssignPackage}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  )
}