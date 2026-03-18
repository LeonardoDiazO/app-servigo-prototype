import { Header } from "@/components/header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

// NOTE: This is a placeholder page for a technician.
// A real implementation would have a dedicated layout and navigation.
export default function MisOrdenesPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Header />
             <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card className="card-sg">
                    <CardHeader>
                        <CardTitle>Mis Órdenes de Servicio</CardTitle>
                        <CardDescription>Aquí aparecerán tus órdenes de servicio asignadas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Actualmente no tienes órdenes de servicio asignadas.</p>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
