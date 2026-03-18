import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { kpiData, departmentPerformanceData } from "@/lib/data"
import { KpiCard } from "@/components/kpi-card"
import AiInsightsCard from "@/components/ai-insights-card"
import { DepartmentPerformanceChart } from "@/components/department-performance-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const allMetrics = {
    kpis: kpiData,
    departmentPerformance: departmentPerformanceData,
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col">
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {kpiData.map((kpi) => (
                <KpiCard key={kpi.title} {...kpi} />
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="card-sg lg:col-span-4">
                <CardHeader>
                  <CardTitle className="card-title-text">
                    Department Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <DepartmentPerformanceChart data={departmentPerformanceData} />
                </CardContent>
              </Card>
              <div className="lg:col-span-3">
                 <AiInsightsCard metrics={JSON.stringify(allMetrics)} />
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
