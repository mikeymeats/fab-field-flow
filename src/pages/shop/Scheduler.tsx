import { useState, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Calendar, LayoutGrid } from 'lucide-react';
import { useDB } from '@/store/db';
import { SchedulerToolbar } from '@/components/scheduler/SchedulerToolbar';
import { SchedulerLane } from '@/components/scheduler/SchedulerLane';

type ViewMode = 'kanban' | 'gantt';

export default function Scheduler() {
  const {
    teams,
    scopedAssignments,
    scopedHangers,
    ensureTeamSeeds,
    moveAssignmentToTeam,
    expediteAssignment,
  } = useDB();

  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [filters, setFilters] = useState({
    search: '',
    teams: [] as string[],
    stations: [] as string[],
    priorities: [] as string[],
    showOverCapacityOnly: false,
  });

  // Ensure teams exist
  ensureTeamSeeds();

  const assignments = scopedAssignments();
  const hangers = scopedHangers();

  // Filter assignments based on current filters
  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const hanger = hangers.find(h => h.id === assignment.hangerId);
      if (!hanger) return false;

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          assignment.id.toLowerCase().includes(searchLower) ||
          hanger.name.toLowerCase().includes(searchLower) ||
          hanger.type.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Team filter
      if (filters.teams.length > 0 && assignment.teamId) {
        if (!filters.teams.includes(assignment.teamId)) return false;
      }

      // Priority filter
      if (filters.priorities.length > 0 && assignment.priority) {
        if (!filters.priorities.includes(assignment.priority)) return false;
      }

      return true;
    });
  }, [assignments, hangers, filters]);

  // Group assignments by team
  const assignmentsByTeam = useMemo(() => {
    const grouped = new Map<string, typeof assignments>();
    
    teams.forEach(team => {
      grouped.set(team.id, []);
    });

    filteredAssignments.forEach(assignment => {
      if (assignment.teamId) {
        const teamAssignments = grouped.get(assignment.teamId) || [];
        grouped.set(assignment.teamId, [...teamAssignments, assignment]);
      } else {
        // Unassigned assignments go to first team for now
        const firstTeam = teams[0];
        if (firstTeam) {
          const teamAssignments = grouped.get(firstTeam.id) || [];
          grouped.set(firstTeam.id, [...teamAssignments, assignment]);
        }
      }
    });

    return grouped;
  }, [teams, filteredAssignments]);

  // Filter teams by over-capacity if needed
  const visibleTeams = useMemo(() => {
    if (!filters.showOverCapacityOnly) return teams;

    return teams.filter(team => {
      const teamAssignments = assignmentsByTeam.get(team.id) || [];
      const plannedHours = teamAssignments.reduce((sum, assignment) => {
        const hanger = hangers.find(h => h.id === assignment.hangerId);
        return sum + (hanger?.estHours || 2);
      }, 0);
      const availableHours = team.dailyHours || team.members.length * 8;
      return plannedHours > availableHours;
    });
  }, [teams, assignmentsByTeam, hangers, filters.showOverCapacityOnly]);

  const handleMoveAssignment = (assignmentId: string, targetTeamId: string) => {
    moveAssignmentToTeam(assignmentId, targetTeamId);
  };

  const handleReorderAssignments = (teamId: string, assignmentIds: string[]) => {
    // TODO: Implement reordering within a team
    console.log('Reorder assignments in team', teamId, assignmentIds);
  };

  const handleOpenAssignment = (assignmentId: string) => {
    // TODO: Navigate to assignment detail or open modal
    console.log('Open assignment', assignmentId);
  };

  const handleExpediteAssignment = (assignmentId: string, expedite: boolean) => {
    expediteAssignment(assignmentId, expedite);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div>
            <h1 className="text-xl font-semibold text-neutral-100">Scheduler</h1>
            <p className="text-sm text-neutral-400">
              Plan and balance work across teams and stations
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('kanban')}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                ${viewMode === 'kanban' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }
              `}
            >
              <LayoutGrid className="w-4 h-4" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                ${viewMode === 'gantt' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }
              `}
            >
              <Calendar className="w-4 h-4" />
              Gantt
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <SchedulerToolbar
          teams={teams}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'kanban' ? (
            <div className="h-full grid auto-cols-fr grid-flow-col gap-4 p-4 overflow-x-auto">
              {visibleTeams.map((team) => (
                <div key={team.id} className="min-w-80 border border-neutral-800 rounded-lg overflow-hidden">
                  <SchedulerLane
                    team={team}
                    assignments={assignmentsByTeam.get(team.id) || []}
                    hangers={hangers}
                    onMoveAssignment={handleMoveAssignment}
                    onReorderAssignments={handleReorderAssignments}
                    onOpenAssignment={handleOpenAssignment}
                    onExpediteAssignment={handleExpediteAssignment}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-300 mb-2">Gantt View</h3>
                <p className="text-neutral-500">Timeline view coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}