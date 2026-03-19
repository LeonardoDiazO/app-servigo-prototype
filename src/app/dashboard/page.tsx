"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Loader } from "lucide-react"

import { useAuth } from "@/context/auth-context"
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import {
  kpiData,
  equipment,
  serviceOrders,
  technicians,
  inventory,
  equipmentCounts,
  STATUS_COLORS,
  ORDER_STATUS_COLORS,
  type TechnicianAvailability,
} from "@/lib/data"
import { KpiCard } from "@/components/kpi-card"
import { OrderList } from "@/components/order-list"
import { EquipmentListComponent } from "@/components/equipment-list"
import { ClientListComponent } from "@/components/client-list"
import { InventoryListComponent } from "@/components/inventory-list"
import { EquipmentMap } from "@/components/equipment-map"
import { TechnicianListComponent } from "@/components/technician-list"

export type Module =
  | "Dashboard"
  | "Clientes"
  | "Equipos"
  | "Ordenes"
  | "Técnicos"
  | "Inventario"
  | "Mapa"

// ── Badge de estado ────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  "Pendiente":  { label: "Pendiente",  bg: "bg-orange-50", text: "text-orange-700", dot: "bg-[#F97316]" },
  "En Proceso": { label: "En Proceso", bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-[#2563EB]" },
  "Completado": { label: "Completada", bg: "bg-green-50",  text: "text-green-700",  dot: "bg-[#16A34A]" },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { label: status, bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

// ── Helpers locales ────────────────────────────────────────────────────────
const techStatusColor: Record<TechnicianAvailability, string> = {
  "Disponible": "#10b981",
  "En servicio": "#3b82f6",
  "En camino": "#f59e0b",
}

// ── Dashboard Content ──────────────────────────────────────────────────────
const DashboardContent = () => {
  const totalEq   = equipment.length
  const greens    = equipmentCounts["GREEN"]  ?? 0
  const yellows   = equipmentCounts["YELLOW"] ?? 0
  const reds      = equipmentCounts["RED"]    ?? 0
  const lowStock  = inventory.filter(i => i.stockStatus === "low").length

  // Traceability rows — usar serial real del equipo
  const traceabilityRows = useMemo(() => serviceOrders.slice(0, 8).map(order => {
    const eq = equipment.find(e => e.id === order.equipmentId)
    return { ...order, serial: eq?.serial ?? "—", location: eq?.location ?? "—" }
  }), [])

  return (
    <div className="space-y-8">

      {/* ── KPI Cards ─────────────────────────────────────────────────── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-[#2563EB]" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Indicadores del Día</h2>
        </div>
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </div>
      </div>

      {/* ── Semáforo + Alertas ────────────────────────────────────────── */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">

        {/* Semáforo de equipos */}
        <div
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <p className="text-[15px] font-bold text-slate-800 mb-4">Semáforo de equipos HVAC</p>
          <div className="flex gap-3 flex-wrap mb-4">
            {[
              { label: "Óptimo",     color: STATUS_COLORS.GREEN,  count: greens  },
              { label: "Preventivo", color: STATUS_COLORS.YELLOW, count: yellows },
              { label: "Correctivo", color: STATUS_COLORS.RED,    count: reds    },
            ].map(s => (
              <div
                key={s.label}
                className="flex flex-1 min-w-[110px] items-center gap-3 rounded-xl px-3 py-2.5"
                style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-extrabold"
                  style={{ background: `${s.color}18`, color: s.color }}
                >
                  {s.count}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">{s.label}</p>
                  <p className="text-[11px] text-slate-400">equipos</p>
                </div>
              </div>
            ))}
          </div>
          {/* Barra de progreso horizontal */}
          <div className="h-3.5 rounded-full overflow-hidden flex" style={{ background: "#f3f4f6" }}>
            <div style={{ width: `${(greens  / totalEq) * 100}%`, background: STATUS_COLORS.GREEN  }} />
            <div style={{ width: `${(yellows / totalEq) * 100}%`, background: STATUS_COLORS.YELLOW }} />
            <div style={{ width: `${(reds    / totalEq) * 100}%`, background: STATUS_COLORS.RED    }} />
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-slate-400">
            <span>{Math.round((greens / totalEq) * 100)}% óptimo</span>
            <span>Total: {totalEq} equipos</span>
          </div>
        </div>

        {/* Alertas activas */}
        <div
          className="bg-white rounded-2xl border border-slate-100 p-5"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <p className="text-[15px] font-bold text-slate-800 mb-4">Alertas activas</p>
          <div className="space-y-2">
            {[
              { title: "Correctivos urgentes",       desc: `${reds} equipos requieren atención inmediata`, color: "#ef4444", bg: "#fef2f2", bc: "#fecaca" },
              { title: "Preventivos vencidos",       desc: `${yellows} equipos con servicio pendiente`,    color: "#f59e0b", bg: "#fffbeb", bc: "#fef08a" },
              { title: "Stock bajo en inventario",   desc: `${lowStock} repuestos por debajo del mínimo`,  color: "#f59e0b", bg: "#fffbeb", bc: "#fef08a" },
            ].map(a => (
              <div
                key={a.title}
                className="rounded-xl px-3.5 py-2.5"
                style={{ background: a.bg, border: `1px solid ${a.bc}` }}
              >
                <p className="text-[12px] font-bold" style={{ color: a.color }}>{a.title}</p>
                <p className="text-[11px] mt-0.5" style={{ color: `${a.color}cc` }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Técnicos en campo ─────────────────────────────────────────── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-[#8b5cf6]" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Técnicos en campo hoy</h2>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {technicians.map(t => {
            const statusColor = techStatusColor[t.status]
            const pct = t.ordersToday > 0 ? Math.round((t.ordersDoneToday / t.ordersToday) * 100) : 0
            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)" }}
                  >
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 truncate">{t.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{t.zone}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                    {t.status}
                  </span>
                  <span className="text-[12px] font-bold text-indigo-600">{t.ordersDoneToday}/{t.ordersToday}</span>
                </div>
                {/* Barra de progreso */}
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Tabla de Trazabilidad ─────────────────────────────────────── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-[#F97316]" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Trazabilidad por Serial</h2>
        </div>

        <div
          className="overflow-hidden bg-white"
          style={{
            borderRadius: "1.5rem",
            border: "1px solid rgba(226,232,240,0.8)",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.04), 0 8px 10px -6px rgba(0,0,0,0.01)",
          }}
        >
          <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Actividad Reciente</h3>
              <p className="text-xs text-slate-400 mt-0.5">Historial de servicio por número de serie</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {traceabilityRows.length} registros
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Equipo</th>
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Serial</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Cliente</th>
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Fecha</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Técnico</th>
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {traceabilityRows.map(row => {
                  const orderColor = ORDER_STATUS_COLORS[row.status] ?? "#9ca3af"
                  return (
                    <tr key={row.id} className="group transition-colors hover:bg-blue-50/40">
                      <td className="px-4 md:px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                              <rect x="2" y="3" width="20" height="14" rx="2" />
                              <path d="M8 21h8M12 17v4" />
                            </svg>
                          </div>
                          <span className="font-semibold text-slate-800 leading-tight text-xs md:text-sm">{row.equipmentName}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3.5">
                        <code className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-mono font-semibold text-slate-600">
                          {row.serial}
                        </code>
                      </td>
                      <td className="hidden md:table-cell px-6 py-3.5 text-slate-600 max-w-[160px] truncate">{row.clientName}</td>
                      <td className="px-4 md:px-6 py-3.5">
                        <span className="text-xs text-slate-500">{row.date}</span>
                      </td>
                      <td className="hidden md:table-cell px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                            style={{ background: "linear-gradient(135deg, #2563EB, #1E40AF)" }}
                          >
                            {row.technicianName.charAt(0)}
                          </div>
                          <span className="text-xs text-slate-600">{row.technicianName}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                          style={{ background: `${orderColor}15`, color: orderColor, border: `1px solid ${orderColor}30` }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: orderColor }} />
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}


export default function DashboardPage() {
  const [currentModule, setCurrentModule] = useState<Module>("Dashboard")
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login")
      } else if (user.role === "TECH") {
        router.replace("/tech/mis-ordenes")
      }
    }
  }, [user, loading, router])

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav
          currentModule={currentModule}
          setCurrentModule={setCurrentModule}
        />
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col">
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-3 md:gap-8 md:p-6 lg:p-8">
            {currentModule === "Dashboard"  && <DashboardContent />}
            {currentModule === "Clientes"   && <ClientListComponent />}
            {currentModule === "Equipos"    && <EquipmentListComponent />}
            {currentModule === "Ordenes"    && <OrderList />}
            {currentModule === "Técnicos"   && <TechnicianListComponent />}
            {currentModule === "Inventario" && <InventoryListComponent />}
            {currentModule === "Mapa"       && <EquipmentMap />}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
