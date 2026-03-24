import React from 'react';
import type { Task, Status } from '../../types';
import { Avatar } from '../shared/Avatar';
import { PriorityBadge } from '../shared/PriorityBadge';
import { formatDueDate } from '../../utils/dateUtils';
import { useTaskStore } from '../../store/taskStore';

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'todo',        label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'in-review',   label: 'In Review' },
  { value: 'done',        label: 'Done' },
];

interface ListRowProps {
  task: Task;
  style?: React.CSSProperties;
}

export const ListRow: React.FC<ListRowProps> = ({ task, style }) => {
  const updateTaskStatus = useTaskStore(s => s.updateTaskStatus);
  const { label, isOverdue, isDueToday } = formatDueDate(task.dueDate);

  return (
    <div
      style={style}
      className="absolute left-0 right-0 flex items-center gap-4 px-4 border-b border-slate-800 hover:bg-slate-800/40 transition-colors"
    >
      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-200 truncate">{task.title}</p>
      </div>

      {/* Inline status dropdown */}
      <select
        value={task.status}
        onChange={e => updateTaskStatus(task.id, e.target.value as Status)}
        className="bg-slate-700 border border-slate-600 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer flex-shrink-0"
      >
        {STATUS_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* Priority */}
      <div className="flex-shrink-0 w-20">
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Due date */}
      <div className="flex-shrink-0 w-28 text-right">
        <span className={`text-xs font-medium ${
          isDueToday ? 'text-amber-400' :
          isOverdue  ? 'text-red-400'   :
          'text-slate-500'
        }`}>
          {label}
        </span>
      </div>

      {/* Assignee */}
      <div className="flex-shrink-0">
        <Avatar userId={task.assigneeId} size="sm" />
      </div>
    </div>
  );
};