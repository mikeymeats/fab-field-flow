import { useState } from 'react'
import { Users, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { useDrop } from 'react-dnd'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CapacityMeter } from './CapacityMeter'
import type { Team, Assignment, Hanger, Package as PackageType } from '@/store/db'

interface CrewCardProps {
  team: Team
  assignments: Assignment[]
  hangers: Hanger[]
  onAssignPackage: (packageId: string, teamId: string) => void
}

export function CrewCard({ team, assignments, hangers, onAssignPackage }: CrewCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Calculate metrics
  const teamAssignments = assignments.filter(a => a.teamId === team.id && a.state !== 'Done')
  const dailyHours = team.dailyHours || (team.members?.length || 3) * 8
  const plannedHours = teamAssignments.reduce((total, assignment) => {
    const hanger = hangers.find(h => h.id === assignment.hangerId)
    return total + (hanger?.estHours || 2)
  }, 0)
  
  const utilization = dailyHours > 0 ? (plannedHours / dailyHours) * 100 : 0
  const isOverCapacity = utilization > 100
  const isNearCapacity = utilization > 80
  const nextAvailableHours = Math.max(0, dailyHours - plannedHours)

  // Drag and drop
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'package',
    drop: (item: { packageId: string; type: string }) => {
      if (item.type === 'package') {
        onAssignPackage(item.packageId, team.id)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const getStatusColor = () => {
    if (isOverCapacity) return 'hsl(var(--destructive))'
    if (isNearCapacity) return 'hsl(var(--status-warning))'
    return 'hsl(var(--status-success))'
  }

  const getStatusText = () => {
    if (isOverCapacity) return 'Over Capacity'
    if (isNearCapacity) return 'Near Capacity' 
    return 'Available'
  }

  return (
    <div
      ref={drop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`transition-all duration-300 ${
        isOver && canDrop ? 'transform scale-105 ring-2 ring-primary/50' : ''
      } ${isHovered ? 'transform scale-102' : ''}`}
    >
      <Card className={`relative overflow-hidden ${
        isOver && canDrop ? 'border-primary/50 bg-accent/10' : ''
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5" />
              {team.name}
            </CardTitle>
            <Badge 
              variant="outline"
              style={{ 
                borderColor: getStatusColor(),
                color: getStatusColor()
              }}
            >
              {getStatusText()}
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {team.members?.length || 3} members • {team.stations.join(', ')}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Capacity Meter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Daily Capacity</span>
              <span className="text-xs text-muted-foreground">
                {plannedHours.toFixed(1)}h / {dailyHours}h
              </span>
            </div>
            <CapacityMeter 
              plannedHours={plannedHours}
              availableHours={dailyHours}
            />
          </div>

          {/* Assignments Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Current Jobs</span>
            </div>
            <span className="font-medium">{teamAssignments.length}</span>
          </div>

          {/* Next Available */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOverCapacity ? (
                <AlertTriangle className="w-4 h-4 text-destructive" />
              ) : (
                <CheckCircle className="w-4 h-4 text-status-success" />
              )}
              <span className="text-sm">
                {isOverCapacity ? 'Overtime Needed' : 'Available Hours'}
              </span>
            </div>
            <span className={`font-medium ${
              isOverCapacity ? 'text-destructive' : 'text-status-success'
            }`}>
              {isOverCapacity 
                ? `+${Math.abs(nextAvailableHours).toFixed(1)}h OT`
                : `${nextAvailableHours.toFixed(1)}h`
              }
            </span>
          </div>

          {/* Drop Zone Indicator */}
          {isOver && canDrop && (
            <div className="absolute inset-0 bg-primary/20 border-2 border-primary border-dashed rounded-lg flex items-center justify-center">
              <div className="text-primary font-medium">
                Assign Package to {team.name}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}