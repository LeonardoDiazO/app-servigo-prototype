"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import {
  equipment as allEquipments,
  clients as allClients,
  type IEquipment,
  type IClient,
  type EquipmentStatus,
  STATUS_COLORS,
  STATUS_LABELS,
  getClientWorstStatus,
} from "@/lib/data"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"

// ── Leaflet se carga sólo en el cliente (sin SSR) ─────────────────────────
const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false })

// ── Badge de estado ───────────────────────────────────────────────────────
function StatusBadge({ status }: { status: EquipmentStatus }) {
  const color = STATUS_COLORS[status]
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {STATUS_LABELS[status]}
    </span>
  )
}

// ── Panel lateral de cliente ──────────────────────────────────────────────
function ClientPanel({
  client,
  equipments,
  onClose,
}: {
  client: IClient
  equipments: IEquipment[]
  onClose: () => void
}) {
  const worstStatus = getClientWorstStatus(client.id)
  const color       = STATUS_COLORS[worstStatus]

  const counts = {
    RED:    equipments.filter(e => e.status === "RED").length,
    YELLOW: equipments.filter(e => e.status === "YELLOW").length,
    GREEN:  equipments.filter(e => e.status === "GREEN").length,
  }

  return (
    <div
      className="absolute right-0 top-0 h-full w-[340px] bg-white flex flex-col z-[1000] shadow-xl"
      style={{ borderLeft: "1px solid #e5e7eb", animation: "slideIn .25s ease" }}
    >
      <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>

      {/* Header */}
      <div
        className="p-4 flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${color}10, ${color}04)`,
          borderBottom: `3px solid ${color}`,
        }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
            <p className="text-[16px] font-bold text-slate-900 truncate">{client.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[12px] text-slate-500 mb-1">{client.address}</p>
        <p className="text-[12px] text-slate-500">{client.contact} · {client.phone}</p>

        {/* Mini contadores */}
        <div className="flex gap-2 mt-3">
          {counts.RED > 0 && (
            <div className="flex-1 rounded-xl py-2 text-center"
                 style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
              <p className="text-xl font-extrabold text-red-500">{counts.RED}</p>
              <p className="text-[10px] font-bold text-red-400">CORRECTIVO</p>
            </div>
          )}
          {counts.YELLOW > 0 && (
            <div className="flex-1 rounded-xl py-2 text-center"
                 style={{ background: "#fffbeb", border: "1px solid #fef08a" }}>
              <p className="text-xl font-extrabold text-amber-500">{counts.YELLOW}</p>
              <p className="text-[10px] font-bold text-amber-400">PREVENTIVO</p>
            </div>
          )}
          <div className="flex-1 rounded-xl py-2 text-center"
               style={{ background: "#ecfdf5", border: "1px solid #bbf7d0" }}>
            <p className="text-xl font-extrabold text-emerald-500">{counts.GREEN}</p>
            <p className="text-[10px] font-bold text-emerald-400">ÓPTIMO</p>
          </div>
        </div>
      </div>

      {/* Lista de equipos */}
      <p className="text-[13px] font-bold text-slate-700 px-4 pt-3 pb-1 flex-shrink-0">
        Equipos ({equipments.length}) — por prioridad
      </p>
      <ScrollArea className="flex-1 px-3 pb-3">
        <div className="space-y-2">
          {[...equipments]
            .sort((a, b) => {
              const order = { RED: 0, YELLOW: 1, GREEN: 2, GRAY: 3 }
              return order[a.status] - order[b.status]
            })
            .map(eq => {
              const eqColor    = STATUS_COLORS[eq.status]
              const urgentNext = eq.nextService === "Urgente"
              return (
                <div
                  key={eq.id}
                  className="rounded-xl p-3 bg-white"
                  style={{ border: "1px solid #f3f4f6", borderLeft: `4px solid ${eqColor}` }}
                >
                  <div className="flex items-start gap-2.5 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${eqColor}12` }}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ background: eqColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-slate-900 truncate">{eq.name}</p>
                      <StatusBadge status={eq.status} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] mt-1">
                    <span className="text-slate-400">Marca:</span>
                    <span className="text-slate-600 font-medium">{eq.brand}</span>
                    <span className="text-slate-400">Modelo:</span>
                    <span className="text-slate-600 font-medium">{eq.model}</span>
                    <span className="text-slate-400">Últ. serv.:</span>
                    <span className="text-slate-600 font-medium">{eq.lastService}</span>
                  </div>
                  <div
                    className="mt-2 inline-block text-[11px] font-semibold rounded-md px-2 py-0.5"
                    style={{
                      background: urgentNext ? "#fef2f2" : "#f9fafb",
                      color: urgentNext ? "#ef4444" : "#9ca3af",
                    }}
                  >
                    Próximo: {eq.nextService}
                  </div>
                </div>
              )
            })}
        </div>
      </ScrollArea>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────
export function EquipmentMap() {
  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(null)

  const selectedClient   = allClients.find(c => c.id === selectedClientId)
  const clientEquipments = allEquipments.filter(eq => eq.clientId === selectedClientId)

  const totalEq = allEquipments.length
  const reds    = allEquipments.filter(e => e.status === "RED").length
  const yellows = allEquipments.filter(e => e.status === "YELLOW").length
  const greens  = allEquipments.filter(e => e.status === "GREEN").length

  return (
    <div className="w-full space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Mapa de Operaciones</h1>
        <p className="text-sm text-slate-400 mt-0.5">Ubicación de clientes y estado de sus equipos en Bogotá.</p>
      </div>

      {/* Contenedor del mapa */}
      <div
        className="relative w-full rounded-2xl overflow-hidden isolate"
        style={{
          height: "calc(100vh - 220px)",
          minHeight: 460,
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Leyenda superior — z-index alto para estar sobre el mapa */}
        <div className="absolute top-3 left-3 z-[1000] flex gap-2 flex-wrap">
          {[
            { color: STATUS_COLORS.RED,    count: reds,    label: "Correctivo" },
            { color: STATUS_COLORS.YELLOW, count: yellows, label: "Preventivo" },
            { color: STATUS_COLORS.GREEN,  count: greens,  label: "Óptimo"     },
          ].map(l => (
            <div
              key={l.label}
              className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-[12px]"
              style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.15)", border: `1px solid ${l.color}30` }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
              <span className="font-bold" style={{ color: l.color }}>{l.count}</span>
              <span className="text-slate-500">{l.label}</span>
            </div>
          ))}
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-[12px]"
            style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}
          >
            <span className="font-bold text-indigo-600">{allClients.length}</span>
            <span className="text-slate-500">Clientes</span>
            <span className="font-bold text-indigo-600 ml-1">{totalEq}</span>
            <span className="text-slate-500">Equipos</span>
          </div>
        </div>

        {/* Lista de clientes overlay — inferior izquierdo */}
        <div
          className="absolute bottom-3 left-3 z-[1000] rounded-xl p-3"
          style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,.15)", maxWidth: 260 }}
        >
          <p className="text-[12px] font-bold text-slate-700 mb-2">Clientes en el mapa</p>
          <div className="space-y-0.5">
            {allClients.map(c => {
              const ws    = getClientWorstStatus(c.id)
              const col   = STATUS_COLORS[ws]
              const eqCnt = allEquipments.filter(e => e.clientId === c.id).length
              const isSelected = selectedClientId === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedClientId(prev => prev === c.id ? null : c.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors"
                  style={{ background: isSelected ? `${col}12` : "transparent" }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: col }} />
                  <span className="text-[12px] font-semibold text-slate-800 flex-1 truncate">{c.name}</span>
                  <span className="text-[11px] text-slate-400 flex-shrink-0">{eqCnt} eq.</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Mapa Leaflet real */}
        <LeafletMap
          clients={allClients}
          selectedClientId={selectedClientId}
          onClientClick={(id) => setSelectedClientId(prev => prev === id ? null : id)}
        />

        {/* Panel lateral de detalle */}
        {selectedClient && (
          <ClientPanel
            client={selectedClient}
            equipments={clientEquipments}
            onClose={() => setSelectedClientId(null)}
          />
        )}
      </div>
    </div>
  )
}
