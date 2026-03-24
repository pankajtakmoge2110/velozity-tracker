import React from 'react';
import type { Task, Status, SimulatedUser } from '../../types';
import { Avatar } from '../shared/Avatar';
import { PriorityBadge } from '../shared/PriorityBadge';
import { formatDueDate } from '../../utils/dateUtils';

interface KanbanCardProps {
  task: Task;
  collaborators: SimulatedUser[];
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>, taskId: string, status: Status) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = React.memo(({
  task,
  collaborators,
  onPointerDown,
}) => {
  const { label, isOverdue, isDueToday } = formatDueDate(task.dueDate);

  return (
    <div
      data-task-id={task.id}
      onPointerDown={e => onPointerDown(e, task.id, task.status)}
      className={`bg-slate-800 border rounded-xl p-3 cursor-grab active:cursor-grabbing select-none
        transition-all duration-150
        ${isOverdue ? 'border-red-500/40' : 'border-slate-700/60'}
        hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5`}
    >
      {/* Priority + Collaboration avatars */}
      <div className="flex items-center justify-between mb-2">
        <PriorityBadge priority={task.priority} />
        {collaborators.length > 0 && (
          <div className="flex items-center -space-x-1">
            {collaborators.slice(0, 2).map(u => (
              <div
                key={u.id}
                className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: u.color }}
                title={`${u.name} is viewing`}
              >
                {u.name[0]}
              </div>
            ))}
            {collaborators.length > 2 && (
              <div className="w-5 h-5 rounded-full border border-slate-700 bg-slate-600 flex items-center justify-center text-xs text-slate-300">
                +{collaborators.length - 2}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      <p className="text-sm text-slate-200 font-medium leading-snug mb-3 line-clamp-2">
        {task.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Avatar userId={task.assigneeId} size="sm" />
        <span className={`text-xs font-medium ${
          isDueToday ? 'text-amber-400' :
          isOverdue  ? 'text-red-400'   :
          'text-slate-500'
        }`}>
          {label}
        </span>
      </div>
    </div>
  );
});

KanbanCard.displayName = 'KanbanCard';