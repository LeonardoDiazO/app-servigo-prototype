"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  equipment as initialEquipment,
  clients,
  type IEquipment,
  type EquipmentStatus,
  STATUS_COLORS,
  STATUS_LABELS,
} from "@/lib/data"
import { Search, PlusCircle, ArrowLeft, Wrench, Pencil, Trash2, QrCode } from "lucide-react"
import { EquipmentFormModal } from "./equipment-form-modal"
import { useToast } from "@/hooks/use-toast"

// ── Helpers visuales ──────────────────────────────────────────────────────
const DOT_FILTERS: { key: EquipmentStatus | "all"; label: string }[] = [
  { key: "all",    label: "Todos"                  },
  { key: "GREEN",  label: "Óptimo"                 },
  { key: "YELLOW", label: "Preventivo pendiente"   },
  { key: "RED",    label: "Correctivo requerido"   },
  { key: "GRAY",   label: "Fuera de servicio"      },
]

function StatusBadge({ status }: { status: EquipmentStatus }) {
  const color = STATUS_COLORS[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {STATUS_LABELS[status]}
    </span>
  )
}

// ── Vista de Detalle ──────────────────────────────────────────────────────
function EquipmentDetail({ eq, onBack }: { eq: IEquipment; onBack: () => void }) {
  const color = STATUS_COLORS[eq.status]
  const infoItems = [
    ["Marca",           eq.brand],
    ["Modelo",          eq.model],
    ["Serial",          eq.serial],
    ["Capacidad",       eq.capacity],
    ["Refrigerante",    eq.refrigerant],
    ["Instalación",     eq.installDate],
    ["Horas operación", eq.hoursOp],
    ["Último servicio", eq.lastService],
    ["Próximo servicio",eq.nextService],
  ]

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a equipos
      </button>

      {/* Header */}
      <div
        className="rounded-2xl overflow-hidden border"
        style={{ borderColor: `${color}40` }}
      >
        <div
          className="px-5 py-4"
          style={{
            background: `linear-gradient(135deg, ${color}15, ${color}05)`,
            borderBottom: `3px solid ${color}`,
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${color}20` }}
              >
                <span className="w-5 h-5 rounded-full" style={{ background: color }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{eq.name}</h2>
                <p className="text-sm text-slate-500">{eq.clientName} — {eq.location}</p>
              </div>
            </div>
            <StatusBadge status={eq.status} />
          </div>
        </div>

        {/* Info grid */}
        <div className="bg-white px-5 py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2.5 mb-5">
            {infoItems.map(([label, val]) => (
              <div key={label}>
                <p className="text-[11px] text-slate-400">{label}</p>
                <p
                  className="text-[13px] font-semibold"
                  style={{ color: label === "Próximo servicio" && val === "Urgente" ? "#ef4444" : "#111827" }}
                >
                  {val}
                </p>
              </div>
            ))}
          </div>

          {/* QR badge */}
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5"
               style={{ background: "#eef2ff", border: "1px solid #c7d2fe" }}>
            <QrCode className="h-5 w-5 text-indigo-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-indigo-700">Sticker QR generado</p>
              <p className="text-[12px] text-indigo-500">ID: {eq.id} | Escanear para ver ficha completa</p>
            </div>
            <button className="text-[12px] font-semibold text-indigo-600 underline underline-offset-2">
              Descargar QR
            </button>
          </div>

          {/* Historial */}
          <h3 className="text-[15px] font-bold text-slate-800 mb-3">Hoja de vida del equipo</h3>
          <div className="space-y-3">
            {(eq.history ?? []).map((h, i) => {
              const tc = h.type === "Preventivo" ? "#3b82f6" : "#ef4444"
              return (
                <div
                  key={i}
                  className="rounded-xl p-4"
                  style={{ background: "#fafafa", border: "1px solid #e5e7eb", borderLeft: `4px solid ${tc}` }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                        style={{ background: `${tc}15`, color: tc, border: `1px solid ${tc}30` }}
                      >
                        {h.type}
                      </span>
                      <span className="text-[13px] font-semibold text-slate-800">{h.date}</span>
                    </div>
                    <div className="flex gap-4 text-[11px] text-slate-400">
                      <span>🕐 {h.duration}</span>
                      <span>📷 {h.photos} fotos</span>
                    </div>
                  </div>
                  <p className="text-[12px] font-semibold text-slate-600 mb-1">Técnico: {h.technician}</p>
                  <p className="text-[12px] text-slate-500 leading-relaxed">{h.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────
export function EquipmentListComponent() {
  const [equipmentList, setEquipmentList] = React.useState<IEquipment[]>(initialEquipment)
  const [searchTerm, setSearchTerm]       = React.useState("")
  const [statusFilter, setStatusFilter]   = React.useState<EquipmentStatus | "all">("all")
  const [selectedEq, setSelectedEq]       = React.useState<IEquipment | null>(null)

  const [isModalOpen, setIsModalOpen]           = React.useState(false)
  const [editingEquipment, setEditingEquipment] = React.useState<IEquipment | null>(null)
  const [isDeleteOpen, setIsDeleteOpen]         = React.useState(false)
  const [eqToDelete, setEqToDelete]             = React.useState<IEquipment | null>(null)
  const { toast } = useToast()

  const filtered = React.useMemo(() => {
    return equipmentList.filter(eq => {
      const q = searchTerm.toLowerCase()
      const matchSearch =
        !searchTerm ||
        eq.name.toLowerCase().includes(q) ||
        eq.clientName.toLowerCase().includes(q) ||
        eq.location.toLowerCase().includes(q) ||
        eq.brand.toLowerCase().includes(q) ||
        eq.serial.toLowerCase().includes(q)
      const matchStatus = statusFilter === "all" || eq.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [equipmentList, searchTerm, statusFilter])

  const handleSave = (saved: IEquipment) => {
    const client = clients.find(c => c.id === saved.clientId)
    const enriched = { ...saved, clientName: client?.name ?? "Cliente Desconocido" }
    setEquipmentList(prev => {
      const exists = prev.some(e => e.id === enriched.id)
      return exists ? prev.map(e => e.id === enriched.id ? enriched : e) : [...prev, enriched]
    })
    toast({ title: "Equipo guardado", description: saved.name, variant: "success" })
    setIsModalOpen(false)
    setEditingEquipment(null)
  }

  const handleDelete = () => {
    if (!eqToDelete) return
    setEquipmentList(prev => prev.filter(e => e.id !== eqToDelete.id))
    toast({ title: "Equipo eliminado", description: eqToDelete.name, variant: "destructive" })
    setIsDeleteOpen(false)
    setEqToDelete(null)
  }

  // Vista detalle
  if (selectedEq) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <EquipmentDetail eq={selectedEq} onBack={() => setSelectedEq(null)} />
      </div>
    )
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestión de Equipos</h1>
            <p className="text-sm text-slate-400 mt-0.5">Registra, edita y administra los equipos de tus clientes.</p>
          </div>
          <Button onClick={() => { setEditingEquipment(null); setIsModalOpen(true) }}>
            <PlusCircle className="mr-2 h-4 w-4" /> Registrar Equipo
          </Button>
        </div>

        {/* Barra de búsqueda + filtros */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3"
             style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por nombre, cliente, marca o serial..."
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {DOT_FILTERS.map(f => {
              const active = statusFilter === f.key
              const color  = f.key !== "all" ? STATUS_COLORS[f.key as EquipmentStatus] : "#4f46e5"
              return (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key as EquipmentStatus | "all")}
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
                    className="rounded-full px-1.5 py-0 text-[10px] font-bold"
                    style={{ background: active ? `${color}25` : "#e5e7eb", color: active ? color : "#9ca3af" }}
                  >
                    {f.key === "all"
                      ? equipmentList.length
                      : equipmentList.filter(e => e.status === f.key).length}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Lista */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 p-12 text-center border-2 border-dashed rounded-2xl bg-white">
            <Wrench className="h-14 w-14 text-slate-200" />
            <h3 className="text-xl font-semibold text-slate-700">No se encontraron equipos</h3>
            <p className="text-slate-400 max-w-md text-sm">Cambia los filtros o registra el primer equipo.</p>
            <Button onClick={() => { setEditingEquipment(null); setIsModalOpen(true) }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Registrar Equipo
            </Button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map(eq => {
              const color = STATUS_COLORS[eq.status]
              const urgentNext = eq.nextService === "Urgente"
              return (
                <div
                  key={eq.id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  style={{ borderLeft: `4px solid ${color}` }}
                  onClick={() => setSelectedEq(eq)}
                >
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    {/* Dot */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}12` }}
                    >
                      <span className="w-3.5 h-3.5 rounded-full" style={{ background: color }} />
                    </div>

                    {/* Info principal */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-slate-900 truncate">{eq.name}</p>
                      <p className="text-[12px] text-slate-500 truncate">{eq.clientName} — {eq.location}</p>
                    </div>

                    {/* Info secundaria */}
                    <div className="hidden md:flex flex-col items-end gap-1 flex-shrink-0">
                      <StatusBadge status={eq.status} />
                      <span
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                        style={{
                          background: urgentNext ? "#fef2f2" : "#f9fafb",
                          color: urgentNext ? "#ef4444" : "#9ca3af",
                        }}
                      >
                        Próximo: {eq.nextService}
                      </span>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-1.5 flex-shrink-0 ml-2" onClick={e => e.stopPropagation()}>
                      <button
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        onClick={() => { setEditingEquipment(eq); setIsModalOpen(true) }}
                        title="Editar"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        onClick={() => { setEqToDelete(eq); setIsDeleteOpen(true) }}
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <EquipmentFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingEquipment(null) }}
        equipment={editingEquipment}
        onSave={handleSave}
        clients={clients}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar equipo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente &quot;{eqToDelete?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
