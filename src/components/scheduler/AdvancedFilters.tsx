import { useState } from 'react';
import { Filter, X, Calendar, MapPin, Layers, Target } from 'lucide-react';
import type { Package } from '@/store/db';

interface AdvancedFiltersProps {
  filters: {
    search: string;
    priorities: string[];
    projects: string[];
    zones: string[];
    deliveryDate: Date | null;
    showBottlenecksOnly: boolean;
    showCriticalPath: boolean;
    showExpedited: boolean;
  };
  onFiltersChange: (filters: any) => void;
  packages: Package[];
}

export function AdvancedFilters({ filters, onFiltersChange, packages }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Extract unique values from packages
  const uniqueProjects = [...new Set(packages.map(p => p.projectId))];
  const uniqueZones = [...new Set(packages.map(p => p.zone).filter(Boolean))];
  const priorities = ['Low', 'Med', 'High'];

  const activeFiltersCount = [
    filters.priorities.length > 0,
    filters.projects.length > 0,
    filters.zones.length > 0,
    filters.deliveryDate !== null,
    filters.showExpedited,
  ].filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({
      ...filters,
      priorities: [],
      projects: [],
      zones: [],
      deliveryDate: null,
      showExpedited: false,
    });
  };

  const toggleArrayFilter = (key: 'priorities' | 'projects' | 'zones', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    onFiltersChange({ ...filters, [key]: newArray });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
          ${activeFiltersCount > 0
            ? 'bg-primary text-primary-foreground' 
            : 'bg-background border hover:bg-muted'
          }
        `}
      >
        <Filter className="w-4 h-4" />
        Filters
        {activeFiltersCount > 0 && (
          <span className="bg-primary-foreground text-primary rounded-full px-1.5 py-0.5 text-xs font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 z-10 bg-card border rounded-lg shadow-lg p-4 w-96">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground">Advanced Filters</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-muted rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Priority Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">Priority</label>
            </div>
            <div className="flex gap-2">
              {priorities.map(priority => (
                <button
                  key={priority}
                  onClick={() => toggleArrayFilter('priorities', priority)}
                  className={`
                    px-3 py-1 rounded text-xs font-medium transition-colors
                    ${filters.priorities.includes(priority)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Project Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">Projects</label>
            </div>
            <div className="max-h-24 overflow-y-auto">
              {uniqueProjects.map(project => (
                <label key={project} className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    checked={filters.projects.includes(project)}
                    onChange={() => toggleArrayFilter('projects', project)}
                    className="rounded border-border"
                  />
                  <span className="text-sm">{project}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Zone Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">Zones</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {uniqueZones.map(zone => (
                <button
                  key={zone}
                  onClick={() => toggleArrayFilter('zones', zone)}
                  className={`
                    px-2 py-1 rounded text-xs font-medium transition-colors
                    ${filters.zones.includes(zone)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Quick Filters</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.showExpedited}
                  onChange={(e) => onFiltersChange({ ...filters, showExpedited: e.target.checked })}
                  className="rounded border-border"
                />
                <span className="text-sm">Expedited packages only</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={clearFilters}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}