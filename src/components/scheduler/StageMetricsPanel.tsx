import { TrendingUp, Clock, AlertTriangle, CheckCircle, Package as PackageIcon, Truck } from 'lucide-react';
import type { Package } from '@/store/db';

interface StageMetricsPanelProps {
  packages: Package[];
}

export function StageMetricsPanel({ packages }: StageMetricsPanelProps) {
  // Calculate metrics for each stage
  const getStageMetrics = () => {
    const stages = {
      fabrication: packages.filter(p => p.state === 'Fabrication' || p.state === 'InProduction'),
      qa: packages.filter(p => p.state === 'QA' || p.state === 'Inspection'),
      packaging: packages.filter(p => p.state === 'Packaging' || p.state === 'Kitting'),
      shipping: packages.filter(p => p.state === 'Shipping' || p.state === 'Shipped'),
    };

    return {
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
      case 'blue': return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
      case 'purple': return 'border-purple-500/30 bg-purple-500/10 text-purple-400';
      case 'green': return 'border-green-500/30 bg-green-500/10 text-green-400';
      case 'orange': return 'border-orange-500/30 bg-orange-500/10 text-orange-400';
      default: return 'border-border bg-card text-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metricCards.map((card) => (
        <div
          key={card.title}
          className={`
            border rounded-lg p-4 transition-all
            ${getColorClasses(card.color, card.bottleneck)}
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <card.icon className="w-5 h-5" />
              <h3 className="font-medium text-sm">{card.title}</h3>
            </div>
            {card.bottleneck && (
              <div title="Bottleneck detected">
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-75">Active</span>
              <span className="text-lg font-bold">{card.count}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-75 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Avg Time
              </span>
              <span className="text-sm font-medium">
                {card.avgTime.toFixed(1)}h
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-75 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Throughput
              </span>
              <span className="text-sm font-medium">
                {card.throughput}/day
              </span>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mt-3 pt-2 border-t border-current/20">
            <div className="text-xs font-medium">
              {card.bottleneck ? 'Bottleneck Alert' : 'Normal Flow'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}