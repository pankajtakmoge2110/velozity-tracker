import React from 'react';
import type { ViewMode } from '../../types';

interface ViewSwitcherProps {
  current: ViewMode;
  onChange: (v: ViewMode) => void;
}

const VIEWS: { id: ViewMode; label: string; icon: string }[] = [
  { id: 'kanban',   label: 'Board',    icon: '⊞' },
  { id: 'list',     label: 'List',     icon: '☰' },
  { id: 'timeline', label: 'Timeline', icon: '▬' },
];

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ current, onChange }) => (
  <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
    {VIEWS.map(v => (
      <button
        key={v.id}
        onClick={() => onChange(v.id)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
          ${current === v.id
            ? 'bg-indigo-600 text-white shadow'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
      >
        <span>{v.icon}</span>
        {v.label}
      </button>
    ))}
  </div>
);