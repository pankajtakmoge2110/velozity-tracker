import { create } from 'zustand';
import { generateTasks } from '../data/seed';
import type { Task, Status, FilterState, SortState } from '../types';

const INITIAL_TASKS = generateTasks(500);

interface TaskStore {
  tasks: Task[];
  filters: FilterState;
  sort: SortState;

  // Task mutations
  updateTaskStatus: (taskId: string, status: Status) => void;
  moveTask: (taskId: string, newStatus: Status) => void;

  // Filter actions
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;

  // Sort actions
  setSort: (sort: SortState) => void;

  // Derived helpers
  getFilteredTasks: () => Task[];
}

export const EMPTY_FILTERS: FilterState = {
  statuses:    [],
  priorities:  [],
  assignees:   [],
  dueDateFrom: '',
  dueDateTo:   '',
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks:   INITIAL_TASKS,
  filters: EMPTY_FILTERS,
  sort:    { field: 'dueDate', direction: 'asc' },

  updateTaskStatus: (taskId, status) =>
    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t),
    })),

  moveTask: (taskId, newStatus) =>
    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t),
    })),

  setFilters: (partial) =>
    set(state => ({ filters: { ...state.filters, ...partial } })),

  clearFilters: () => set({ filters: EMPTY_FILTERS }),

  setSort: (sort) => set({ sort }),

  getFilteredTasks: () => {
    const { tasks, filters } = get();
    return tasks.filter(task => {
      if (filters.statuses.length    && !filters.statuses.includes(task.status))       return false;
      if (filters.priorities.length  && !filters.priorities.includes(task.priority))   return false;
      if (filters.assignees.length   && !filters.assignees.includes(task.assigneeId))  return false;
      if (filters.dueDateFrom        && task.dueDate < filters.dueDateFrom)             return false;
      if (filters.dueDateTo          && task.dueDate > filters.dueDateTo)               return false;
      return true;
    });
  },
}));