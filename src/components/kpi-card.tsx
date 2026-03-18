"use client"

import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface KpiCardProps {
  title: string
  metric: string
  change: string
  changeType: "increase" | "decrease"
  description: string
  chartData: { name: string; value: number; fill: string }[]
}

const chartConfig = {
  value: {
    label: "Value",
  },
}

export function KpiCard({
  title,
  metric,
  change,
  changeType,
  description,
  chartData,
}: KpiCardProps) {
  const ChangeIcon = changeType === "increase" ? TrendingUp : TrendingDown
  const changeColor =
    changeType === "increase" ? "text-green-500" : "text-red-500"

  return (
    <Card className="card-sg">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="card-title-text">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="kpi-metric">{metric}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ChangeIcon className={`h-4 w-4 ${changeColor}`} />
              <span className={changeColor}>{change}</span>
              <span>vs last month</span>
            </div>
          </div>
          <ChartContainer
            config={chartConfig}
            className="h-[60px] w-[60px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={18}
                strokeWidth={5}
                outerRadius={25}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardFooter>
    </Card>
  )
}
