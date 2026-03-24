import { useState, useEffect } from 'react';
import { KanbanView }       from './components/kanban/KanbanView';
import { ListView }         from './components/list/ListView';
import { TimelineView }     from './components/timeline/TimelineView';
import { FilterBar }        from './components/filters/FilterBar';
import { ViewSwitcher }     from './components/shared/ViewSwitcher';
import { CollaborationBar } from './components/shared/CollaborationBar';
import { useUrlFilters }    from './hooks/useUrlFilters';
import type { ViewMode }    from './types';

export default function App() {
  const [view, setView] = useState<ViewMode>('kanban');
  const [mounted, setMounted] = useState(false);

  useUrlFilters();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-bold">V</div>
            <span className="font-semibold text-slate-100 text-sm">Velozity Tracker</span>
          </div>
          <CollaborationBar />
          <ViewSwitcher current={view} onChange={setView} />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[1600px] mx-auto px-6 py-6 flex flex-col gap-4">
        <FilterBar />
        <div>
          {view === 'kanban'   && <KanbanView />}
          {view === 'list'     && <ListView />}
          {view === 'timeline' && <TimelineView />}
        </div>
      </main>
    </div>
  );
}