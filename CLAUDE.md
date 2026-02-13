# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

- `npm run dev` — Start Vite dev server (http://localhost:5173)
- `npm run build` — TypeScript check + Vite production build (`tsc -b && vite build`)
- `npm run lint` — ESLint validation
- `npm run preview` — Preview production build locally

## Architecture

**Stack:** React 19, TypeScript (strict), Tailwind CSS v4, Vite, React Router v7

### Routing

All template dashboard routes live under `/template` (defined in `src/App.tsx`):

- `/template` — Dashboard home (AppLayout wrapper with sidebar + header)
- `/template/profile`, `/template/calendar`, `/template/blank`, etc. — nested pages
- `/signin`, `/signup` — auth pages (no layout wrapper)
- `*` — 404 fallback

To add a new page: create component in `src/pages/`, add `<Route>` inside the `/template` parent route in `App.tsx`, and add nav entry in `src/layout/AppSidebar.tsx` (both `navItems` and `othersItems` arrays use absolute paths prefixed with `/template/`).

### State Management

Context API only — no Redux/Zustand:
- `src/context/ThemeContext.tsx` — light/dark theme toggle (persisted in localStorage, applies `.dark` class to `<html>`)
- `src/context/SidebarContext.tsx` — sidebar expand/collapse/hover/mobile state

### Layout System

- `src/layout/AppLayout.tsx` — wraps `SidebarProvider`, renders sidebar + header + `<Outlet>`
- `src/layout/AppSidebar.tsx` — fixed sidebar (290px expanded, 90px collapsed), responsive
- `src/layout/AppHeader.tsx` — sticky header with search (Cmd/Ctrl+K), theme toggle, notifications, user dropdown

### Component Organization

- `src/components/ui/` — atomic UI primitives (Button, Alert, Badge, Avatar, Modal, Table, Dropdown)
- `src/components/form/` — form elements (Input, Select, MultiSelect, DatePicker, DropZone, Switch)
- `src/components/charts/` — ApexCharts wrappers
- `src/components/ecommerce/` — dashboard-specific widgets (metrics, orders, maps)
- `src/components/common/` — shared utilities (PageBreadCrumb, ComponentCard, ScrollToTop, PageMeta)

### Styling

- Tailwind CSS v4 with custom theme in `src/index.css` (`@theme` block defines brand colors, shadows, z-index, typography)
- Dark mode: `@custom-variant dark (&:is(.dark *))` — toggled via `.dark` class on document root
- Custom menu utilities (`.menu-item`, `.menu-item-active`, `.menu-dropdown-item`) defined in `src/index.css`
- Third-party style overrides for ApexCharts, FullCalendar, FlatPickr, JVectorMap, Swiper in `src/index.css`
- Font: Outfit (Google Fonts, loaded via CSS import)

### Icons

SVG icons imported as React components via `vite-plugin-svgr`. All exports centralized in `src/icons/index.ts`.

### Provider Hierarchy (main.tsx)

```
StrictMode → ThemeProvider → AppWrapper (HelmetProvider) → App (Router)
```
