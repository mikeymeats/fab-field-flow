import { useState } from 'react';
import { Search, Filter, Users, AlertTriangle } from 'lucide-react';
import type { Team } from '@/store/db';

interface SchedulerToolbarFilters {
  search: string;
  teams: string[];
  stations: string[];
  priorities: string[];
  showOverCapacityOnly: boolean;
}

interface SchedulerToolbarProps {
  teams: Team[];
  filters: SchedulerToolbarFilters;
  onFiltersChange: (filters: SchedulerToolbarFilters) => void;
}

export function SchedulerToolbar({ teams, filters, onFiltersChange }: SchedulerToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const allStations = Array.from(new Set(teams.flatMap(t => t.stations)));
  const priorities = ['High', 'Med', 'Low'];

  const updateFilter = <K extends keyof SchedulerToolbarFilters>(
    key: K,
    value: SchedulerToolbarFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'teams' | 'stations' | 'priorities', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  return (
    <div className="bg-neutral-900 border-b border-neutral-800 p-4">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search assignments, hangers..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
            ${isExpanded ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}
          `}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>

        {/* Over Capacity Toggle */}
        <button
          onClick={() => updateFilter('showOverCapacityOnly', !filters.showOverCapacityOnly)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
            ${filters.showOverCapacityOnly 
              ? 'bg-amber-600 text-white' 
              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }
          `}
        >
          <AlertTriangle className="w-4 h-4" />
          Over Capacity
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-800">
          {/* Teams Filter */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">
              <Users className="w-3 h-3 inline mr-1" />
              Teams
            </label>
            <div className="space-y-1">
              {teams.map((team) => (
                <label key={team.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.teams.includes(team.id)}
                    onChange={() => toggleArrayFilter('teams', team.id)}
                    className="rounded border-neutral-600 bg-neutral-800"
                  />
                  <span className="text-neutral-300">{team.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stations Filter */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">
              Stations
            </label>
            <div className="space-y-1">
              {allStations.map((station) => (
                <label key={station} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.stations.includes(station)}
                    onChange={() => toggleArrayFilter('stations', station)}
                    className="rounded border-neutral-600 bg-neutral-800"
                  />
                  <span className="text-neutral-300">{station}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Priorities Filter */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">
              Priority
            </label>
            <div className="space-y-1">
              {priorities.map((priority) => (
                <label key={priority} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.priorities.includes(priority)}
                    onChange={() => toggleArrayFilter('priorities', priority)}
                    className="rounded border-neutral-600 bg-neutral-800"
                  />
                  <span className="text-neutral-300">{priority}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}