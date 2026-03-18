# 🗺️ Plan de Migración: Next.js → Angular

> **Estado:** Fase 1 completada (boceto funcional en Next.js 15)  
> **Siguiente fase:** Migración del frontend a Angular

---

## Contexto

Este repositorio es el **boceto de alta fidelidad (Fase 1)** de ServiGo One, construido en Next.js 15 + React 19 para validar el diseño, la UX y la lógica de negocio de forma rápida.

La **Fase 2** consiste en migrar el frontend a **Angular** (v19/v20), manteniendo este boceto como referencia de diseño y arquitectura.

---

## Qué SÍ se reutiliza de este boceto

| Elemento | Archivo(s) | Cómo se usa |
|---|---|---|
| Variables de diseño CSS | `src/app/globals.css` | Copiar directamente a `src/styles.css` de Angular |
| Configuración de Tailwind | `tailwind.config.ts` | Reutilizar sin cambios |
| Modelos de datos TypeScript | `src/lib/data.ts` | Copiar interfaces como modelos de Angular (`*.model.ts`) |
| Paleta de colores y tipografía | `globals.css` → `:root {}` | Mantener las CSS variables exactas |
| Arquitectura de módulos | Dashboard, Clientes, Equipos, Órdenes, Inventario | Misma estructura, ahora como `NgModule` o módulos standalone |
| Diseño visual | Login, KPIs, Tabla de trazabilidad | Usar como referencia pixel-perfect para los templates Angular |
| Lógica de negocio | Cálculos de KPIs, filtros, estados | Mover a **Services** de Angular |

---

## Qué hay que reconstruir en Angular

### Componentes (React → Angular)

| Componente React | Equivalente Angular |
|---|---|
| `kpi-card.tsx` | `kpi-card.component.ts` + template HTML |
| `sidebar-nav.tsx` | `sidebar-nav.component.ts` + `MatSidenav` o custom |
| `header.tsx` | `header.component.ts` |
| `login/page.tsx` | `LoginComponent` con `ReactiveFormsModule` |
| `dashboard/page.tsx` | `DashboardComponent` con rutas lazy-loaded |
| shadcn/ui (Radix) | **Angular Material** o **PrimeNG** |

### Estado y lógica

| React | Angular |
|---|---|
| `useState` / `useReducer` | **Signals** (`signal()`, `computed()`) — Angular v17+ |
| `useEffect` | `effect()` o lifecycle hooks (`ngOnInit`) |
| `useMemo` | `computed()` de Signals |
| `Context API` (`auth-context.tsx`) | **Injectable Service** + `signal()` |
| `next/navigation` (`useRouter`) | **Angular Router** (`inject(Router)`) |
| `next/font` | Import en `index.html` desde Google Fonts |

### Backend / APIs

| Servicio actual | Solución en Fase 2 |
|---|---|
| **Genkit AI flows** (server-side en Next.js) | Mover a un **backend separado** (NestJS recomendado — mismo ecosistema TypeScript) |
| Firebase Auth | Firebase Auth SDK funciona igual en Angular |
| `src/lib/data.ts` (datos mock) | Reemplazar con llamadas `HttpClient` a la API real |

---

## Arquitectura propuesta para Angular (Fase 2)

```
servigo-angular/                  ← nuevo proyecto
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── auth/             ← AuthService (con signals)
│   │   │   ├── interceptors/     ← HTTP interceptors (token, error)
│   │   │   └── guards/           ← AuthGuard, RoleGuard
│   │   ├── shared/
│   │   │   ├── components/       ← KpiCard, StatusBadge, etc.
│   │   │   ├── models/           ← IClient, IEquipment, IServiceOrder
│   │   │   └── services/         ← DataService, ApiService
│   │   ├── features/
│   │   │   ├── dashboard/        ← DashboardModule (lazy)
│   │   │   ├── clientes/         ← ClientesModule (lazy)
│   │   │   ├── equipos/          ← EquiposModule (lazy)
│   │   │   ├── ordenes/          ← OrdenesModule (lazy)
│   │   │   └── inventario/       ← InventarioModule (lazy)
│   │   └── layout/
│   │       ├── header/
│   │       └── sidebar/
│   └── styles.css                ← ← design tokens de globals.css de este boceto

servigo-api/                      ← backend NestJS (nuevo)
├── src/
│   ├── ai/                       ← flujos Genkit migrados como endpoints
│   ├── auth/
│   ├── equipos/
│   └── ordenes/
```

