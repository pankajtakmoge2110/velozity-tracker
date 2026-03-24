import type { Task, User, Priority, Status } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Alice Morgan',   color: '#6366f1' },
  { id: 'u2', name: 'Ben Carter',     color: '#ec4899' },
  { id: 'u3', name: 'Clara Singh',    color: '#f59e0b' },
  { id: 'u4', name: 'David Kim',      color: '#10b981' },
  { id: 'u5', name: 'Eva Torres',     color: '#3b82f6' },
  { id: 'u6', name: 'Felix Okafor',   color: '#ef4444' },
];

const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
const STATUSES:   Status[]   = ['todo', 'in-progress', 'in-review', 'done'];

const TITLE_PREFIXES = [
  'Implement', 'Refactor', 'Fix', 'Design', 'Review', 'Update',
  'Deploy', 'Test', 'Document', 'Migrate', 'Optimize', 'Audit',
];
const TITLE_SUBJECTS = [
  'authentication flow', 'dashboard layout', 'API integration', 'user onboarding',
  'payment gateway', 'notification system', 'search feature', 'data pipeline',
  'CI/CD pipeline', 'mobile responsiveness', 'error handling', 'caching layer',
  'dark mode', 'accessibility audit', 'performance profiling', 'database schema',
  'email templates', 'CSV export', 'role permissions', 'session management',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateOffset(baseDate: Date, minDays: number, maxDays: number): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + minDays + Math.floor(Math.random() * (maxDays - minDays)));
  return d.toISOString().split('T')[0];
}

export function generateTasks(count = 500): Task[] {
  const today = new Date();
  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const title = `${randomItem(TITLE_PREFIXES)} ${randomItem(TITLE_SUBJECTS)}`;
    const hasStartDate = Math.random() > 0.15; // ~15% have no start date
    const isOverdue    = Math.random() < 0.2;  // ~20% overdue

    const dueDate = isOverdue
      ? randomDateOffset(today, -20, -1)   // 1–20 days in the past
      : randomDateOffset(today, 0, 30);    // 0–30 days in the future

    const startDate = hasStartDate
      ? randomDateOffset(new Date(dueDate), -14, 0)
      : null;

    tasks.push({
      id:         `task-${i + 1}`,
      title:      `${title} #${i + 1}`,
      status:     randomItem(STATUSES),
      priority:   randomItem(PRIORITIES),
      assigneeId: randomItem(USERS).id,
      startDate,
      dueDate,
      createdAt:  randomDateOffset(today, -60, 0),
    });
  }

  return tasks;
}