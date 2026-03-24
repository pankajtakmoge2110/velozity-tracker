import { useRef, useState, useCallback } from 'react';
import type { Status } from '../types';

export interface DragState {
  taskId:         string | null;
  sourceStatus:   Status | null;
  overColumn:     Status | null;
  placeholderHeight: number;
}

const INITIAL: DragState = {
  taskId:            null,
  sourceStatus:      null,
  overColumn:        null,
  placeholderHeight: 0,
};

export function useDragAndDrop(onDrop: (taskId: string, newStatus: Status) => void) {
  const [drag, setDrag] = useState<DragState>(INITIAL);
  const ghostRef   = useRef<HTMLDivElement | null>(null);
  const offsetRef  = useRef({ x: 0, y: 0 });
  const originRef  = useRef<Status | null>(null);

  // ── Pointer-based drag start ──────────────────────────────────────────────
  const onPointerDown = useCallback((
    e: React.PointerEvent<HTMLDivElement>,
    taskId: string,
    status: Status,
  ) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.currentTarget.setPointerCapture(e.pointerId);

    const rect = e.currentTarget.getBoundingClientRect();
    offsetRef.current  = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    originRef.current  = status;

    // Create ghost element
    const ghost = e.currentTarget.cloneNode(true) as HTMLDivElement;
    ghost.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: ${rect.width}px;
      pointer-events: none;
      opacity: 0.85;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      transform: rotate(2deg) scale(1.02);
      transition: transform 0.1s;
      z-index: 9999;
    `;
    document.body.appendChild(ghost);
    ghostRef.current = ghost;

    setDrag({
      taskId,
      sourceStatus:      status,
      overColumn:        null,
      placeholderHeight: rect.height,
    });
  }, []);

  // ── Pointer move ──────────────────────────────────────────────────────────
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!ghostRef.current || !drag.taskId) return;
    ghostRef.current.style.left = `${e.clientX - offsetRef.current.x}px`;
    ghostRef.current.style.top  = `${e.clientY - offsetRef.current.y}px`;
  }, [drag.taskId]);

  // ── Drop ──────────────────────────────────────────────────────────────────
  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!drag.taskId) return;

    // Find which column the pointer is over
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const col = el?.closest('[data-column]');
    const targetStatus = col?.getAttribute('data-column') as Status | null;

    if (ghostRef.current) {
      if (!targetStatus) {
        // Snap back animation
        const origin = document.querySelector(`[data-task-id="${drag.taskId}"]`);
        if (origin && ghostRef.current) {
          const rect = origin.getBoundingClientRect();
          ghostRef.current.style.transition = 'left 0.3s, top 0.3s, opacity 0.3s';
          ghostRef.current.style.left    = `${rect.left}px`;
          ghostRef.current.style.top     = `${rect.top}px`;
          ghostRef.current.style.opacity = '0';
          setTimeout(() => { ghostRef.current?.remove(); ghostRef.current = null; }, 320);
        } else {
          ghostRef.current.remove();
          ghostRef.current = null;
        }
      } else {
        ghostRef.current.remove();
        ghostRef.current = null;
      }
    }

    if (targetStatus && drag.taskId) {
      onDrop(drag.taskId, targetStatus);
    }

    setDrag(INITIAL);
  }, [drag.taskId, onDrop]);

  const onColumnEnter = useCallback((status: Status) => {
    if (drag.taskId) setDrag(prev => ({ ...prev, overColumn: status }));
  }, [drag.taskId]);

  const onColumnLeave = useCallback(() => {
    if (drag.taskId) setDrag(prev => ({ ...prev, overColumn: null }));
  }, [drag.taskId]);

  return { drag, onPointerDown, onPointerMove, onPointerUp, onColumnEnter, onColumnLeave };
}