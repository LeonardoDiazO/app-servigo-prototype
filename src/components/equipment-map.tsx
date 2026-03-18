"use client"

import * as React from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { IEquipment, IClient, equipment as allEquipments, clients as allClients } from "@/lib/data"
import { MapPin, Building, Activity, Wrench, ShieldAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// Hardcoded positions for clients on the map
const clientPositions: Record<string, { top: string, left: string }> = {
  "c1": { top: '35%', left: '40%' },
  "c2": { top: '60%', left: '65%' },
}

const defaultPosition = { top: '50%', left: '50%' }

export function EquipmentMap() {
  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(allClients[0]?.id || null)

  const selectedClient = allClients.find(c => c.id === selectedClientId)
  const clientEquipments = allEquipments.filter(eq => eq.clientId === selectedClientId)

  const criticalCount = clientEquipments.filter(e => e.status === 'critico').length
  const okCount = clientEquipments.filter(e => e.status === 'ok').length

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-[calc(100vh-140px)] min-h-[500px]">
      
      {/* MAP VIEW - LEFT SIDE */}
      <Card className="flex-1 overflow-hidden flex flex-col shadow-md">
        <CardHeader className="bg-slate-50 border-b py-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-blue-600" />
            Mapa de Operaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 relative flex-1 bg-slate-100 min-h-[300px]">
          <Image 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&h=800&fit=crop"
            alt="Mapa Global"
            fill
            className="object-cover opacity-90 saturate-50"
          />
          
          <TooltipProvider>
            {allClients.map((client) => {
              const pos = clientPositions[client.id] || defaultPosition
              const isSelected = selectedClientId === client.id
              // Find if this client has any critical equipment
              const hasCritical = allEquipments.some(eq => eq.clientId === client.id && eq.status === 'critico')
              
              return (
                <Tooltip key={client.id}>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => setSelectedClientId(client.id)}
                      className={cn(
                        "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all p-1 z-10",
                        isSelected ? "scale-125 z-20" : "hover:scale-110",
                      )}
                      style={{ top: pos.top, left: pos.left }}
                    >
                      <div className="relative">
                        <MapPin 
                          className={cn(
                            "h-8 w-8 drop-shadow-md",
                            hasCritical ? "text-orange-500 fill-orange-500/20" : "text-blue-600 fill-blue-600/20",
                            isSelected && "text-indigo-700 fill-indigo-700/30 scale-110 drop-shadow-xl"
                          )} 
                        />
                        {hasCritical && (
                          <span className="absolute top-0 right-0 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                          </span>
                        )}
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="font-semibold px-3 py-1.5 bg-slate-900 border-none shadow-xl">
                    <p>{client.name}</p>
                    <p className="text-xs font-normal text-slate-300">{client.address}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* SIDE VIEW - RIGHT SIDE */}
      <Card className="w-full lg:w-[400px] flex flex-col shadow-md">
        <CardHeader className="bg-slate-50 border-b py-4">
           {selectedClient ? (
             <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building className="h-5 w-5 text-indigo-600" />
                {selectedClient.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{selectedClient.address}</p>
             </div>
           ) : (
             <CardTitle className="text-lg">Detalles de Sede</CardTitle>
           )}
        </CardHeader>
        
        {selectedClient ? (
          <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
            <div className="grid grid-cols-2 gap-px bg-slate-100 border-b">
              <div className="bg-white p-4 text-center">
                <div className="text-2xl font-bold text-slate-800">{okCount + criticalCount}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Equipos</div>
              </div>
              <div className="bg-white p-4 text-center">
                <div className={cn("text-2xl font-bold", criticalCount > 0 ? "text-orange-600" : "text-green-600")}>
                  {criticalCount}
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Críticos</div>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-500" />
                Estado de Equipos
              </h4>
              <div className="flex flex-col gap-3">
                {clientEquipments.length > 0 ? clientEquipments.map((eq) => (
                  <div key={eq.id} className={cn(
                    "p-3 rounded-lg border flex flex-col gap-2 transition-colors",
                    eq.status === 'critico' ? "bg-orange-50/50 border-orange-100" : "bg-white border-slate-100"
                  )}>
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-semibold text-sm text-slate-900">{eq.name}</span>
                      <Badge className={cn(
                        "text-[10px] uppercase px-1.5 shadow-none",
                        eq.status === 'critico' ? "bg-orange-100 text-orange-800 hover:bg-orange-100" : "bg-green-100 text-green-800 hover:bg-green-100"
                      )}>
                        {eq.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate">{eq.location}</span>
                    </div>
                    {eq.status === 'critico' && (
                      <div className="flex items-center gap-1.5 text-xs text-orange-700 bg-orange-100/50 p-1.5 rounded mt-1">
                        <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                        <span>Mantenimiento requerido pronto</span>
                      </div>
                    )}
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No hay equipos registrados en esta sede.
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        ) : (
          <CardContent className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <Building className="h-12 w-12 text-slate-200 mb-3" />
            <h3 className="text-sm font-medium text-slate-900">Ninguna sede seleccionada</h3>
            <p className="text-xs text-muted-foreground mt-1">Haz clic en un marcador del mapa para ver el estado de los equipos.</p>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
