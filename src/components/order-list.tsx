"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { serviceOrders, equipment, technicians, type IServiceOrder, type ServiceOrderStatus } from "@/lib/data"
import { PlusCircle, CalendarDays, MapPin, User, ChevronRight, PenSquare, Trash2 } from "lucide-react"
import { OrderServiceForm } from "./order-service-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const statusConfig: Record<ServiceOrderStatus, { color: string, border: string }> = {
  "Pendiente": { color: "bg-orange-100 text-orange-800", border: "border-orange-200" },
  "En Proceso": { color: "bg-blue-100 text-blue-800", border: "border-blue-200" },
  "Completado": { color: "bg-green-100 text-green-800", border: "border-green-200" },
}

export function OrderList() {
  const [orders, setOrders] = React.useState<IServiceOrder[]>(serviceOrders)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  const pendingCount = orders.filter(o => o.status === "Pendiente").length
  const inProcessCount = orders.filter(o => o.status === "En Proceso").length
  const completedCount = orders.filter(o => o.status === "Completado").length

  const handleStatusChange = (id: string, newStatus: ServiceOrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
  }

  const Column = ({ title, count, status, children }: { title: string, count: number, status: ServiceOrderStatus, children: React.ReactNode }) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          {title}
          <Badge variant="secondary" className="rounded-full text-xs px-2 shadow-none">{count}</Badge>
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  )

  const OrderCard = ({ order }: { order: IServiceOrder }) => {
    const cfg = statusConfig[order.status]
    return (
      <Card className={cn("p-1 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white overflow-hidden", cfg.border)}>
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex justify-between items-start gap-2">
            <span className="font-bold text-sm text-slate-900 leading-tight">{order.clientName}</span>
            <span className={cn("text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap", cfg.color)}>
              {order.status}
            </span>
          </div>
          
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
              <span className="line-clamp-2">{order.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <PenSquare className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-medium">{order.equipmentName}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-blue-500" />
              <span>{order.technicianName}</span>
            </div>
          </div>
          
          <div className="mt-1 pt-3 border-t flex items-center justify-between">
            <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {order.time}
            </div>
            
            {/* Quick Actions based on status */}
            <div className="flex gap-2">
              {order.status === "Pendiente" && (
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleStatusChange(order.id, "En Proceso")}>
                  Iniciar
                </Button>
              )}
              {order.status === "En Proceso" && (
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleStatusChange(order.id, "Completado")}>
                  Completar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Agenda y Órdenes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona el ciclo de vida de los servicios: crear, asignar, mover.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="btn-gradient shadow-md">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Orden
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <Column title="Pendientes" count={pendingCount} status="Pendiente">
            {orders.filter(o => o.status === "Pendiente").map(o => <OrderCard key={o.id} order={o} />)}
            {pendingCount === 0 && <div className="text-xs text-center text-slate-400 py-6 border-2 border-dashed rounded-xl">No hay órdenes pendientes</div>}
          </Column>
          
          <Column title="En Proceso" count={inProcessCount} status="En Proceso">
            {orders.filter(o => o.status === "En Proceso").map(o => <OrderCard key={o.id} order={o} />)}
            {inProcessCount === 0 && <div className="text-xs text-center text-slate-400 py-6 border-2 border-dashed rounded-xl">Ningún técnico en ruta</div>}
          </Column>

          <Column title="Completadas" count={completedCount} status="Completado">
            {orders.filter(o => o.status === "Completado").slice(0, 10).map(o => <OrderCard key={o.id} order={o} />)}
            {completedCount === 0 && <div className="text-xs text-center text-slate-400 py-6 border-2 border-dashed rounded-xl">Sin cierres recientes</div>}
          </Column>
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
