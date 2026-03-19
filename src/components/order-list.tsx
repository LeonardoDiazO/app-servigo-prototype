"use client"

import * as React from "react"
import { serviceOrders, type IServiceOrder, type ServiceOrderStatus, ORDER_STATUS_COLORS } from "@/lib/data"
import { PlusCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { OrderServiceForm } from "./order-service-form"

// ── Helpers ───────────────────────────────────────────────────────────────
const ORDER_STATUS_LABELS: Record<ServiceOrderStatus, string> = {
  "Completado":   "Completada",
  "En Ejecución": "En ejecución",
  "Asignada":     "Asignada",
  "Pendiente":    "Pendiente",
  "En Proceso":   "En proceso",
}

const STATUS_FILTERS: { key: ServiceOrderStatus | "all"; label: string }[] = [
  { key: "all",          label: "Todas"       },
  { key: "Completado",   label: "Completada"  },
  { key: "En Ejecución", label: "En ejecución"},
  { key: "Asignada",     label: "Asignada"    },
  { key: "Pendiente",    label: "Pendiente"   },
]

function OrderBadge({ status }: { status: ServiceOrderStatus }) {
  const color = ORDER_STATUS_COLORS[status] ?? "#9ca3af"
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {ORDER_STATUS_LABELS[status] ?? status}
    </span>
  )
}

