import React, { useEffect, useRef } from 'react';
import { useCollaborationStore } from '../../store/collaborationStore';

export const CollaborationBar: React.FC = () => {
  const users           = useCollaborationStore(s => s.users);
  const startSimulation = useCollaborationStore(s => s.startSimulation);
  const cleanupRef      = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (cleanupRef.current) return; // already started
    cleanupRef.current = startSimulation();
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex items-center gap-3 text-sm text-slate-400">
      <div className="flex items-center -space-x-2">
        {users.map(user => (
          <div
            key={user.id}
            className="w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
            style={{ backgroundColor: user.color }}
            title={user.name}
          >
            {user.name[0]}
          </div>
        ))}
      </div>
      <span>
        <span className="text-slate-200 font-medium">{users.length} people</span> viewing this board
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
        <span className="text-emerald-400 text-xs">Live</span>
      </span>
    </div>
  );
};