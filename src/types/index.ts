// ─── Enums ───────────────────────────────────────────────────────────────────

export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status   = 'todo' | 'in-progress' | 'in-review' | 'done';
export type ViewMode = 'kanban' | 'list' | 'timeline';
export type SortField     = 'title' | 'priority' | 'dueDate';
export type SortDirection = 'asc' | 'desc';

// ─── Core entities ───────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  color: string; // hex, used for avatar background
}

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assigneeId: string;
  startDate: string | null; // ISO date string, nullable
  dueDate: string;          // ISO date string, always present
  createdAt: string;
}

// ─── Filter state ─────────────────────────────────────────────────────────────

export interface FilterState {
  statuses:   Status[];
  priorities: Priority[];
  assignees:  string[];   // user IDs
  dueDateFrom: string;    // ISO date or ''
  dueDateTo:   string;
}

// ─── Sort state (List view) ───────────────────────────────────────────────────

export interface SortState {
  field:     SortField;
  direction: SortDirection;
}

// ─── Collaboration ────────────────────────────────────────────────────────────

export interface SimulatedUser {
  id: string;
  name: string;
  color: string;
  currentTaskId: string | null;
}