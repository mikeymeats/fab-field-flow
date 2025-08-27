import { useState, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LayoutGrid, BarChart3, Package, TrendingUp } from 'lucide-react';
import { useDB } from '@/store/db';
import { PipelineStage } from '@/components/scheduler/PipelineStage';
import { ProductionTimeline } from '@/components/scheduler/ProductionTimeline';
import { StageMetricsPanel } from '@/components/scheduler/StageMetricsPanel';

type ViewMode = 'pipeline' | 'timeline';

export default function Scheduler() {
  const {
    teams,
    scopedPackages,
    scopedAssignments,
    ensureTeamSeeds,
    advancePackage,
  } = useDB();

  const [viewMode, setViewMode] = useState<ViewMode>('pipeline');
  const [filters, setFilters] = useState({
    search: '',
    priorities: [] as string[],
    showBottlenecksOnly: false,
  });

  // Ensure teams exist
  ensureTeamSeeds();

  const packages = scopedPackages();
  const assignments = scopedAssignments();

  // Filter packages based on current filters
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          pkg.id.toLowerCase().includes(searchLower) ||
          pkg.name.toLowerCase().includes(searchLower) ||
          (pkg.level && pkg.level.toLowerCase().includes(searchLower)) ||
          (pkg.zone && pkg.zone.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Priority filter - simplified since Package doesn't have priority
      // if (filters.priorities.length > 0) {
      //   // Could filter by some other criteria
      // }

      return true;
    });
  }, [packages, filters]);

  // Group packages by production stage
  const packagesByStage = useMemo(() => {
    const stages = {
      fabrication: filteredPackages.filter(p => p.state === 'Fabrication' || p.state === 'InProduction'),
      qa: filteredPackages.filter(p => p.state === 'QA' || p.state === 'Inspection'),
      packaging: filteredPackages.filter(p => p.state === 'Packaging' || p.state === 'Kitting'),
      shipping: filteredPackages.filter(p => p.state === 'Shipping' || p.state === 'Shipped'),
    };

    return stages;
  }, [filteredPackages]);

  // Calculate stage metrics
  const stageMetrics = useMemo(() => {
    const calculateMetrics = (stagePackages: typeof packages) => ({
      totalPackages: stagePackages.length,
      avgTimeInStage: stagePackages.length > 0 ? 
      stagePackages.reduce((sum, pkg) => {
        // Simplified calculation for demo
        return sum + Math.floor(Math.random() * 24) + 1;
      }, 0) / stagePackages.length : 0,
      bottleneck: stagePackages.length > 8, // Configurable threshold
      throughput: Math.max(1, Math.floor(stagePackages.length / 2)),
    });

    return {
      fabrication: calculateMetrics(packagesByStage.fabrication),
      qa: calculateMetrics(packagesByStage.qa),
      packaging: calculateMetrics(packagesByStage.packaging),
      shipping: calculateMetrics(packagesByStage.shipping),
    };
  }, [packagesByStage]);

  const handleMovePackage = (packageId: string, toStage: string) => {
    const stateMapping = {
      fabrication: 'Fabrication' as const,
      qa: 'QA' as const,
      packaging: 'Packaging' as const,
      shipping: 'Shipped' as const,
    };

    const newState = stateMapping[toStage as keyof typeof stateMapping];
    if (newState) {
      // For now, just simulate the move by updating the package state
      // In a real app, this would call a store action
      console.log(`Moving package ${packageId} to ${newState}`);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              Production Control
            </h1>
            <p className="text-muted-foreground mt-1">
              Master dashboard for tracking packages through fabrication, QA, packaging, and shipping
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${viewMode === 'pipeline' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              <LayoutGrid className="w-4 h-4" />
              Pipeline View
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${viewMode === 'timeline' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              <BarChart3 className="w-4 h-4" />
              Timeline View
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search packages..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-3 py-2 bg-background border rounded-lg text-sm"
              />
            </div>
            <button
              onClick={() => setFilters({ ...filters, showBottlenecksOnly: !filters.showBottlenecksOnly })}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${filters.showBottlenecksOnly 
                  ? 'bg-destructive text-destructive-foreground' 
                  : 'bg-background border hover:bg-muted'
                }
              `}
            >
              <TrendingUp className="w-4 h-4" />
              Bottlenecks Only
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {viewMode === 'pipeline' ? (
            <>
              {/* Stage Metrics */}
              <StageMetricsPanel packages={filteredPackages} />

              {/* Pipeline Stages */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <PipelineStage
                  stage="fabrication"
                  title="Fabrication"
                  packages={packagesByStage.fabrication}
                  metrics={stageMetrics.fabrication}
                  onMovePackage={handleMovePackage}
                />
                <PipelineStage
                  stage="qa"
                  title="QA/Inspection"
                  packages={packagesByStage.qa}
                  metrics={stageMetrics.qa}
                  onMovePackage={handleMovePackage}
                />
                <PipelineStage
                  stage="packaging"
                  title="Packaging"
                  packages={packagesByStage.packaging}
                  metrics={stageMetrics.packaging}
                  onMovePackage={handleMovePackage}
                />
                <PipelineStage
                  stage="shipping"
                  title="Shipping"
                  packages={packagesByStage.shipping}
                  metrics={stageMetrics.shipping}
                  onMovePackage={handleMovePackage}
                />
              </div>
            </>
          ) : (
            <ProductionTimeline
              packages={filteredPackages}
              teams={teams}
              assignments={assignments}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}