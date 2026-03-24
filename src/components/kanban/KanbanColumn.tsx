import React from 'react';
import type { Task, Status } from '../../types';
import { KanbanCard } from './KanbanCard';
import { useCollaborationStore } from '../../store/collaborationStore';
import type { DragState } from '../../hooks/useDragAndDrop';

const COLUMN_META: Record<Status, { label: string; color: string; dot: string }> = {
  'todo':        { label: 'To Do',       color: 'border-slate-600',     dot: 'bg-slate-400'   },
  'in-progress': { label: 'In Progress', color: 'border-blue-500/50',   dot: 'bg-blue-400'    },
  'in-review':   { label: 'In Review',   color: 'border-purple-500/50', dot: 'bg-purple-400'  },
  'done':        { label: 'Done',        color: 'border-emerald-500/50',dot: 'bg-emerald-400' },
};

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  drag: DragState;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>, taskId: string, status: Status) => void;
  onColumnEnter: (s: Status) => void;
  onColumnLeave: () => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status, tasks, drag, onPointerDown, onColumnEnter, onColumnLeave,
}) => {
  const meta   = COLUMN_META[status];
  const isOver = drag.overColumn === status;
  const isDragSelf = drag.sourceStatus === status;

  // Read collaborators once at column level — stable reference
  const collabUsers = useCollaborationStore(s => s.users);

  return (
    <div
      data-column={status}
      onPointerEnter={() => onColumnEnter(status)}
      onPointerLeave={onColumnLeave}
      className={`flex flex-col rounded-xl border-2 transition-all duration-150 min-w-[280px] max-w-[320px] flex-1
        ${isOver && !isDragSelf
          ? 'border-indigo-500/70 bg-indigo-500/5'
          : `${meta.color} bg-slate-900/50`}`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
          <span className="text-sm font-semibold text-slate-200">{meta.label}</span>
        </div>
        <span className="text-xs font-medium bg-slate-700 text-slate-400 rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div
        className="flex flex-col gap-2 p-3 overflow-y-auto flex-1"
        style={{ maxHeight: 'calc(100vh - 280px)' }}
      >
        {tasks.length === 0 && !drag.taskId ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-3 text-xl">
              {status === 'done' ? '✓' : '○'}
            </div>
            <p className="text-sm text-slate-500 font-medium">No tasks here</p>
            <p className="text-xs text-slate-600 mt-1">
              {status === 'todo' ? 'Drag cards here to queue them' : 'Move tasks to this column'}
            </p>
          </div>
        ) : (
          tasks.map(task => (
            <React.Fragment key={task.id}>
              {/* Placeholder for the card being dragged */}
              {drag.taskId === task.id && (
                <div
                  className="rounded-xl border-2 border-dashed border-indigo-500/40 bg-indigo-500/5 flex-shrink-0"
                  style={{ height: drag.placeholderHeight }}
                />
              )}
              {drag.taskId !== task.id && (
                <KanbanCard
                  task={task}
                  collaborators={collabUsers.filter(u => u.currentTaskId === task.id)}
                  onPointerDown={onPointerDown}
                />
              )}
            </React.Fragment>
          ))
        )}

        {/* Drop target indicator */}
        {isOver && drag.taskId && drag.sourceStatus !== status && (
          <div
            className="rounded-xl border-2 border-dashed border-indigo-500/60 bg-indigo-500/10 flex items-center justify-center flex-shrink-0"
            style={{ height: drag.placeholderHeight || 80 }}
          >
            <span className="text-xs text-indigo-400">Drop here</span>
          </div>
        )}
      </div>
    </div>
  );
};