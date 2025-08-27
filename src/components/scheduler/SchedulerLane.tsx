import { useDrop } from 'react-dnd';
import { Users } from 'lucide-react';
import { AssignmentCard } from './AssignmentCard';
import { CapacityMeter } from './CapacityMeter';
import type { Team, Assignment, Hanger } from '@/store/db';

interface SchedulerLaneProps {
  team: Team;
  assignments: Assignment[];
  hangers: Hanger[];
  onMoveAssignment: (assignmentId: string, targetTeamId: string) => void;
  onReorderAssignments: (teamId: string, assignmentIds: string[]) => void;
  onOpenAssignment?: (id: string) => void;
  onExpediteAssignment?: (id: string, expedite: boolean) => void;
}

export function SchedulerLane({
  team,
  assignments,
  hangers,
  onMoveAssignment,
  onReorderAssignments,
  onOpenAssignment,
  onExpediteAssignment,
}: SchedulerLaneProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'assignment',
    drop: (item: { id: string; teamId?: string }) => {
      if (item.teamId !== team.id) {
        onMoveAssignment(item.id, team.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  // Sort assignments: expedited first, then by order, then by creation date
  const sortedAssignments = [...assignments].sort((a, b) => {
    if (a.expedite && !b.expedite) return -1;
    if (!a.expedite && b.expedite) return 1;
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Calculate capacity
  const dailyHours = team.dailyHours || team.members.length * 8;
  const plannedHours = assignments.reduce((sum, assignment) => {
    const hanger = hangers.find(h => h.id === assignment.hangerId);
    return sum + (hanger?.estHours || 2);
  }, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Lane Header */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-900/50">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-neutral-400" />
          <h3 className="font-semibold text-neutral-100">{team.name}</h3>
          <span className="text-xs text-neutral-400">({team.members.length})</span>
        </div>
        
        <div className="text-xs text-neutral-400 mb-2">
          {team.stations.join(', ')}
        </div>

        <CapacityMeter
          plannedHours={plannedHours}
          availableHours={dailyHours}
        />
      </div>

      {/* Drop Zone */}
      <div
        ref={drop}
        className={`
          flex-1 p-3 space-y-3 min-h-96 transition-colors
          ${isOver && canDrop ? 'bg-blue-900/20 border-blue-600/50' : ''}
          ${isOver && !canDrop ? 'bg-red-900/20 border-red-600/50' : ''}
        `}
      >
        {sortedAssignments.map((assignment) => {
          const hanger = hangers.find(h => h.id === assignment.hangerId);
          if (!hanger) return null;

          return (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              hanger={hanger}
              onOpen={onOpenAssignment}
              onExpedite={onExpediteAssignment}
            />
          );
        })}

        {assignments.length === 0 && (
          <div className="flex items-center justify-center h-32 text-neutral-500 text-sm">
            Drop assignments here
          </div>
        )}
      </div>

      {/* Lane Footer */}
      <div className="p-2 border-t border-neutral-800 bg-neutral-900/50">
        <div className="text-xs text-neutral-400 text-center">
          {assignments.length} assignments
        </div>
      </div>
    </div>
  );
}