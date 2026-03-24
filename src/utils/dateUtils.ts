export function formatDueDate(dueDateStr: string): {
  label: string;
  isOverdue: boolean;
  isDueToday: boolean;
  daysOverdue: number;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);

  const diffMs   = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { label: 'Due Today', isOverdue: false, isDueToday: true, daysOverdue: 0 };
  }

  if (diffDays < 0) {
    const daysOverdue = Math.abs(diffDays);
    const label = daysOverdue > 7
      ? `${daysOverdue}d overdue`
      : due.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    return { label, isOverdue: true, isDueToday: false, daysOverdue };
  }

  return {
    label: due.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    isOverdue:   false,
    isDueToday:  false,
    daysOverdue: 0,
  };
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getTodayISO(): string {
  return toISODate(new Date());
}