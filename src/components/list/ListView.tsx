import React, { useMemo } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { ListRow } from './ListRow';
import { PRIORITY_ORDER } from '../../utils/priorityUtils';
import type { SortField } from '../../types';

const ROW_HEIGHT = 52;

const SORT_COLS: { field: SortField; label: string; width: string }[] = [
  { field: 'title',    label: 'Task',     width: 'flex-1' },
  { field: 'priority', label: 'Priority', width: 'w-20' },
  { field: 'dueDate',  label: 'Due Date', width: 'w-28' },
];

export const ListView: React.FC = () => {
  const { sort, setSort, getFilteredTasks } = useTaskStore();
  const filteredTasks = getFilteredTasks();

  const sorted = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      let cmp = 0;
      if (sort.field === 'title')    cmp = a.title.localeCompare(b.title);
      if (sort.field === 'priority') cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (sort.field === 'dueDate')  cmp = a.dueDate.localeCompare(b.dueDate);
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }, [filteredTasks, sort]);

  const { containerRef, onScroll, startIndex, endIndex, totalHeight, offsetY } =
    useVirtualScroll({ totalCount: sorted.length, itemHeight: ROW_HEIGHT });

  const toggleSort = (field: SortField) => {
    if (sort.field === field) {
      setSort({ field, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ field, direction: 'asc' });
    }
  };

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 text-3xl">⚡</div>
        <p className="text-lg font-semibold text-slate-300 mb-1">No tasks match your filters</p>
        <p className="text-sm text-slate-500 mb-4">Try adjusting or clearing your active filters</p>
        <button
          onClick={() => useTaskStore.getState().clearFilters()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-900 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-slate-800 border-b border-slate-700/50 text-xs font-semibold text-slate-400 uppercase tracking-wide flex-shrink-0">
        {SORT_COLS.map(col => (
          <button
            key={col.field}
            onClick={() => toggleSort(col.field)}
            className={`flex items-center gap-1 hover:text-slate-200 transition-colors ${col.width}
              ${col.field === 'priority' ? '' : ''}
              ${col.field === 'dueDate'  ? 'justify-end' : ''}`}
          >
            {col.label}
            {sort.field === col.field && (
              <span className="text-indigo-400">{sort.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </button>
        ))}
        {/* Spacers for status dropdown + assignee */}
        <div className="w-[110px] flex-shrink-0" />
        <div className="w-6 flex-shrink-0" />
      </div>

      {/* Virtual scroll container */}
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="overflow-y-auto flex-1"
        style={{ height: 'calc(100vh - 320px)' }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {sorted.slice(startIndex, endIndex + 1).map((task, i) => (
              <ListRow
                key={task.id}
                task={task}
                style={{ height: ROW_HEIGHT, top: (startIndex + i) * ROW_HEIGHT - offsetY }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer count */}
      <div className="px-4 py-2 bg-slate-800/60 border-t border-slate-700/50 text-xs text-slate-500 flex-shrink-0">
        {sorted.length} tasks
      </div>
    </div>
  );
};