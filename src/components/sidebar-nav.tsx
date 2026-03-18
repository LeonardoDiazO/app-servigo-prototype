"use client"

import {
  LayoutDashboard,
  Users,
  Wrench,
  ClipboardList,
  Boxes,
  Settings,
  LogOut,
} from "lucide-react"

import type { Module } from "@/app/page"
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "./ui/sidebar"

interface SidebarNavProps {
  currentModule: Module
  setCurrentModule: (module: Module) => void
}

export function SidebarNav({
  currentModule,
  setCurrentModule,
}: SidebarNavProps) {
  const menuItems: { name: Module; icon: React.ReactNode }[] = [
    { name: "Dashboard", icon: <LayoutDashboard /> },
    { name: "Clientes", icon: <Users /> },
    { name: "Equipos", icon: <Wrench /> },
    { name: "Ordenes", icon: <ClipboardList /> },
    { name: "Inventario", icon: <Boxes /> },
  ]

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-8 w-8 text-primary-magenta"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
          <span className="font-bold text-xl">ServiGo One</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                onClick={() => setCurrentModule(item.name)}
                isActive={currentModule === item.name}
              >
                {item.icon}
                {item.name}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