---

## Decisiones de stack para Fase 2

| Decisión | Opción A | Opción B | Recomendado |
|---|---|---|---|
| UI Components | Angular Material | PrimeNG | **Angular Material** (más integrado) |
| Estado | NgRx | Signals puras | **Signals** (más simple para este tamaño) |
| Backend API | NestJS | Express | **NestJS** (TypeScript nativo, decoradores similares a Angular) |
| CSS | Tailwind CSS | Angular Material theming | **Tailwind CSS** (reutiliza este boceto) |
| Estado del servidor | TanStack Query (Angular) | RxJS + Services | **RxJS + Services** (estándar Angular) |

---

## Pasos de migración

### Fase 2.1 — Scaffold y design system
- [ ] `ng new servigo-angular --standalone --routing --style=css`
- [ ] Instalar Tailwind CSS en Angular
- [ ] Copiar `globals.css` → `styles.css` (design tokens)
- [ ] Copiar `tailwind.config.ts`
- [ ] Configurar fuente Plus Jakarta Sans en `index.html`

### Fase 2.2 — Core y autenticación
- [ ] Crear `AuthService` con Signals replicando `auth-context.tsx`
- [ ] Implementar `AuthGuard` y `RoleGuard`
- [ ] Configurar Angular Router con rutas lazy
- [ ] Crear Layout (Header + Sidebar) con `MatSidenav`

### Fase 2.3 — Componentes compartidos
- [ ] `KpiCardComponent` (replicar diseño del boceto)
- [ ] `StatusBadgeComponent`
- [ ] `DataTableComponent` (tabla de trazabilidad)
- [ ] Instalar Angular Material y configurar el tema

### Fase 2.4 — Features (módulo por módulo)
- [ ] `DashboardComponent` — KPIs + tabla de actividad
- [ ] `ClientesComponent` — CRUD de clientes
- [ ] `EquiposComponent` — CRUD de equipos
- [ ] `OrdenesComponent` — Gestión de órdenes de servicio
- [ ] `InventarioComponent` — Control de inventario

### Fase 2.5 — Backend API (NestJS)
- [ ] `POST /auth/login` · `GET /auth/me`
- [ ] CRUD `/clientes`, `/equipos`, `/ordenes`, `/inventario`
- [ ] `POST /ai/insight` — Genkit flow migrado como endpoint REST

### Fase 2.6 — Integración y QA
- [ ] Conectar Angular con la API via `HttpClient`
- [ ] Implementar HTTP interceptors (Bearer token)
- [ ] Tests unitarios de servicios y componentes
- [ ] Pruebas responsive mobile-first

---

## Referencias de diseño

Todos los diseños visuales están implementados en este boceto:
- **Login**: [`src/app/login/page.tsx`](./src/app/login/page.tsx)
- **Dashboard / KPIs**: [`src/app/dashboard/page.tsx`](./src/app/dashboard/page.tsx)
- **Sidebar**: [`src/components/sidebar-nav.tsx`](./src/components/sidebar-nav.tsx)
- **Design tokens**: [`src/app/globals.css`](./src/app/globals.css)
- **Paleta / Tipografía**: [`tailwind.config.ts`](./tailwind.config.ts)

---

*Documento creado el 2026-03-18 · Fase 1 completada con Next.js 15*
