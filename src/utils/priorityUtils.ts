import type { Priority } from '../types';

export const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 0,
  high:     1,
  medium:   2,
  low:      3,
};

export const PRIORITY_COLORS: Record<Priority, { bg: string; text: string; border: string }> = {
  critical: { bg: 'bg-red-500/20',    text: 'text-red-400',    border: 'border-red-500/40' },
  high:     { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/40' },
  medium:   { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/40' },
  low:      { bg: 'bg-slate-500/20',  text: 'text-slate-400',  border: 'border-slate-500/40' },
};

export const PRIORITY_BAR_COLORS: Record<Priority, string> = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#64748b',
};