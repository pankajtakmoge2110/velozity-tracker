import React from 'react';
import { useTaskStore } from '../../store/taskStore';
import { USERS } from '../../data/seed';
import type { Status, Priority } from '../../types';

const STATUSES: { value: Status; label: string }[] = [
  { value: 'todo',        label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'in-review',   label: 'In Review' },
  { value: 'done',        label: 'Done' },
];

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'critical', label: 'Critical' },
  { value: 'high',     label: 'High' },
  { value: 'medium',   label: 'Medium' },
  { value: 'low',      label: 'Low' },
];

function MultiSelect<T extends string>({
  label, options, selected, onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: T[];
  onChange: (vals: T[]) => void;
}) {
  const toggle = (val: T) =>
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all
              ${selected.includes(opt.value)
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export const FilterBar: React.FC = () => {
  const { filters, setFilters, clearFilters } = useTaskStore();

  const isActive =
    filters.statuses.length > 0 ||
    filters.priorities.length > 0 ||
    filters.assignees.length > 0 ||
    filters.dueDateFrom !== '' ||
    filters.dueDateTo !== '';

  const assigneeOptions = USERS.map(u => ({ value: u.id, label: u.name }));

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
      <div className="flex flex-wrap gap-6 items-end">
        <MultiSelect
          label="Status"
          options={STATUSES}
          selected={filters.statuses}
          onChange={vals => setFilters({ statuses: vals })}
        />
        <MultiSelect
          label="Priority"
          options={PRIORITIES}
          selected={filters.priorities}
          onChange={vals => setFilters({ priorities: vals })}
        />
        <MultiSelect
          label="Assignee"
          options={assigneeOptions}
          selected={filters.assignees}
          onChange={vals => setFilters({ assignees: vals })}
        />

        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Due Date</span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.dueDateFrom}
              onChange={e => setFilters({ dueDateFrom: e.target.value })}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-slate-600 text-xs">to</span>
            <input
              type="date"
              value={filters.dueDateTo}
              onChange={e => setFilters({ dueDateTo: e.target.value })}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {isActive && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/30 transition-all"
          >
            ✕ Clear filters
          </button>
        )}
      </div>
    </div>
  );
};