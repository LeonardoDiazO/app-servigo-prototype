"use client"

import * as React from "react"
import {
  technicians,
  serviceOrders,
  type ITechnician,
  type TechnicianAvailability,
  ORDER_STATUS_COLORS,
} from "@/lib/data"
import { ArrowLeft } from "lucide-react"

// ── Helpers ───────────────────────────────────────────────────────────────
const STATUS_COLOR: Record<TechnicianAvailability, string> = {
  "Disponible":  "#10b981",
  "En servicio": "#3b82f6",
  "En camino":   "#f59e0b",
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < Math.floor(rating) ? "#f59e0b" : "#d1d5db", fontSize: 14 }}>
          ★
        </span>
      ))}
      <span className="ml-1 text-[12px] text-slate-400 font-medium">{rating}</span>
    </span>
  )
}

// ── Vista Detalle ─────────────────────────────────────────────────────────
function TechnicianDetail({ tech, onBack }: { tech: ITechnician; onBack: () => void }) {
  const statusColor = STATUS_COLOR[tech.status]
  const pct = tech.ordersToday > 0
    ? Math.round((tech.ordersDoneToday / tech.ordersToday) * 100)
    : 0

  const assignedOrders = serviceOrders.filter(o => o.technicianId === tech.id)

  return (
    <div className="space-y-5 w-full max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a técnicos
      </button>

      <div className="rounded-2xl overflow-hidden border border-slate-100"
           style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        {/* Header */}
        <div
          className="px-5 py-5"
          style={{
            background: "linear-gradient(135deg, #4f46e515, #6366f105)",
            borderBottom: "3px solid #6366f1",
          }}
        >
          <div className="flex items-center gap-4 flex-wrap">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
            >
              {tech.initials}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">{tech.name}</h2>
              <p className="text-[13px] text-slate-500">{tech.specialization}</p>
              <Stars rating={tech.rating} />
            </div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold flex-shrink-0"
              style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30` }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
              {tech.status}
            </span>
          </div>
        </div>

        <div className="bg-white px-5 py-5 space-y-5">
          {/* Info grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2.5">
            {[
              ["Teléfono",      tech.phone],
              ["Zona",          tech.zone],
              ["OTs hoy",       `${tech.ordersDoneToday}/${tech.ordersToday}`],
              ["OTs este mes",  String(tech.ordersThisMonth)],
              ["Calificación",  `${tech.rating}/5.0`],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-[11px] text-slate-400">{label}</p>
                <p className="text-[13px] font-semibold text-slate-800">{val}</p>
              </div>
            ))}
          </div>

          {/* Certificaciones */}
          <div>
            <p className="text-[14px] font-bold text-slate-800 mb-2">Certificaciones</p>
            <div className="space-y-1.5">
              {tech.certifications.map((cert, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
                >
                  <span className="text-emerald-500 font-bold text-sm">✓</span>
                  <span className="text-[13px] font-medium text-emerald-800">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Productividad */}
          <div>
            <p className="text-[14px] font-bold text-slate-800 mb-2">Productividad del día</p>
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-slate-400 min-w-[90px]">Completadas</span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[12px] font-semibold text-slate-600">
                {tech.ordersDoneToday}/{tech.ordersToday}
              </span>
            </div>
          </div>

          {/* OTs asignadas */}
          {assignedOrders.length > 0 && (
            <div>
              <p className="text-[14px] font-bold text-slate-800 mb-2">OTs asignadas hoy</p>
              <div className="space-y-2">
                {assignedOrders.map(o => {
                  const oColor = ORDER_STATUS_COLORS[o.status] ?? "#9ca3af"
                  return (
                    <div
                      key={o.id}
                      className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: oColor }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-800 truncate">
                          {o.id} — {o.equipmentName}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{o.clientName}</p>
                      </div>
                      <span
                        className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0"
                        style={{ background: `${oColor}15`, color: oColor, border: `1px solid ${oColor}30` }}
                      >
                        {o.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────
export function TechnicianListComponent() {
  const [selectedTech, setSelectedTech] = React.useState<ITechnician | null>(null)

  if (selectedTech) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <TechnicianDetail tech={selectedTech} onBack={() => setSelectedTech(null)} />
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Técnicos en campo</h1>
        <p className="text-sm text-slate-400 mt-0.5">Estado y productividad de los técnicos asignados.</p>
      </div>

      <div className="space-y-3">
        {technicians.map(tech => {
          const statusColor = STATUS_COLOR[tech.status]
          const pct = tech.ordersToday > 0
            ? Math.round((tech.ordersDoneToday / tech.ordersToday) * 100)
            : 0

          return (
            <div
              key={tech.id}
              className="bg-white rounded-2xl border border-slate-100 px-4 py-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedTech(tech)}
            >
              {/* Fila superior */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
                >
                  {tech.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-slate-900">{tech.name}</p>
                  <p className="text-[12px] text-slate-500 truncate">{tech.specialization}</p>
                  <Stars rating={tech.rating} />
                </div>

                {/* Estado y zona */}
                <div className="text-right flex-shrink-0">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-semibold"
                    style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                    {tech.status}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">Zona: {tech.zone}</p>
                </div>
              </div>

              {/* Fila inferior — stats + barra */}
              <div
                className="flex items-center gap-4 mt-3 pt-3 flex-wrap"
                style={{ borderTop: "1px solid #f3f4f6" }}
              >
                <span className="text-[12px]">
                  <span className="text-slate-400">OTs hoy: </span>
                  <span className="font-bold text-indigo-600">{tech.ordersToday}</span>
                </span>
                <span className="text-[12px]">
                  <span className="text-slate-400">Completadas: </span>
                  <span className="font-bold text-emerald-600">{tech.ordersDoneToday}</span>
                </span>
                <span className="text-[12px]">
                  <span className="text-slate-400">Pendientes: </span>
                  <span className="font-bold text-amber-500">{tech.ordersToday - tech.ordersDoneToday}</span>
                </span>
                <span className="text-[12px]">
                  <span className="text-slate-400">Este mes: </span>
                  <span className="font-bold text-slate-600">{tech.ordersThisMonth}</span>
                </span>
                {/* Barra */}
                <div className="flex-1 min-w-[80px] h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
