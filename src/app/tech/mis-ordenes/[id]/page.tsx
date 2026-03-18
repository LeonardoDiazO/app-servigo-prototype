"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ServiceOrderComponent } from "@/components/service-order-component"
import { serviceOrders, IServiceOrder } from "@/lib/data"

export default function ServiceExecutionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  
  const order: IServiceOrder | undefined = useMemo(() => {
    return serviceOrders.find(o => o.id === params.id)
  }, [params.id])

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b bg-background px-4 py-4 sm:px-6">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Volver</span>
        </Button>
        <div className="flex flex-col">
             <h1 className="text-lg font-bold">
                {order ? `OS: ${order.clientName}` : "Orden de Servicio"}
            </h1>
            <p className="text-xs text-muted-foreground">
                {order?.equipmentName}
            </p>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <ServiceOrderComponent />
      </main>
    </div>
  )
}
