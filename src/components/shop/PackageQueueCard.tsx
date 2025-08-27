import { useDrag } from 'react-dnd'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Package, AlertCircle } from 'lucide-react'
import type { Package as PackageType } from '@/store/db'

interface PackageQueueCardProps {
  pkg: PackageType
  estimatedHours: number
  hasShortage: boolean
  onClick: () => void
}

export function PackageQueueCard({ pkg, estimatedHours, hasShortage, onClick }: PackageQueueCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'package',
    item: { packageId: pkg.id, type: 'package' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const getPriorityColor = () => {
    // Use assignment priority since Package doesn't have priority
    return 'hsl(var(--muted-foreground))'  // Default neutral color
  }

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${
        isDragging ? 'opacity-50 transform rotate-3' : 'hover:transform hover:scale-105'
      }`}
    >
      <Card className={`relative overflow-hidden border-l-4 ${
        isDragging ? 'shadow-lg' : 'hover:shadow-md'
      }`}
      style={{ borderLeftColor: getPriorityColor() }}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm">{pkg.name}</span>
              </div>
              <Badge 
                variant="outline"
                style={{ 
                  borderColor: getPriorityColor(),
                  color: getPriorityColor() 
                }}
              >
                {pkg.state}
              </Badge>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>Level {pkg.level} / Zone {pkg.zone}</span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span>{estimatedHours.toFixed(1)}h est.</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-3 h-3 text-muted-foreground" />
                <span>{pkg.hangerIds.length} items</span>
              </div>
            </div>

            {/* Shortage Alert */}
            {hasShortage && (
              <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded">
                <AlertCircle className="w-3 h-3" />
                <span>Inventory shortage detected</span>
              </div>
            )}

            {/* Drag Hint */}
            <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/30">
              Drag to assign to crew
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}