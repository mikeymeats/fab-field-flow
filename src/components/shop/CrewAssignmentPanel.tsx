import { Users, Clock, Wrench } from 'lucide-react'
import type { Package as PackageType, Team } from '@/store/db'

interface CrewAssignmentPanelProps {
  pkg: PackageType | null
  teams: Team[]
  onAssignToCrew: (pkg: PackageType, teamId: string) => void
}

export function CrewAssignmentPanel({ pkg, teams, onAssignToCrew }: CrewAssignmentPanelProps) {
  if (!pkg) {
    return (
      <div className="border border-border rounded-xl bg-card">
        <div className="p-8 text-center text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Package Selected</h3>
          <p className="text-sm">Select an approved package to assign to a crew.</p>
        </div>
      </div>
    )
  }

  // Only show if package is in the right state for crew assignment
  const canAssign = ['ApprovedForFab', 'Kitted'].includes(pkg.state)

  if (!canAssign) {
    return (
      <div className="border border-border rounded-xl bg-card">
        <div className="p-8 text-center text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Not Ready for Assignment</h3>
          <p className="text-sm">
            Package must be approved and have inventory reserved before crew assignment.
          </p>
          <div className="mt-4 p-3 bg-muted/30 border border-border rounded-lg text-xs">
            Current Status: <span className="font-medium">{pkg.state}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Package Info */}
      <div className="border border-border rounded-xl bg-card">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Ready for Assignment
          </h3>
        </div>
        
        <div className="p-4">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Package:</span>
              <span className="ml-2 font-medium">{pkg.name}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Location:</span>
              <span className="ml-2">Level {pkg.level} / Zone {pkg.zone}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Hangers:</span>
              <span className="ml-2">{pkg.hangerIds.length} items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Teams */}
      <div className="border border-border rounded-xl bg-card">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Available Crews</h3>
        </div>
        
        <div className="p-4 space-y-3">
          {teams.map(team => {
            const isAvailable = true // For now, assume all teams are available
            const workloadLevel = Math.random() > 0.5 ? 'Low' : Math.random() > 0.3 ? 'Medium' : 'High'
            
            return (
              <button
                key={team.id}
                onClick={() => onAssignToCrew(pkg, team.id)}
                className={`w-full p-4 border rounded-lg transition-colors text-left ${
                  isAvailable 
                    ? 'border-border hover:border-primary/40 hover:bg-accent/20' 
                    : 'border-border/50 bg-muted/30 cursor-not-allowed'
                }`}
                disabled={!isAvailable}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{team.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {team.members?.length || 3} members • {team.stations.join(', ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      workloadLevel === 'Low' ? 'bg-emerald-500/20 text-emerald-300' :
                      workloadLevel === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {workloadLevel} Workload
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-border/30 text-xs text-muted-foreground">
                  Click to assign this package to {team.name}
                </div>
              </button>
            )
          })}
          
          {teams.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">No crews available</div>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Info */}
      <div className="border border-border rounded-xl bg-card">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Assignment Details</h3>
        </div>
        
        <div className="p-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <div>Assigning will create individual work assignments for each hanger</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <div>The crew will receive the assignments in their work queue</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <div>You can monitor progress in the Scheduler</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}