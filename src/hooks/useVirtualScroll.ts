import { useRef, useState, useCallback, useEffect } from 'react';

interface UseVirtualScrollOptions {
  totalCount:  number;
  itemHeight:  number;
  bufferRows?: number;
}

export function useVirtualScroll({
  totalCount,
  itemHeight,
  bufferRows = 5,
}: UseVirtualScrollOptions) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => setViewportHeight(el.clientHeight));
    ro.observe(el);
    setViewportHeight(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((e.target as HTMLDivElement).scrollTop);
  }, []);

  const visibleCount = Math.ceil(viewportHeight / itemHeight);
  const startIndex   = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferRows);
  const endIndex     = Math.min(totalCount - 1, startIndex + visibleCount + bufferRows * 2);

  const totalHeight  = totalCount * itemHeight;
  const offsetY      = startIndex * itemHeight;

  return {
    containerRef,
    onScroll,
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
  };
}