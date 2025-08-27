interface CapacityMeterProps {
  plannedHours: number;
  availableHours: number;
  className?: string;
}

export function CapacityMeter({ plannedHours, availableHours, className = '' }: CapacityMeterProps) {
  const utilization = availableHours > 0 ? (plannedHours / availableHours) * 100 : 0;
  const isOverCapacity = utilization > 100;
  const isNearCapacity = utilization > 80;

  const barColor = isOverCapacity 
    ? 'bg-red-500' 
    : isNearCapacity 
    ? 'bg-amber-500' 
    : 'bg-emerald-500';

  const textColor = isOverCapacity 
    ? 'text-red-400' 
    : isNearCapacity 
    ? 'text-amber-400' 
    : 'text-emerald-400';

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex justify-between text-xs">
        <span className={textColor}>
          {plannedHours.toFixed(1)}h / {availableHours}h
        </span>
        <span className={textColor}>
          {Math.min(utilization, 100).toFixed(0)}%
        </span>
      </div>
      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${barColor}`}
          style={{ width: `${Math.min(utilization, 100)}%` }}
        />
        {isOverCapacity && (
          <div className="h-full bg-red-500/50 animate-pulse" />
        )}
      </div>
      {isOverCapacity && (
        <div className="text-xs text-red-400">
          Overbooked by {(plannedHours - availableHours).toFixed(1)}h
        </div>
      )}
    </div>
  );
}