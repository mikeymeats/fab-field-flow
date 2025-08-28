import { useDrop } from 'react-dnd';
import { Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import type { Package } from '@/store/db';
import { PackagePipelineCard } from './PackagePipelineCard';

interface PipelineStageProps {
  stage: 'approved' | 'fabrication' | 'qa' | 'packaging' | 'shipping';
  title: string;
  packages: Package[];
  metrics: {
    totalPackages: number;
    avgTimeInStage: number;
    bottleneck: boolean;
    throughput: number;
  };
  onMovePackage: (packageId: string, toStage: string) => void;
  selectedPackages: string[];
  onToggleSelection: (packageId: string) => void;
  showCriticalPath: boolean;
  cardSize: 'compact' | 'normal' | 'detailed';
}

export function PipelineStage({ 
  stage, 
  title, 
  packages, 
  metrics, 
  onMovePackage, 
  selectedPackages, 
  onToggleSelection, 
  showCriticalPath,
  cardSize
}: PipelineStageProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'package',
    drop: (item: { id: string; stage: string }) => {
      if (item.stage !== stage) {
        onMovePackage(item.id, stage);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const stageColors = {
    approved: 'border-muted-foreground/30 bg-muted/10',
    fabrication: 'border-blue-500/30 bg-blue-500/10',
    qa: 'border-purple-500/30 bg-purple-500/10',
    packaging: 'border-green-500/30 bg-green-500/10',
    shipping: 'border-orange-500/30 bg-orange-500/10',
  };

  const getStageIcon = () => {
    switch (stage) {
      case 'approved': return '✅';
      case 'fabrication': return '🔧';
      case 'qa': return '🔍';
      case 'packaging': return '📦';
      case 'shipping': return '🚚';
      default: return '📋';
    }
  };

  return (
    <div
      ref={drop}
      className={`
        min-w-0 flex-1 border-2 border-dashed rounded-lg p-3 transition-all
        ${isOver && canDrop ? stageColors[stage] : 'border-border bg-card/30'}
        ${metrics.bottleneck ? 'ring-1 ring-destructive/50' : ''}
      `}
    >
      {/* Stage Header - Compact */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStageIcon()}</span>
          <div>
            <h3 className="font-medium text-sm text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{packages.length} items</p>
          </div>
        </div>
        {metrics.bottleneck && (
          <div title="Bottleneck detected">
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
        )}
      </div>

      {/* Compact Metrics Row */}
      <div className="grid grid-cols-2 gap-2 mb-3 p-2 bg-muted/30 rounded text-xs">
        <div className="text-center">
          <div className="text-muted-foreground">⏱ {metrics.avgTimeInStage.toFixed(1)}h</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground">📈 {metrics.throughput}/day</div>
        </div>
      </div>

      {/* Packages List - Scrollable */}
      <div 
        className={`
          space-y-2 overflow-y-auto
          ${cardSize === 'compact' ? 'max-h-60' : cardSize === 'normal' ? 'max-h-80' : 'max-h-96'}
        `}
      >
        {packages.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <div className="text-2xl mb-1">{getStageIcon()}</div>
            <p className="text-xs">Empty</p>
          </div>
        ) : (
          packages.map((pkg) => {
            const isSelected = selectedPackages.includes(pkg.id);
            const isCriticalPath = showCriticalPath && Math.random() < 0.3; // Mock critical path logic
            
            return (
              <PackagePipelineCard
                key={pkg.id}
                package={pkg}
                stage={stage}
                isSelected={isSelected}
                onToggleSelection={onToggleSelection}
                isCriticalPath={isCriticalPath}
                cardSize={cardSize}
              />
            );
          })
        )}
      </div>
    </div>
  );
}