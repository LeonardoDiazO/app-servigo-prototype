"use client"

import type React from "react"
import {
  LayoutDashboard,
  Users,
  Wrench,
  ClipboardList,
  Boxes,
  Settings,
  LogOut,
  Map as MapIcon,
  HardHat,
} from "lucide-react"

import type { Module } from "@/app/dashboard/page"
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "./ui/sidebar"
import { useAuth } from "@/context/auth-context"

interface SidebarNavProps {
  currentModule: Module
  setCurrentModule: (module: Module) => void
}

export function SidebarNav({
  currentModule,
  setCurrentModule,
}: SidebarNavProps) {
  const { user, logout } = useAuth()

  const allOperationItems: { name: Module; icon: React.ReactNode; tooltip: string; roles: ('ADMIN' | 'TECH')[] }[] = [
    { name: "Clientes",  icon: <Users />,        tooltip: "Gestión de Clientes",      roles: ['ADMIN'] },
    { name: "Equipos",   icon: <Wrench />,       tooltip: "Gestión de Equipos",       roles: ['ADMIN', 'TECH'] },
    { name: "Ordenes",   icon: <ClipboardList />,tooltip: "Órdenes de Servicio",      roles: ['ADMIN', 'TECH'] },
    { name: "Técnicos",  icon: <HardHat />,      tooltip: "Gestión de Técnicos",      roles: ['ADMIN'] },
    { name: "Mapa",      icon: <MapIcon />,      tooltip: "Geo-Mapa de Operaciones",  roles: ['ADMIN'] },
  ]

  const allLogisticsItems: { name: Module; icon: React.ReactNode; tooltip: string; roles: ('ADMIN' | 'TECH')[] }[] = [
    { name: "Inventario", icon: <Boxes />, tooltip: "Inventario y Repuestos", roles: ['ADMIN'] },
  ]

  const operationItems = allOperationItems.filter(item => user && item.roles.includes(user.role));
  const logisticsItems = allLogisticsItems.filter(item => user && item.roles.includes(user.role));


  return (
    <>
      <SidebarContent className="p-2 pt-8">
        {user?.role === 'ADMIN' && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setCurrentModule("Dashboard")}
                isActive={currentModule === "Dashboard"}
                tooltip="Vista General"
              >
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        
        {operationItems.length > 0 && <div className="mt-4">
            <p className="px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2 group-data-[collapsible=icon]:hidden">OPERACIÓN</p>
            <SidebarMenu>
                 {operationItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                        onClick={() => setCurrentModule(item.name)}
                        isActive={currentModule === item.name}
                        tooltip={item.tooltip}
                        >
                        {item.icon}
                        {item.name}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </div>}

        {logisticsItems.length > 0 && <div className="mt-4">
            <p className="px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2 group-data-[collapsible=icon]:hidden">LOGÍSTICA</p>
            <SidebarMenu>
                {logisticsItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                        onClick={() => setCurrentModule(item.name)}
                        isActive={currentModule === item.name}
                        tooltip={item.tooltip}
                        >
                        {item.icon}
                        {item.name}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </div>}
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Configuración">
              <Settings />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Cerrar Sesión" onClick={logout}>
              <LogOut />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
