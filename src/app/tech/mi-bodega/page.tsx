"use client"
import { Boxes } from "lucide-react"

export default function MiBodegaPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] w-full flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
        <h1 className="text-2xl font-bold">Mi Bodega</h1>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
        <Boxes className="h-24 w-24 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Función no implementada</h2>
        <p className="text-muted-foreground">La gestión de tu inventario personal estará disponible aquí.</p>
      </main>
    </div>
  )
}
