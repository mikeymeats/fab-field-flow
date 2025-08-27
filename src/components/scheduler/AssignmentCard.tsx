import { useDrag } from 'react-dnd';
import { Clock, AlertCircle, Zap } from 'lucide-react';
import type { Assignment, Hanger } from '@/store/db';

interface AssignmentCardProps {
  assignment: Assignment;
  hanger: Hanger;
  onOpen?: (id: string) => void;
  onExpedite?: (id: string, expedite: boolean) => void;
}

export function AssignmentCard({ assignment, hanger, onOpen, onExpedite }: AssignmentCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'assignment',
    item: { id: assignment.id, teamId: assignment.teamId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const priorityColors = {
    High: 'bg-red-600/20 text-red-300 border-red-700/40',
    Med: 'bg-amber-600/20 text-amber-300 border-amber-700/40',
    Low: 'bg-blue-600/20 text-blue-300 border-blue-700/40',
  };

  const stateColors = {
    Queued: 'bg-neutral-600/20 text-neutral-300 border-neutral-700/40',
    InProgress: 'bg-blue-600/20 text-blue-300 border-blue-700/40',
    Paused: 'bg-amber-600/20 text-amber-300 border-amber-700/40',
    QA: 'bg-purple-600/20 text-purple-300 border-purple-700/40',
    Done: 'bg-emerald-600/20 text-emerald-300 border-emerald-700/40',
  };

  const estimatedHours = hanger.estHours || 2; // fallback

  return (
    <div
      ref={drag}
      className={`
        bg-neutral-900 border border-neutral-800 rounded-lg p-3 cursor-move
        hover:bg-neutral-800/50 transition-colors
        ${isDragging ? 'opacity-50' : ''}
        ${assignment.expedite ? 'ring-2 ring-red-500/50' : ''}
      `}
    >
      {/* Header with expedite indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-200">{assignment.id}</span>
          {assignment.expedite && (
            <div title="Expedited">
              <Zap className="w-3 h-3 text-red-400" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onOpen?.(assignment.id)}
            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-neutral-200"
            title="Open details"
          >
            <Clock className="w-3 h-3" />
          </button>
          <button
            onClick={() => onExpedite?.(assignment.id, !assignment.expedite)}
            className={`p-1 rounded hover:bg-white/10 ${
              assignment.expedite ? 'text-red-400' : 'text-neutral-400 hover:text-red-400'
            }`}
            title={assignment.expedite ? 'Remove expedite' : 'Expedite'}
          >
            <AlertCircle className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Hanger info */}
      <div className="mb-2">
        <div className="text-sm font-medium text-neutral-100">{hanger.name}</div>
        <div className="text-xs text-neutral-400">{hanger.type} • {hanger.system}</div>
      </div>

      {/* Chips row */}
      <div className="flex items-center gap-2 mb-2">
        {assignment.priority && (
          <span className={`text-xs px-2 py-1 border rounded ${priorityColors[assignment.priority]}`}>
            {assignment.priority}
          </span>
        )}
        <span className={`text-xs px-2 py-1 border rounded ${stateColors[assignment.state]}`}>
          {assignment.state}
        </span>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>{estimatedHours}h est</span>
        {assignment.eta && <span>Due: {new Date(assignment.eta).toLocaleDateString()}</span>}
      </div>
    </div>
  );
}