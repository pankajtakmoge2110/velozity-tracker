import React from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { KanbanColumn } from './KanbanColumn';
import type { Status } from '../../types';

const COLUMNS: Status[] = ['todo', 'in-progress', 'in-review', 'done'];

export const KanbanView: React.FC = () => {
  const { moveTask, getFilteredTasks } = useTaskStore();
  const filteredTasks = getFilteredTasks();

  const { drag, onPointerDown, onPointerMove, onPointerUp, onColumnEnter, onColumnLeave } =
    useDragAndDrop((taskId, newStatus) => moveTask(taskId, newStatus));

  return (
    <div
      className="flex gap-4 overflow-x-auto pb-4"
      onPointerMove={drag.taskId ? onPointerMove : undefined}
      onPointerUp={drag.taskId ? onPointerUp : undefined}
    >
      {COLUMNS.map(status => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={filteredTasks.filter(t => t.status === status)}
          drag={drag}
          onPointerDown={onPointerDown}
          onColumnEnter={onColumnEnter}
          onColumnLeave={onColumnLeave}
        />
      ))}
    </div>
  );
};