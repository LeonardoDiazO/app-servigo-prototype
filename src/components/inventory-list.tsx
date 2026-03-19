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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  inventory as initialInventory,
  type IInventoryItem,
  INVENTORY_CATEGORY_EMOJI,
} from "@/lib/data"
import { Search, PlusCircle, Boxes, ArrowLeft, MoreVertical, Pencil, Trash2, PlusCircle as PlusIcon, MinusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { InventoryItemFormModal } from "./inventory-item-form-modal"
import { StockAdjustmentModal } from "./stock-adjustment-modal"

// ── Vista de Detalle ──────────────────────────────────────────────────────
function InventoryDetail({ item, onBack }: { item: IInventoryItem; onBack: () => void }) {
  const isLow   = item.stockStatus === "low"
  const color   = isLow ? "#ef4444" : "#10b981"
  const pct     = Math.round((item.stock / item.maxStock) * 100)
  const barColor = pct > 50 ? "#10b981" : pct > 25 ? "#f59e0b" : "#ef4444"
  const emoji   = INVENTORY_CATEGORY_EMOJI[item.category] ?? "📦"

  return (
    <div className="space-y-5 w-full max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a inventario
      </button>

      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: `${color}40` }}>
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
              <h2 className="text-lg font-bold text-slate-900">{item.name}</h2>
              <p className="text-sm text-slate-500">{item.code} — {item.category}</p>
            </div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold"
              style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
            >
              {isLow ? "Bajo mínimo" : "Stock OK"}
            </span>
          </div>
        </div>

        <div className="bg-white px-5 py-5 space-y-5">
          {/* Imagen placeholder */}
          <div
            className="w-full h-36 rounded-xl flex items-center justify-center text-6xl"
            style={{ background: `${color}08`, border: `1px solid ${color}20` }}
          >
            {emoji}
          </div>

          {/* Contadores Stock / Min / Max */}
          <div
            className="flex items-center justify-around rounded-xl p-4"
            style={{ background: "#f9fafb" }}
          >
            <div className="text-center">
              <p className="text-4xl font-extrabold" style={{ color }}>{item.stock}</p>
              <p className="text-[12px] text-slate-500 mt-0.5">En stock</p>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="text-center">
              <p className="text-xl font-bold text-amber-500">{item.minStock}</p>
              <p className="text-[12px] text-slate-500 mt-0.5">Mínimo</p>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="text-center">
              <p className="text-xl font-bold text-slate-400">{item.maxStock}</p>
              <p className="text-[12px] text-slate-500 mt-0.5">Máximo</p>
            </div>
          </div>

          {/* Barra nivel de stock */}
          <div>
            <div className="flex justify-between text-[12px] text-slate-400 mb-1.5">
              <span>Nivel de stock</span>
              <span>{pct}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: barColor }}
              />
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {[
              ["Código",         item.code],
              ["Categoría",      item.category],
              ["Ubicación",      item.location],
              ["Precio unitario",item.unitPrice],
              ["Último ingreso", item.lastEntry],
              ["Proveedor",      item.supplier],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-[11px] text-slate-400">{label}</p>
                <p className="text-[13px] font-semibold text-slate-800">{val}</p>
              </div>
            ))}
          </div>

          {/* Alerta de reposición */}
          {isLow && (
            <div className="rounded-xl px-4 py-3" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
              <p className="text-[13px] font-bold text-red-800 mb-1">Acción requerida</p>
              <p className="text-[12px] text-red-600">
                El stock actual ({item.stock}) está por debajo del mínimo ({item.minStock}).
                Se recomienda generar orden de compra a {item.supplier} por {item.minStock * 2 - item.stock} unidades.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────
export function InventoryListComponent() {
  const [inv, setInv]           = React.useState<IInventoryItem[]>(initialInventory)
  const [searchTerm, setSearch] = React.useState("")
  const [selectedItem, setSelectedItem] = React.useState<IInventoryItem | null>(null)

  const [isFormOpen, setIsFormOpen]       = React.useState(false)
  const [editingItem, setEditingItem]     = React.useState<IInventoryItem | null>(null)
  const [isAdjOpen, setIsAdjOpen]         = React.useState(false)
  const [adjItem, setAdjItem]             = React.useState<IInventoryItem | null>(null)
  const [adjMode, setAdjMode]             = React.useState<"in" | "out">("in")
  const [isDeleteOpen, setIsDeleteOpen]   = React.useState(false)
  const [itemToDelete, setItemToDelete]   = React.useState<IInventoryItem | null>(null)
  const { toast } = useToast()

  const filtered = React.useMemo(() => {
    if (!searchTerm) return inv
    const q = searchTerm.toLowerCase()
    return inv.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.code.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      i.serials?.some(s => s.toLowerCase().includes(q))
    )
  }, [inv, searchTerm])

  const lowCount = inv.filter(i => i.stockStatus === "low").length
  const okCount  = inv.filter(i => i.stockStatus === "ok").length

  const handleSaveItem = (saved: IInventoryItem) => {
    setInv(prev => {
      const exists = prev.some(i => i.id === saved.id)
      return exists ? prev.map(i => i.id === saved.id ? saved : i) : [...prev, saved]
    })
    setIsFormOpen(false)
  }

  const handleDeleteItem = () => {
    if (!itemToDelete) return
    setInv(prev => prev.filter(i => i.id !== itemToDelete.id))
    toast({ title: "Repuesto eliminado", description: itemToDelete.name, variant: "destructive" })
    setIsDeleteOpen(false)
    setItemToDelete(null)
  }

  const handleSaveAdjustment = (item: IInventoryItem, quantity: number, serials: string[]) => {
    setInv(prev => prev.map(i => {
      if (i.id !== item.id) return i
      const newStock   = i.stock + quantity
      let   newSerials = i.serials ? [...i.serials] : []
      if (item.type === "serialized") {
        newSerials = quantity > 0
          ? [...newSerials, ...serials]
          : newSerials.filter(s => !serials.includes(s))
      }
      const newStatus = newStock <= i.minStock ? "low" : "ok"
      return { ...i, stock: newStock, serials: newSerials, stockStatus: newStatus }
    }))
  }

  // Vista detalle
  if (selectedItem) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <InventoryDetail item={selectedItem} onBack={() => setSelectedItem(null)} />
      </div>
    )
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventario de Repuestos</h1>
            <p className="text-sm text-slate-400 mt-0.5">Controla el stock de repuestos y materiales.</p>
          </div>
          <Button onClick={() => { setEditingItem(null); setIsFormOpen(true) }}>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Repuesto
          </Button>
        </div>

        {/* Filtros y búsqueda */}
        <div
          className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por nombre, código o serial..."
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <span
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium"
              style={{ background: "#ecfdf5", color: "#10b981", border: "1px solid #bbf7d030" }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Stock OK ({okCount})
            </span>
            <span
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium"
              style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca30" }}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Bajo mínimo ({lowCount})
            </span>
          </div>
        </div>

        {/* Lista */}
        {inv.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 p-12 text-center border-2 border-dashed rounded-2xl bg-white">
            <Boxes className="h-14 w-14 text-slate-200" />
            <h3 className="text-xl font-semibold text-slate-700">Tu inventario está vacío</h3>
            <Button onClick={() => { setEditingItem(null); setIsFormOpen(true) }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Agregar mi primer repuesto
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center p-10 text-slate-400 text-sm border-2 border-dashed rounded-2xl bg-white">
            No se encontraron repuestos con ese criterio.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map(item => {
              const isLow    = item.stockStatus === "low"
              const color    = isLow ? "#ef4444" : "#10b981"
              const pct      = Math.round((item.stock / item.maxStock) * 100)
              const barColor = pct > 50 ? "#10b981" : pct > 25 ? "#f59e0b" : "#ef4444"
              const emoji    = INVENTORY_CATEGORY_EMOJI[item.category] ?? "📦"

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  style={{ borderLeft: `4px solid ${color}` }}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="px-4 py-3.5">
                    <div className="flex items-center gap-4">
                      {/* Emoji categoría */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: `${color}10` }}
                      >
                        {emoji}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[12px] text-slate-500">{item.code} — {item.category} — {item.location}</p>
                        {/* Barra de stock */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden max-w-[160px]">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, background: barColor }}
                            />
                          </div>
                          <span className="text-[11px] text-slate-400">{pct}%</span>
                        </div>
                      </div>

                      {/* Stock número grande */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-extrabold" style={{ color }}>{item.stock}</p>
                        <p className="text-[11px] text-slate-400">Mín: {item.minStock}</p>
                      </div>

                      {/* Acciones */}
                      <div className="flex-shrink-0 ml-1" onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setAdjItem(item); setAdjMode("in"); setIsAdjOpen(true) }}>
                              <PlusIcon className="mr-2 h-4 w-4" /> Entrada
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => { setAdjItem(item); setAdjMode("out"); setIsAdjOpen(true) }}
                              disabled={item.stock === 0}
                            >
                              <MinusCircle className="mr-2 h-4 w-4" /> Consumir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setEditingItem(item); setIsFormOpen(true) }}>
                              <Pencil className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => { setItemToDelete(item); setIsDeleteOpen(true) }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Alerta inline */}
                    {isLow && (
                      <div className="mt-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-red-700"
                           style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
                        Reposición requerida — Proveedor: {item.supplier}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <InventoryItemFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        item={editingItem}
        onSave={handleSaveItem}
      />

      <StockAdjustmentModal
        isOpen={isAdjOpen}
        onClose={() => setIsAdjOpen(false)}
        item={adjItem}
        mode={adjMode}
        onSave={handleSaveAdjustment}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar repuesto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente &quot;{itemToDelete?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
