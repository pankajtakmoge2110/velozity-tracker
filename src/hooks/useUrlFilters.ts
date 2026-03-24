import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import type { FilterState, Priority, Status } from '../types';

export function useUrlFilters() {
  const { filters, setFilters } = useTaskStore();

  // On mount: read URL → store
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const parsed: FilterState = {
      statuses:    (params.get('statuses')   || '').split(',').filter(Boolean) as Status[],
      priorities:  (params.get('priorities') || '').split(',').filter(Boolean) as Priority[],
      assignees:   (params.get('assignees')  || '').split(',').filter(Boolean),
      dueDateFrom: params.get('dueDateFrom') || '',
      dueDateTo:   params.get('dueDateTo')   || '',
    };

    const hasAny = Object.values(parsed).some(v => Array.isArray(v) ? v.length > 0 : v !== '');
    if (hasAny) setFilters(parsed);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // On filter change: store → URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.statuses.length)    params.set('statuses',    filters.statuses.join(','));
    if (filters.priorities.length)  params.set('priorities',  filters.priorities.join(','));
    if (filters.assignees.length)   params.set('assignees',   filters.assignees.join(','));
    if (filters.dueDateFrom)        params.set('dueDateFrom', filters.dueDateFrom);
    if (filters.dueDateTo)          params.set('dueDateTo',   filters.dueDateTo);

    const search = params.toString();
    const newUrl = search
      ? `${window.location.pathname}?${search}`
      : window.location.pathname;

    window.history.replaceState(null, '', newUrl);
  }, [filters]);

  return filters;
}