import { TrendingUp, Clock, AlertTriangle, CheckCircle, Package as PackageIcon, Truck } from 'lucide-react';
import type { Package } from '@/store/db';

interface StageMetricsPanelProps {
  packages: Package[];
}

export function StageMetricsPanel({ packages }: StageMetricsPanelProps) {
  // Calculate metrics for each stage - Enhanced 5-stage pipeline
  const getStageMetrics = () => {
    const stages = {
      approved: packages.filter(p => p.state === 'Submitted' || p.state === 'Approved' || p.state === 'Planned'),
      fabrication: packages.filter(p => p.state === 'Fabrication' || p.state === 'InProduction' || p.state === 'InFabrication' || p.state === 'Kitted'),
      qa: packages.filter(p => p.state === 'QA' || p.state === 'Inspection' || p.state === 'Assembled' || p.state === 'ShopQAPassed'),
      packaging: packages.filter(p => p.state === 'Packaging' || p.state === 'Kitting' || p.state === 'ReadyToShip' || p.state === 'Staged'),
      shipping: packages.filter(p => p.state === 'Shipping' || p.state === 'Shipped' || p.state === 'Delivered'),
    };

    return {
      approved: {
        count: stages.approved.length,
        avgTime: calculateAvgTimeInStage(stages.approved),
        bottleneck: stages.approved.length > 15,
        throughput: calculateThroughput(stages.approved),
      },
      fabrication: {
        count: stages.fabrication.length,
        avgTime: calculateAvgTimeInStage(stages.fabrication),
        bottleneck: stages.fabrication.length > 10,
        throughput: calculateThroughput(stages.fabrication),
      },
      qa: {
        count: stages.qa.length,
        avgTime: calculateAvgTimeInStage(stages.qa),
        bottleneck: stages.qa.length > 5,
        throughput: calculateThroughput(stages.qa),
      },
      packaging: {
        count: stages.packaging.length,
        avgTime: calculateAvgTimeInStage(stages.packaging),
        bottleneck: stages.packaging.length > 8,
        throughput: calculateThroughput(stages.packaging),
      },
      shipping: {
        count: stages.shipping.length,
        avgTime: calculateAvgTimeInStage(stages.shipping),
        bottleneck: false, // Shipping rarely bottlenecks
        throughput: calculateThroughput(stages.shipping),
      },
    };
  };

  const calculateAvgTimeInStage = (stagePackages: Package[]) => {
    if (stagePackages.length === 0) return 0;
    // Simplified calculation for demo
    return Math.floor(Math.random() * 48) + 2; // 2-50 hours
  };

  const calculateThroughput = (stagePackages: Package[]) => {
    // Simulate daily throughput based on current load
    return Math.max(1, Math.floor(stagePackages.length / 2));
  };

  const metrics = getStageMetrics();

  const metricCards = [
    {
      title: 'Ready to Start',
      icon: Clock,
      count: metrics.approved.count,
      avgTime: metrics.approved.avgTime,
      throughput: metrics.approved.throughput,
      bottleneck: metrics.approved.bottleneck,
      color: 'gray',
    },
    {
      title: 'Fabrication',
      icon: PackageIcon,
      count: metrics.fabrication.count,
      avgTime: metrics.fabrication.avgTime,
      throughput: metrics.fabrication.throughput,
      bottleneck: metrics.fabrication.bottleneck,
      color: 'blue',
    },
    {
      title: 'QA/Inspection',
      icon: CheckCircle,
      count: metrics.qa.count,
      avgTime: metrics.qa.avgTime,
      throughput: metrics.qa.throughput,
      bottleneck: metrics.qa.bottleneck,
      color: 'purple',
    },
    {
      title: 'Packaging',
      icon: PackageIcon,
      count: metrics.packaging.count,
      avgTime: metrics.packaging.avgTime,
      throughput: metrics.packaging.throughput,
      bottleneck: metrics.packaging.bottleneck,
      color: 'green',
    },
    {
      title: 'Shipping',
      icon: Truck,
      count: metrics.shipping.count,
      avgTime: metrics.shipping.avgTime,
      throughput: metrics.shipping.throughput,
      bottleneck: metrics.shipping.bottleneck,
      color: 'orange',
    },
  ];

  const getColorClasses = (color: string, bottleneck: boolean) => {
    if (bottleneck) {
      return 'border-destructive/50 bg-destructive/10 text-destructive';
    }

    switch (color) {
      case 'gray': return 'border-muted-foreground/30 bg-muted/10 text-muted-foreground';
      case 'blue': return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
      case 'purple': return 'border-purple-500/30 bg-purple-500/10 text-purple-400';
      case 'green': return 'border-green-500/30 bg-green-500/10 text-green-400';
      case 'orange': return 'border-orange-500/30 bg-orange-500/10 text-orange-400';
      default: return 'border-border bg-card text-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
      {metricCards.map((card) => (
          <div
            key={card.title}
            className={`
              border rounded-lg p-3 transition-all
              ${getColorClasses(card.color, card.bottleneck)}
            `}
          >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <card.icon className="w-4 h-4" />
              <h3 className="font-medium text-xs">{card.title}</h3>
            </div>
            {card.bottleneck && (
              <div title="Bottleneck detected">
                <AlertTriangle className="w-3 h-3 text-destructive" />
              </div>
            )}
          </div>

          {/* Metrics - Compact */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-75">Active</span>
              <span className="text-lg font-bold">{card.count}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="opacity-75">⏱ {card.avgTime.toFixed(1)}h</div>
              </div>
              <div className="text-center">
                <div className="opacity-75">📈 {card.throughput}/day</div>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mt-2 pt-1 border-t border-current/20">
            <div className="text-xs">
              {card.bottleneck ? '⚠ Bottleneck' : '✓ Normal'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}