import React, { useRef } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { PRIORITY_BAR_COLORS } from '../../utils/priorityUtils';
import { getTodayISO } from '../../utils/dateUtils';
import { USERS } from '../../data/seed';

const DAY_WIDTH  = 36;
const ROW_HEIGHT = 44;
const LABEL_W    = 200;

export const TimelineView: React.FC = () => {
  const tasks       = useTaskStore(s => s.getFilteredTasks());
  const scrollRef   = useRef<HTMLDivElement>(null);
  const today       = getTodayISO();

  const now    = new Date();
  const year   = now.getFullYear();
  const month  = now.getMonth();
  const days   = new Date(year, month + 1, 0).getDate();
  const monthLabel = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  const dayNumbers = Array.from({ length: days }, (_, i) => i + 1);

  function dateToOffset(dateStr: string): number {
    const d     = new Date(dateStr);
    const start = new Date(year, month, 1);
    const diff  = Math.floor((d.getTime() - start.getTime()) / 86400000);
    return Math.max(0, Math.min(diff, days - 1));
  }

  const todayOffset = dateToOffset(today);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700/50 overflow-hidden flex flex-col">
      {/* Month header */}
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700/50 flex-shrink-0">
        <h3 className="text-sm font-semibold text-slate-200">{monthLabel}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{tasks.length} tasks plotted</p>
      </div>

      {/* Scrollable timeline */}
      <div className="overflow-auto" ref={scrollRef} style={{ maxHeight: 'calc(100vh - 300px)' }}>
        <div style={{ minWidth: LABEL_W + days * DAY_WIDTH }}>
          {/* Day header row */}
          <div className="flex sticky top-0 z-10 bg-slate-800 border-b border-slate-700/50">
            <div style={{ width: LABEL_W, minWidth: LABEL_W }} className="px-3 py-2 text-xs text-slate-500 font-medium flex-shrink-0">
              Task
            </div>
            {dayNumbers.map(d => {
              const isToday = d === now.getDate();
              return (
                <div
                  key={d}
                  style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}
                  className={`flex-shrink-0 text-center py-2 text-xs font-medium border-l border-slate-700/30
                    ${isToday ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500'}`}
                >
                  {d}
                </div>
              );
            })}
          </div>

          {/* Task rows */}
          {tasks.map(task => {
            const user = USERS.find(u => u.id === task.assigneeId);
            const hasStart = task.startDate !== null;

            const startOff = hasStart ? dateToOffset(task.startDate!) : dateToOffset(task.dueDate);
            const endOff   = dateToOffset(task.dueDate);
            const barLeft  = LABEL_W + startOff * DAY_WIDTH;
            const barWidth = hasStart
              ? Math.max(DAY_WIDTH, (endOff - startOff + 1) * DAY_WIDTH)
              : DAY_WIDTH;

            return (
              <div
                key={task.id}
                className="flex items-center relative border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                style={{ height: ROW_HEIGHT }}
              >
                {/* Task label */}
                <div
                  style={{ width: LABEL_W, minWidth: LABEL_W }}
                  className="px-3 flex items-center gap-2 flex-shrink-0"
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PRIORITY_BAR_COLORS[task.priority] }}
                  />
                  <span className="text-xs text-slate-300 truncate flex-1">{task.title}</span>
                  {user && (
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold text-white"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.name[0]}
                    </div>
                  )}
                </div>

                {/* Day grid cells */}
                {dayNumbers.map(d => (
                  <div
                    key={d}
                    style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}
                    className="flex-shrink-0 h-full border-l border-slate-800/50"
                  />
                ))}

                {/* Task bar */}
                <div
                  title={`${task.title} · ${task.startDate ?? 'no start'} → ${task.dueDate}`}
                  style={{
                    position:        'absolute',
                    left:            barLeft,
                    width:           barWidth,
                    height:          22,
                    top:             '50%',
                    transform:       'translateY(-50%)',
                    backgroundColor: PRIORITY_BAR_COLORS[task.priority],
                    borderRadius:    4,
                    opacity:         0.85,
                  }}
                />

                {/* Today line overlay */}
                <div
                  style={{
                    position:        'absolute',
                    left:            LABEL_W + todayOffset * DAY_WIDTH + DAY_WIDTH / 2,
                    top:             0,
                    width:           2,
                    height:          ROW_HEIGHT,
                    backgroundColor: '#6366f1',
                    opacity:         0.6,
                    pointerEvents:   'none',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 border-t border-slate-700/50 flex items-center gap-4 flex-shrink-0">
        {(['critical','high','medium','low'] as const).map(p => (
          <div key={p} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: PRIORITY_BAR_COLORS[p] }} />
            <span className="text-xs text-slate-500 capitalize">{p}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-2">
          <div className="w-0.5 h-3 bg-indigo-400" />
          <span className="text-xs text-slate-500">Today</span>
        </div>
      </div>
    </div>
  );
};