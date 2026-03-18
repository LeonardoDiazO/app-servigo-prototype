"use client"

import * as React from "react"

interface KpiDonutChartProps {
  percentage: number
  color: string
  trackColor?: string
  strokeWidth?: number
  size?: number
}

export function KpiDonutChart({
  percentage,
  color,
  trackColor = "hsl(var(--muted) / 0.2)",
  strokeWidth = 12,
  size = 60,
}: KpiDonutChartProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(percentage, 100)
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
      />
    </svg>
  )
}
