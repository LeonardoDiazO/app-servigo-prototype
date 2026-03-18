"use client"

import Link from "next/link"
import { IServiceOrder, ServiceOrderStatus, EquipmentHealth } from "@/lib/data"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Clock, MapPin, HardHat, CheckCircle } from "lucide-react"

const healthColorMap: Record<EquipmentHealth, string> = {
  Crítico: "border-destructive text-destructive bg-destructive/10",
  Preventivo: "border-warning text-warning-foreground bg-warning/10",
  OK: "border-green-500 text-green-600 bg-green-500/10",
};

const healthTextMap: Record<EquipmentHealth, string> = {
  Crítico: "Urgente",
  Preventivo: "Preventivo",
  OK: "Rutinario",
};

const statusBadgeMap: Record<ServiceOrderStatus, string> = {
    Pendiente: "bg-muted text-muted-foreground",
    "En Proceso": "bg-primary/20 text-primary",
    Completado: "bg-success/20 text-success-foreground"
}

export function TechServiceOrderCard({ order }: { order: IServiceOrder }) {
  return (
    <Card className="sg-card flex w-full flex-col">
      <CardHeader>
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-bold">{order.time}</CardTitle>
            </div>
            <Badge className={cn(healthColorMap[order.equipmentHealth], "font-bold")}>
                {healthTextMap[order.equipmentHealth]}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">CLIENTE</p>
          <p className="font-bold">{order.clientName}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground">EQUIPO</p>
          <p>{order.equipmentName}</p>
        </div>
        <div className="flex items-start gap-2">
           <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground mt-0.5" />
           <p className="text-sm text-muted-foreground">{order.address}</p>
        </div>
         <div className="flex items-center justify-between">
            <Badge variant="outline" className={cn("capitalize", statusBadgeMap[order.status])}>
                {order.status}
            </Badge>
             {order.status === "Completado" && <CheckCircle className="h-5 w-5 text-success" />}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full btn-gradient text-white">
          <Link href={`/tech/mis-ordenes/${order.id}`}>
            <HardHat className="mr-2" />
            {order.status === "Completado" ? "Ver Detalle" : "Gestionar Servicio"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
