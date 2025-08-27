import { useDrop } from 'react-dnd';
import { Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import type { Package } from '@/store/db';
import { PackagePipelineCard } from './PackagePipelineCard';

interface PipelineStageProps {
  stage: 'fabrication' | 'qa' | 'packaging' | 'shipping';
  title: string;
  packages: Package[];
  metrics: {
    totalPackages: number;
    avgTimeInStage: number;
    bottleneck: boolean;
    throughput: number;
  };
  onMovePackage: (packageId: string, toStage: string) => void;
}

export function PipelineStage({ stage, title, packages, metrics, onMovePackage }: PipelineStageProps) {
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
    fabrication: 'border-blue-500/30 bg-blue-500/10',
    qa: 'border-purple-500/30 bg-purple-500/10',
    packaging: 'border-green-500/30 bg-green-500/10',
    shipping: 'border-orange-500/30 bg-orange-500/10',
  };

  const getStageIcon = () => {
    switch (stage) {
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
        min-w-80 border-2 border-dashed rounded-lg p-4 transition-colors
        ${isOver && canDrop ? stageColors[stage] : 'border-border bg-card/50'}
        ${metrics.bottleneck ? 'ring-2 ring-destructive/50' : ''}
      `}
    >
      {/* Stage Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getStageIcon()}</span>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{packages.length} packages</p>
          </div>
        </div>
        {metrics.bottleneck && (
          <div title="Bottleneck detected">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            Avg Time
          </div>
          <div className="text-sm font-medium text-foreground">
            {metrics.avgTimeInStage.toFixed(1)}h
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="w-3 h-3" />
            Throughput
          </div>
          <div className="text-sm font-medium text-foreground">
            {metrics.throughput}/day
          </div>
        </div>
      </div>

      {/* Packages List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {packages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-3xl mb-2">{getStageIcon()}</div>
            <p className="text-sm">No packages in {title.toLowerCase()}</p>
          </div>
        ) : (
          packages.map((pkg) => (
            <PackagePipelineCard
              key={pkg.id}
              package={pkg}
              stage={stage}
            />
          ))
        )}
      </div>
    </div>
  );
}