import { useDrag } from 'react-dnd';
import { Clock, AlertCircle, Zap, User, Calendar } from 'lucide-react';
import type { Package } from '@/store/db';

interface PackagePipelineCardProps {
  package: Package;
  stage: string;
}

export function PackagePipelineCard({ package: pkg, stage }: PackagePipelineCardProps) {
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

  return (
    <div
      ref={drag}
      className={`
        border rounded-lg p-3 cursor-move transition-all hover:shadow-md
        ${isDragging ? 'opacity-50' : ''}
        ${Math.random() < 0.2 ? priorityColors.High : 'border-border bg-card'}
        ${isOverdue() ? 'ring-2 ring-destructive/50' : ''}
        ${Math.random() < 0.1 ? 'ring-2 ring-primary/50' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground">{pkg.id}</span>
          {Math.random() < 0.1 && <Zap className="w-3 h-3 text-primary" />}
          {isOverdue() && <AlertCircle className="w-3 h-3 text-destructive" />}
        </div>
        <span className={`text-xs px-2 py-1 rounded ${statusColors[pkg.state as keyof typeof statusColors] || statusColors.Draft}`}>
          {pkg.state}
        </span>
      </div>

      {/* Package Info */}
      <div className="mb-3">
        <div className="text-sm font-medium text-foreground mb-1">{pkg.name}</div>
        <div className="text-xs text-muted-foreground">
          {pkg.level && `Level: ${pkg.level}`}
          {pkg.zone && ` • Zone: ${pkg.zone}`}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{getTimeInStage()}h in stage</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <User className="w-3 h-3" />
          <span>{pkg.hangerIds.length} hangers</span>
        </div>
      </div>

      {/* Priority Badge */}
      {Math.random() < 0.3 && (
        <div className="mt-2">
          <span className="text-xs px-2 py-1 rounded border font-medium">
            High Priority
          </span>
        </div>
      )}
    </div>
  );
}