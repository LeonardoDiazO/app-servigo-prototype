"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  headcount: {
    label: "Headcount",
    color: "hsl(var(--chart-1))",
  },
  turnover: {
    label: "Turnover %",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

type DepartmentPerformanceChartProps = {
  data: { department: string; headcount: number; turnover: number }[]
}

export function DepartmentPerformanceChart({ data }: DepartmentPerformanceChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="department"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="headcount" fill="var(--color-headcount)" radius={4} />
        <Bar dataKey="turnover" fill="var(--color-turnover)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
