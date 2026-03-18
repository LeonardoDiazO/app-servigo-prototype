"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Header } from "@/components/header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Loader } from "lucide-react"


export default function MisOrdenesPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Cargando...</p>
            </div>
        );
    }
    
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
