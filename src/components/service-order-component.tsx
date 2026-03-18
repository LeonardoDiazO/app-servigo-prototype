"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { inventory as initialInventory, type IInventoryItem } from "@/lib/data"
import { useSignatureCanvas } from "@/hooks/use-signature-canvas"
import { Camera, Wrench } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const checklistTasks = [
  "Verificación inicial de la unidad",
  "Limpieza de filtros y serpentines",
  "Revisión de niveles de refrigerante",
  "Inspección de conexiones eléctricas",
  "Prueba de funcionamiento final",
];

export function ServiceOrderComponent() {
  const { user } = useAuth()
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const { clearSignature, getSignatureDataUrl } = useSignatureCanvas(canvasRef, {
    color: "#007BFF",
  })

  const [isSuccess, setIsSuccess] = React.useState(false)
  const [selectedPart, setSelectedPart] = React.useState<IInventoryItem | null>(null)
  const [checklist, setChecklist] = React.useState<Record<string, boolean>>({})

  const techInventory = React.useMemo(() => {
    if (!user) return []
    return initialInventory.filter(item => item.location.includes(user.name))
  }, [user])

  const handleChecklistChange = (task: string) => {
    setChecklist(prev => ({ ...prev, [task]: !prev[task] }));
  }

  const handleSave = () => {
    const signature = getSignatureDataUrl()
    console.log("Firma Guardada:", signature)
    console.log("Checklist:", checklist)
    console.log("Parte usada:", selectedPart)
    // Here you would typically save all the data and submit the report
    setIsSuccess(true)
  }

  const handleCloseSuccess = () => {
    setIsSuccess(false)
    // Reset form state
    clearSignature()
    setChecklist({})
    setSelectedPart(null)
  }

  return (
    <>
      <Card className="card-sg w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Ejecución y Cierre de Servicio
          </CardTitle>
          <CardDescription>
            Completa el checklist, registra la evidencia y consumibles para cerrar la OS.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 py-4">
          <div className="grid gap-3">
            <Label className="font-bold">Checklist de Tareas</Label>
            <div className="grid gap-2 rounded-md border p-4">
              {checklistTasks.map(task => (
                <div key={task} className="flex items-center gap-3">
                  <Checkbox
                    id={`task-${task}`}
                    checked={checklist[task] || false}
                    onCheckedChange={() => handleChecklistChange(task)}
                  />
                  <Label htmlFor={`task-${task}`} className="font-normal text-sm cursor-pointer">{task}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid gap-3">
             <Label className="font-bold">Consumo de Inventario</Label>
             <div className="grid md:grid-cols-2 gap-6 p-4 border rounded-md">
                <div className="grid gap-2">
                    <Label htmlFor="parts" className="text-sm">Repuestos (Mi Bodega)</Label>
                    <Select onValueChange={(value) => {
                        const part = techInventory.find(i => i.id === value)
                        setSelectedPart(part || null)
                    }}>
                        <SelectTrigger id="parts">
                            <SelectValue placeholder="Seleccione un repuesto" />
                        </SelectTrigger>
                        <SelectContent>
                            {techInventory.length > 0 ? techInventory.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                                {item.name} (Stock: {item.stock})
                            </SelectItem>
                            )) : <div className="p-4 text-sm text-muted-foreground">No tienes repuestos asignados.</div>}
                        </SelectContent>
                    </Select>
                </div>
                {selectedPart && selectedPart.type === 'serialized' && (
                    <div className="grid gap-2">
                        <Label htmlFor="serial-number" className="text-sm">Número de Serial del Repuesto</Label>
                        <Input id="serial-number" placeholder="Escanear o ingresar serial..." />
                    </div>
                )}
             </div>
          </div>

          <div className="grid gap-3">
            <Label className="font-bold">Evidencia Fotográfica</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => alert('Función de carga no implementada.')}>
                <Camera className="mr-2 h-4 w-4" />
                Subir Foto (Antes)
              </Button>
              <Button variant="outline" onClick={() => alert('Función de carga no implementada.')}>
                <Camera className="mr-2 h-4 w-4" />
                Subir Foto (Después)
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="font-bold">Firma de Conformidad del Cliente</Label>
            <div className="relative w-full h-48 rounded-md border bg-background">
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full touch-none"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col-reverse sm:flex-row sm:justify-between w-full gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={clearSignature}
            className="w-full sm:w-auto"
          >
            Limpiar Firma
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto btn-gradient text-white">
            Finalizar y Enviar Reporte
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isSuccess} onOpenChange={setIsSuccess}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader className="items-center text-center pt-6">
                <div className="mb-4">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-20 w-20">
                    <path d="M50 12 L56 12 L58 20 C62 22 66 25 69 29 L77 27 L80 33 L73 38 C74 42 74 47 73 51 L80 56 L77 62 L69 60 C66 64 62 67 58 69 L56 77 L50 77 L48 69 C44 67 40 64 37 60 L29 62 L26 56 L33 51 C32 47 32 42 33 38 L26 33 L29 27 L37 29 C40 25 44 22 48 20 L50 12 Z" fill="#2563EB" />
                    <circle cx="50" cy="45" r="20" fill="white" />
                    <g transform="rotate(-45 50 45)">
                        <path d="M50 12 L60 45 L50 45 Z" fill="#1E3A8A" />
                        <path d="M50 12 L40 45 L50 45 Z" fill="#3B82F6" />
                        <path d="M50 78 L60 45 L50 45 Z" fill="#C2410C" />
                        <path d="M50 78 L40 45 L50 45 Z" fill="#F97316" />
                        <circle cx="50" cy="45" r="5" fill="white" />
                    </g>
                </svg>
                </div>
                <DialogTitle className="text-2xl">¡Servicio Finalizado!</DialogTitle>
                <DialogDescription className="text-base">
                    El reporte ha sido enviado y la orden de servicio ha sido cerrada exitosamente.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-4">
                <Button onClick={handleCloseSuccess} className="w-full">Cerrar</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  )
}
