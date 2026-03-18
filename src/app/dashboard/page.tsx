"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Loader } from "lucide-react"

import { useAuth } from "@/context/auth-context"
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { kpiData, equipment, serviceOrders, technicians } from "@/lib/data"
import { KpiCard } from "@/components/kpi-card"
import { OrderServiceForm } from "@/components/order-service-form"
import { EquipmentListComponent } from "@/components/equipment-list"
import { ClientListComponent } from "@/components/client-list"
import { InventoryListComponent } from "@/components/inventory-list"
import { RecentSales } from "@/components/recent-sales"

export type Module =
  | "Dashboard"
  | "Clientes"
  | "Equipos"
  | "Ordenes"
  | "Inventario"

const DashboardContent = () => {
    const criticalEquipmentCount = useMemo(() => {
        return equipment.filter(eq => eq.status === 'critico').length;
    }, []);

    const ordersTodayCount = useMemo(() => {
        return serviceOrders.filter(o => o.time !== 'Ayer').length;
    }, []);

    const activeTechniciansCount = useMemo(() => {
        return technicians.filter(t => t.id !== 'tech-admin').length;
    }, []);

    const updatedKpiData = useMemo(() => {
        return kpiData.map(kpi => {
            if (kpi.title === "Equipos Críticos") {
                return { ...kpi, metric: criticalEquipmentCount.toString() };
            }
            if (kpi.title === "OS Hoy") {
                return { ...kpi, metric: ordersTodayCount.toString() };
            }
             if (kpi.title === "Técnicos Activos") {
                return { ...kpi, metric: activeTechniciansCount.toString() };
            }
            return kpi;
        });
    }, [criticalEquipmentCount, ordersTodayCount, activeTechniciansCount]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {updatedKpiData.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>
      <div className="grid gap-6">
        <RecentSales />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [currentModule, setCurrentModule] = useState<Module>("Dashboard")
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login")
      } else if (user.role === "TECH") {
        router.replace("/tech/mis-ordenes")
      }
    }
  }, [user, loading, router])

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav
          currentModule={currentModule}
          setCurrentModule={setCurrentModule}
        />
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col">
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {currentModule === "Dashboard" && <DashboardContent />}
            {currentModule === "Clientes" && <ClientListComponent />}
            {currentModule === "Equipos" && <EquipmentListComponent />}
            {currentModule === "Ordenes" && <OrderServiceForm />}
            {currentModule === "Inventario" && <InventoryListComponent />}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
