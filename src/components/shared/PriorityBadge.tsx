import React from 'react';
import type { Priority } from '../../types';
import { PRIORITY_COLORS } from '../../utils/priorityUtils';

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const { bg, text, border } = PRIORITY_COLORS[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${bg} ${text} ${border}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};