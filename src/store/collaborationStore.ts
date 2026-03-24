import { create } from 'zustand';
import type { SimulatedUser } from '../types';

const ALL_TASK_IDS = Array.from({ length: 50 }, (_, i) => `task-${i + 1}`);

function randomTaskId(): string {
  return ALL_TASK_IDS[Math.floor(Math.random() * ALL_TASK_IDS.length)];
}

interface CollaborationStore {
  users: SimulatedUser[];
  startSimulation: () => () => void;
}

export const useCollaborationStore = create<CollaborationStore>((set) => ({
  users: [
    { id: 'cu1', name: 'Priya Nair',  color: '#a855f7', currentTaskId: 'task-1' },
    { id: 'cu2', name: 'James Liu',   color: '#f97316', currentTaskId: 'task-2' },
    { id: 'cu3', name: 'Sara Mensah', color: '#06b6d4', currentTaskId: 'task-3' },
    { id: 'cu4', name: 'Ravi Patel',  color: '#84cc16', currentTaskId: 'task-4' },
  ],

  startSimulation: () => {
    const interval = setInterval(() => {
      set(state => ({
        users: state.users.map(user =>
          Math.random() < 0.4
            ? { ...user, currentTaskId: randomTaskId() }
            : user
        ),
      }));
    }, 3000);
    return () => clearInterval(interval);
  },
}));