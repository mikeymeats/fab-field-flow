import { useDrag } from 'react-dnd';
import { Clock, AlertTriangle, Package } from 'lucide-react';
import type { Package as PackageType } from '@/store/db';

interface PackagePipelineCardProps {
  package: PackageType;
  stage: string;
  isSelected?: boolean;
  onToggleSelection?: (packageId: string) => void;
  isCriticalPath?: boolean;
  cardSize: 'compact' | 'normal' | 'detailed';
}

export function PackagePipelineCard({ 
  package: pkg, 
  stage, 
  isSelected = false, 
  onToggleSelection,
  isCriticalPath = false,
  cardSize
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
    Planned: 'bg-muted text-muted-foreground',
    Submitted: 'bg-yellow-500/20 text-yellow-400',
    Approved: 'bg-blue-500/20 text-blue-400',
    Kitted: 'bg-cyan-500/20 text-cyan-400',
    InFabrication: 'bg-blue-600/20 text-blue-400',
    Fabrication: 'bg-blue-600/20 text-blue-400',
    InProduction: 'bg-orange-500/20 text-orange-400',
    Assembled: 'bg-indigo-500/20 text-indigo-400',
    QA: 'bg-purple-500/20 text-purple-400',
    Inspection: 'bg-purple-600/20 text-purple-400',
    ShopQAPassed: 'bg-green-600/20 text-green-400',
    Kitting: 'bg-teal-500/20 text-teal-400',
    Packaging: 'bg-green-500/20 text-green-400',
    ReadyToShip: 'bg-green-500/20 text-green-400',
    Staged: 'bg-emerald-500/20 text-emerald-400',
    Shipping: 'bg-orange-600/20 text-orange-400',
    Shipped: 'bg-emerald-500/20 text-emerald-400',
    Delivered: 'bg-emerald-700/20 text-emerald-400',
    OnHold: 'bg-red-500/20 text-red-400',
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

  // Render different card sizes
  if (cardSize === 'compact') {
    return (
      <div
        ref={drag}
        className={`
          bg-card border rounded p-2 cursor-move transition-all relative text-xs
          ${isDragging ? 'opacity-50 transform rotate-1' : 'hover:shadow-sm'}
          ${priorityColors[simulatedPriority] || 'border-border'}
          ${isSelected ? 'ring-1 ring-primary/50 bg-primary/5' : ''}
          ${isCriticalPath ? 'ring-1 ring-orange-500/50 bg-orange-50' : ''}
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
          <div className="absolute top-1 right-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelection(pkg.id)}
              className="w-3 h-3 rounded border-border"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        
        {/* Critical Path Indicator */}
        {isCriticalPath && (
          <div className="absolute top-1 left-1">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-xs text-foreground truncate">{pkg.id}</div>
            <div className="text-xs text-muted-foreground truncate">{pkg.level}-{pkg.zone}</div>
          </div>
          {simulatedPriority === 'High' && (
            <AlertTriangle className="w-3 h-3 text-destructive ml-1" />
          )}
        </div>
      </div>
    );
  }

  if (cardSize === 'detailed') {
    return (
      <div
        ref={drag}
        className={`
          bg-card border rounded-lg p-4 cursor-move transition-all relative
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
          <div className="absolute top-3 right-3">
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
          <div className="absolute top-3 left-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-medium text-sm text-foreground">{pkg.id}</div>
            <div className="text-xs mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[pkg.state as keyof typeof statusColors] || 'bg-muted text-muted-foreground'}`}>
                {pkg.state}
              </span>
            </div>
          </div>
          {simulatedPriority === 'High' && (
            <div className="flex items-center gap-1 text-destructive">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-xs font-medium">HIGH</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="text-sm text-foreground">
            <div className="font-medium">{pkg.name}</div>
            <div className="text-muted-foreground">
              Level {pkg.level} • Zone {pkg.zone}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{getTimeInStage()}h in stage</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              <span>{pkg.hangerIds.length} hangers</span>
            </div>
          </div>

          {isOverdue() && (
            <div className="text-xs text-destructive font-medium">
              ⚠ Overdue
            </div>
          )}
        </div>
      </div>
    );
  }

  // Normal size (default)
  return (
    <div
      ref={drag}
      className={`
        bg-card border rounded-lg p-3 cursor-move transition-all relative
        ${isDragging ? 'opacity-50 transform rotate-1' : 'hover:shadow-sm'}
        ${priorityColors[simulatedPriority] || 'border-border'}
        ${isOverdue() ? 'ring-1 ring-destructive/50' : ''}
        ${isSelected ? 'ring-1 ring-primary/50 bg-primary/5' : ''}
        ${isCriticalPath ? 'ring-1 ring-orange-500/50 bg-orange-50' : ''}
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
          <div className="text-xs mt-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[pkg.state as keyof typeof statusColors] || 'bg-muted text-muted-foreground'}`}>
              {pkg.state}
            </span>
          </div>
        </div>
        {simulatedPriority === 'High' && (
          <div className="flex items-center gap-1 text-destructive">
            <AlertTriangle className="w-3 h-3" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-sm text-foreground">
          <div className="font-medium truncate">{pkg.name}</div>
          <div className="text-muted-foreground text-xs">
            {pkg.level} • {pkg.zone}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{getTimeInStage()}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            <span>{pkg.hangerIds.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}