// ── Vista de Detalle ──────────────────────────────────────────────────────
function OrderDetail({ order, onBack }: { order: IServiceOrder; onBack: () => void }) {
  const color    = ORDER_STATUS_COLORS[order.status] ?? "#9ca3af"
  const typeColor = order.type === "Preventivo" ? "#3b82f6" : "#ef4444"
  const doneCL   = order.checklist.filter(c => c.done).length
  const pct      = order.checklist.length > 0
    ? Math.round((doneCL / order.checklist.length) * 100)
    : 0

  const infoItems = [
    ["Técnico",       order.technicianName],
    ["Prioridad",     order.priority],
    ["Fecha",         order.date],
    ["Hora inicio",   order.startTime],
    ["Hora fin",      order.endTime],
    ["Firma cliente", order.clientSigned ? "✅ Firmado" : "⏳ Pendiente"],
  ]

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a órdenes
      </button>

      <div
        className="rounded-2xl overflow-hidden border"
        style={{ borderColor: `${color}40` }}
      >
        {/* Header */}
        <div
          className="px-5 py-4"
          style={{
            background: `linear-gradient(135deg, ${color}15, ${color}05)`,
            borderBottom: `3px solid ${color}`,
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{order.id}</h2>
              <p className="text-sm text-slate-500">{order.equipmentName} — {order.clientName}</p>
            </div>
            <div className="flex gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold"
                style={{ background: `${typeColor}15`, color: typeColor, border: `1px solid ${typeColor}30` }}
              >
                {order.type}
              </span>
              <OrderBadge status={order.status} />
            </div>
          </div>
        </div>

        <div className="bg-white px-5 py-4 space-y-5">
          {/* Info grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2.5">
            {infoItems.map(([label, val]) => (
              <div key={label}>
                <p className="text-[11px] text-slate-400">{label}</p>
                <p
                  className="text-[13px] font-semibold"
                  style={{
                    color: label === "Prioridad" && val === "Urgente"
                      ? "#ef4444"
                      : "#111827",
                  }}
                >
                  {val}
                </p>
              </div>
            ))}
          </div>

          {/* Descripción */}
          <p className="text-[13px] text-slate-600 leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-100">
            {order.description}
          </p>

          {/* Checklist */}
          {order.checklist.length > 0 && (
            <div>
              <p className="text-[14px] font-bold text-slate-800 mb-3">Checklist de servicio</p>
              <div className="space-y-1.5 mb-3">
                {order.checklist.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-xl"
                    style={{
                      background: c.done ? "#f0fdf4" : "#fefce8",
                      border: `1px solid ${c.done ? "#bbf7d0" : "#fef08a"}`,
                    }}
                  >
                    <span className="text-base flex-shrink-0">{c.done ? "✅" : "⬜"}</span>
                    <div>
                      <p className="text-[12px] font-medium text-slate-800">{c.item}</p>
                      {c.value && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{c.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[12px] text-slate-400 flex-shrink-0">
                  Progreso: {doneCL}/{order.checklist.length}
                </p>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <p className="text-[12px] font-semibold text-slate-600 flex-shrink-0">{pct}%</p>
              </div>
            </div>
          )}

          {/* Repuestos */}
          {order.usedParts.length > 0 && (
            <div>
              <p className="text-[14px] font-bold text-slate-800 mb-3">Repuestos utilizados</p>
              <div className="space-y-2">
                {order.usedParts.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <span className="text-base">🔧</span>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">{p.name}</p>
                      <p className="text-[11px] text-slate-400">Serial: {p.serial} | Cant: {p.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────
export function OrderList() {
  const [orders, setOrders]           = React.useState<IServiceOrder[]>(serviceOrders)
  const [statusFilter, setStatusFilter] = React.useState<ServiceOrderStatus | "all">("all")
  const [selectedOrder, setSelectedOrder] = React.useState<IServiceOrder | null>(null)
  const [isCreateOpen, setIsCreateOpen]   = React.useState(false)

  const filtered = React.useMemo(() =>
    statusFilter === "all" ? orders : orders.filter(o => o.status === statusFilter),
    [orders, statusFilter]
  )

  // Vista detalle
  if (selectedOrder) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />
      </div>
    )
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Agenda y Órdenes</h1>
            <p className="text-sm text-slate-400 mt-0.5">Gestiona el ciclo de vida de los servicios.</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="btn-gradient shadow-md">
            <PlusCircle className="mr-2 h-4 w-4" /> Nueva Orden
          </Button>
        </div>

        {/* Filtros de estado */}
        <div
          className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-2 flex-wrap"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          {STATUS_FILTERS.map(f => {
            const active = statusFilter === f.key
            const color  = f.key !== "all" ? (ORDER_STATUS_COLORS[f.key as ServiceOrderStatus] ?? "#4f46e5") : "#4f46e5"
            return (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key as ServiceOrderStatus | "all")}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all"
                style={
                  active
                    ? { background: `${color}18`, color, border: `1px solid ${color}40` }
                    : { background: "#f9fafb", color: "#6b7280", border: "1px solid #e5e7eb" }
                }
              >
                {f.key !== "all" && (
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                )}
                {f.label}
                <span
                  className="rounded-full px-1.5 text-[10px] font-bold"
                  style={{ background: active ? `${color}25` : "#e5e7eb", color: active ? color : "#9ca3af" }}
                >
                  {f.key === "all"
                    ? orders.length
                    : orders.filter(o => o.status === f.key).length}
                </span>
              </button>
            )
          })}
        </div>

        {/* Lista */}
        <div className="space-y-2.5">
          {filtered.map(order => {
            const color     = ORDER_STATUS_COLORS[order.status] ?? "#9ca3af"
            const typeColor = order.type === "Preventivo" ? "#3b82f6" : "#ef4444"
            const doneCL    = order.checklist.filter(c => c.done).length
            const pct       = order.checklist.length > 0
              ? Math.round((doneCL / order.checklist.length) * 100)
              : null

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                style={{ borderLeft: `4px solid ${color}` }}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="px-4 py-3.5">
                  <div className="flex items-start gap-3">
                    <span className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[14px] font-bold text-slate-900">{order.id}</span>
                        <span
                          className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold"
                          style={{ background: `${typeColor}12`, color: typeColor, border: `1px solid ${typeColor}25` }}
                        >
                          {order.type}
                        </span>
                        {order.priority === "Urgente" && (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-100">
                            URGENTE
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-slate-500 truncate mb-1">
                        {order.equipmentName} — {order.clientName}
                      </p>
                      {pct !== null && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[11px] text-slate-400">Checklist: {doneCL}/{order.checklist.length}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden max-w-[120px]">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, background: color }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <OrderBadge status={order.status} />
                      <span className="text-[12px] font-medium text-slate-600">{order.technicianName}</span>
                      <span className="text-[11px] text-slate-400">{order.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 p-12 text-center border-2 border-dashed rounded-2xl bg-white">
              <p className="text-slate-400 text-sm">No hay órdenes con este estado.</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-0 bg-transparent shadow-none">
          <OrderServiceForm onClose={() => setIsCreateOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
