"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IEquipment, IClient } from "@/lib/data"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
interface EquipmentFormModalProps {
  equipment: IEquipment | null
  isOpen: boolean
  onClose: () => void
  onSave: (equipment: IEquipment) => void
  clients: IClient[]
}

const equipmentSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  location: z.string().min(3, "La ubicación es requerida."),
  clientId: z.string({ required_error: "Debe seleccionar un cliente." }).min(1, "Debe seleccionar un cliente."),
  status: z.enum(["GREEN", "YELLOW", "RED", "GRAY"]),
  brand: z.string().optional(),
  model: z.string().optional(),
  serial: z.string().optional(),
  capacity: z.string().optional(),
  refrigerant: z.string().optional(),
})

type EquipmentFormValues = {
  id: string
  name: string
  location: string
  clientId: string
  status: "GREEN" | "YELLOW" | "RED" | "GRAY"
  brand?: string
  model?: string
  serial?: string
  capacity?: string
  refrigerant?: string
}

const defaultFormValues: EquipmentFormValues = {
  id: "",
  name: "",
  location: "",
  clientId: "",
  status: "GREEN",
  brand: "",
  model: "",
  serial: "",
  capacity: "",
  refrigerant: "",
}

export function EquipmentFormModal({ equipment, isOpen, onClose, onSave, clients }: EquipmentFormModalProps) {
  const form = useForm({
    resolver: zodResolver(equipmentSchema),
    defaultValues: equipment ? {
      ...defaultFormValues,
      id:         equipment.id,
      name:       equipment.name,
      location:   equipment.location,
      clientId:   equipment.clientId,
      status:     equipment.status,
      brand:      equipment.brand ?? "",
      model:      equipment.model ?? "",
      serial:     equipment.serial ?? "",
      capacity:   equipment.capacity ?? "",
      refrigerant: equipment.refrigerant ?? "",
    } : defaultFormValues,
  })

  React.useEffect(() => {
    if (isOpen) {
      form.reset(equipment ? {
        ...defaultFormValues,
        id:         equipment.id,
        name:       equipment.name,
        location:   equipment.location,
        clientId:   equipment.clientId,
        status:     equipment.status,
        brand:      equipment.brand ?? "",
        model:      equipment.model ?? "",
        serial:     equipment.serial ?? "",
        capacity:   equipment.capacity ?? "",
        refrigerant: equipment.refrigerant ?? "",
      } : defaultFormValues)
    }
  }, [equipment, isOpen, form])

  const onSubmit = (data: EquipmentFormValues) => {
    const client = clients.find(c => c.id === data.clientId)
    const equipmentToSave: IEquipment = {
      ...(equipment ?? {}),
      id:          equipment?.id || `eq-${Date.now()}`,
      name:        data.name,
      location:    data.location,
      clientId:    data.clientId,
      clientName:  client?.name ?? "Cliente Desconocido",
      status:      data.status,
      brand:       data.brand || "—",
      model:       data.model || "—",
      serial:      data.serial || "—",
      capacity:    data.capacity || "—",
      refrigerant: data.refrigerant || "—",
      installDate: equipment?.installDate ?? "—",
      lastService: equipment?.lastService ?? "—",
      nextService: equipment?.nextService ?? "—",
      hoursOp:     equipment?.hoursOp ?? "—",
      history:     equipment?.history ?? [],
    }
    onSave(equipmentToSave)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{equipment ? "Editar Equipo" : "Registrar Nuevo Equipo"}</DialogTitle>
          <DialogDescription>
            Complete la información del equipo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Equipo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Unidad A/C Central" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione un cliente" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                                {client.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación dentro de la sede</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Sótano 1, Techo Torre A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: York, Carrier..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: YLAA0500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: YK-2019-04521" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidad</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 500 TR" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado Inicial</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="GREEN">Óptimo</SelectItem>
                            <SelectItem value="YELLOW">Preventivo pendiente</SelectItem>
                            <SelectItem value="RED">Correctivo requerido</SelectItem>
                            <SelectItem value="GRAY">Fuera de servicio</SelectItem>
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Equipo</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
