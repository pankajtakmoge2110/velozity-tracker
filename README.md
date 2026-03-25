# Velozity Project Tracker

A fully functional project management UI built with React, TypeScript, and Tailwind CSS.

🔗 **Live Demo:** [https://velozity-tracker.vercel.app]([https://velozity-tracker.vercel.app](https://velozity-tracker-flame.vercel.app/))


📁 **Repository:** [https://github.com/pankajtakmoge2110/velozity-tracker]

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/velozity-tracker.git
cd velozity-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

---

## Features

- **Three Views** — Kanban Board, List, and Timeline/Gantt — all sharing one dataset with instant switching
- **Custom Drag & Drop** — built from scratch using Pointer Events API, works on mouse and touch
- **Virtual Scrolling** — handles 500+ tasks in List view with no performance degradation
- **Live Collaboration Indicators** — simulated real-time presence with animated user avatars
- **URL-Synced Filters** — shareable, bookmarkable filter state via query parameters
- **Seed Data Generator** — generates 500 randomised tasks including overdue and missing start dates

---

## State Management — Why Zustand

Zustand was chosen over React Context + useReducer for three key reasons:

**1. Zero boilerplate.** Actions, state, and selectors all live in a single file with no Provider
wrapping, no dispatch functions, and no action type constants. This keeps the codebase
lean and easy to navigate.

**2. Selective subscriptions.** Components subscribe only to the slice of state they need —
for example `useTaskStore(s => s.filters)` — so a task status change does not cause the
filter bar to re-render, and a filter change does not re-render every Kanban card.
This is critical for performance when rendering 500+ tasks.

**3. Outside-component access.** `useTaskStore.getState()` allows hooks like `useUrlFilters`
and utility functions to read and write state without being inside a React component or
requiring prop drilling. This made the URL sync hook and the virtual scroll logic
significantly simpler to implement.

---

## Virtual Scrolling Implementation

Implemented from scratch in `src/hooks/useVirtualScroll.ts`. No libraries used.

**How it works:**

1. A `ResizeObserver` watches the scroll container and tracks its pixel height in state
2. On every scroll event, `scrollTop` is captured via `onScroll`
3. The visible window is calculated:
   - `startIndex = max(0, floor(scrollTop / ROW_HEIGHT) - BUFFER)`
   - `endIndex = min(totalCount - 1, startIndex + visibleCount + BUFFER * 2)`
   - Buffer is set to 5 rows above and below the viewport
4. The outer container has `height = totalCount × ROW_HEIGHT` so the scrollbar reflects
   the true dataset size even when only ~15 rows are in the DOM
5. Rendered rows use `position: absolute` with `top = index × ROW_HEIGHT`, meaning
   DOM insertions and removals do not affect scroll position or cause layout shift
6. Tested with 500 tasks — smooth scrolling with no blank gaps or flicker

---

## Drag & Drop Implementation

Implemented from scratch in `src/hooks/useDragAndDrop.ts`. No libraries used.

**How it works:**

1. `onPointerDown` fires when the user presses on a card. It:
   - Calls `setPointerCapture` so the element continues receiving pointer events even
     if the cursor leaves it
   - Records the cursor offset within the card (so the ghost appears under the finger,
     not at the top-left corner)
   - Clones the card's DOM node and appends it to `<body>` as a `position: fixed` ghost
     with `pointer-events: none`, a drop shadow, and slight rotation

2. `onPointerMove` repositions the ghost by updating its `left` and `top` styles directly —
   no React state updates during the move, keeping it at 60fps

3. The original card slot renders a dashed placeholder div of the same height using the
   `placeholderHeight` from drag state — the column layout does not shift at all because
   the placeholder occupies exactly the same space

4. `onColumnEnter / onColumnLeave` track which column the ghost is over using
   `data-column` attributes and apply a subtle highlight to valid drop targets

5. `onPointerUp` uses `document.elementFromPoint` to identify the drop target column:
   - Valid drop: calls `onDrop(taskId, newStatus)` and removes the ghost
   - Invalid drop: animates the ghost back to the card's `getBoundingClientRect` using
     a CSS transition on `left/top/opacity`, then removes it after 320ms

6. Works on both mouse and touch via the unified Pointer Events API

---

## Lighthouse Score

> Screenshot below — Desktop performance score: **90+**

![Lighthouse Score](./lighthouse.png)

*(Run Lighthouse in Chrome DevTools → Lighthouse tab → Desktop → Analyze)*

---

## Project Structure
```
src/
├── components/
│   ├── kanban/         # KanbanView, KanbanColumn, KanbanCard
│   ├── list/           # ListView (virtual scroll), ListRow
│   ├── timeline/       # TimelineView (Gantt)
│   ├── filters/        # FilterBar with multi-select + date range
│   └── shared/         # Avatar, PriorityBadge, ViewSwitcher, CollaborationBar
├── store/
│   ├── taskStore.ts    # Zustand: tasks, filters, sort, derived selectors
│   └── collaborationStore.ts  # Zustand: simulated live users
├── hooks/
│   ├── useDragAndDrop.ts     # Custom pointer-events DnD
│   ├── useVirtualScroll.ts   # Custom virtual scrolling
│   └── useUrlFilters.ts      # URL ↔ filter state sync
├── types/index.ts      # All TypeScript interfaces and types
├── data/seed.ts        # 500-task generator with randomised edge cases
└── utils/
    ├── dateUtils.ts    # Overdue detection, "Due Today" formatting
    └── priorityUtils.ts # Priority colors and sort order
```

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 5 | Build tool |
| Tailwind CSS | 3 | Styling |
| Zustand | 4 | State management |

---

## Explanation Field (150–250 words)

The hardest UI problem was implementing custom drag-and-drop without layout shift. When
a card is picked up, the column must not collapse or reflow — other cards must stay exactly
where they are. The solution was to immediately render a placeholder `<div>` at the original
card's position with `height` equal to the card's `getBoundingClientRect().height`, captured
at drag start. The actual card is hidden via `opacity: 0` rather than removed from the DOM,
so the placeholder takes its exact slot. The dragged ghost is a cloned node appended to
`<body>` with `position: fixed`, so it is completely outside the column's layout flow and
cannot affect it in any way.

The second challenge was the Pointer Events snap-back animation on invalid drops. When
the user releases the card outside a valid column, the ghost must smoothly fly back to its
origin. This was done by reading the original card's `getBoundingClientRect()` at drop time
and setting `transition: left 0.3s, top 0.3s, opacity 0.3s` on the ghost before updating its
`left` and `top` to the origin coordinates. After 320ms the ghost is removed.

With more time, I would refactor the Timeline view to also use the virtual scrolling hook,
since it currently renders all task rows — at 500 tasks this is acceptable but at 5,000 it
would degrade. Applying the same `useVirtualScroll` hook used in List view would make
the Gantt chart scale to any dataset size.
