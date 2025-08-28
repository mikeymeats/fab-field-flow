import { useDrag } from 'react-dnd';
import { Clock, AlertTriangle, Package } from 'lucide-react';
import type { Package as PackageType } from '@/store/db';

interface PackagePipelineCardProps {
  package: PackageType;
  stage: string;
  isSelected?: boolean;
  onToggleSelection?: (packageId: string) => void;
  isCriticalPath?: boolean;
}

export function PackagePipelineCard({ 
  package: pkg, 
  stage, 
  isSelected = false, 
  onToggleSelection,
  isCriticalPath = false 
}: PackagePipelineCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'package',
    item: { id: pkg.id, stage },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const priorityColors = {
    High: 'border-destructive/50 bg-destructive/10',
    Med: 'border-orange-500/50 bg-orange-500/10',
    Low: 'border-blue-500/50 bg-blue-500/10',
  };

  const statusColors = {
    Draft: 'bg-muted text-muted-foreground',
    Approved: 'bg-blue-500/20 text-blue-400',
    InProduction: 'bg-orange-500/20 text-orange-400',
    QA: 'bg-purple-500/20 text-purple-400',
    ReadyToShip: 'bg-green-500/20 text-green-400',
    Shipped: 'bg-emerald-500/20 text-emerald-400',
  };

  const getTimeInStage = () => {
    // Simplified - using a random time for demo
    return Math.floor(Math.random() * 24) + 1;
  };

  const isOverdue = () => {
    // Simplified - random overdue status for demo
    return Math.random() < 0.1;
  };

  const simulatedPriority = Math.random() < 0.2 ? 'High' : Math.random() < 0.5 ? 'Med' : 'Low';

  return (
    <div
      ref={drag}
      className={`
        bg-card border rounded-lg p-3 cursor-move transition-all relative
        ${isDragging ? 'opacity-50 transform rotate-2' : 'hover:shadow-md'}
        ${priorityColors[simulatedPriority] || 'border-border'}
        ${isOverdue() ? 'ring-2 ring-destructive/50' : ''}
        ${isSelected ? 'ring-2 ring-primary/50 bg-primary/5' : ''}
        ${isCriticalPath ? 'ring-2 ring-orange-500/50 bg-orange-50' : ''}
      `}
      onClick={(e) => {
        if (onToggleSelection) {
          e.stopPropagation();
          onToggleSelection(pkg.id);
        }
      }}
    >
      {/* Selection Checkbox */}
      {onToggleSelection && (
        <div className="absolute top-2 right-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelection(pkg.id)}
            className="w-4 h-4 rounded border-border"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Critical Path Indicator */}
      {isCriticalPath && (
        <div className="absolute top-2 left-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-medium text-sm text-foreground">{pkg.id}</div>
          <div className="text-xs text-muted-foreground">
            Status: {pkg.state}
          </div>
        </div>
        {simulatedPriority === 'High' && (
          <div className="flex items-center gap-1 text-destructive">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-xs font-medium">HIGH</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-sm text-foreground">
          <div className="font-medium">{pkg.name}</div>
          <div className="text-muted-foreground">
            {pkg.level} • {pkg.zone}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{getTimeInStage()}h in stage</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            <span>{pkg.hangerIds.length} hangers</span>
          </div>
        </div>
      </div>
    </div>
  );
}