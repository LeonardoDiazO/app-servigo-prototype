export const kpiData = [
  {
    title: "Employee Headcount",
    metric: "1,204",
    change: "+12.5%",
    changeType: "increase",
    description: "Total active employees in the organization.",
    chartData: [
      { name: "Current", value: 1204, fill: "hsl(var(--chart-1))" },
      { name: "Previous", value: 1070, fill: "hsl(var(--muted))" },
    ],
  },
  {
    title: "Turnover Rate",
    metric: "8.2%",
    change: "-1.8%",
    changeType: "decrease",
    description: "Rate of employees leaving the company.",
    chartData: [
      { name: "Current", value: 8.2, fill: "hsl(var(--chart-2))" },
      { name: "Goal", value: 10, fill: "hsl(var(--muted))" },
    ],
  },
  {
    title: "Avg. Tenure",
    metric: "4.1 yrs",
    change: "+0.2 yrs",
    changeType: "increase",
    description: "Average length of employment.",
    chartData: [
      { name: "Current", value: 4.1, fill: "hsl(var(--chart-4))" },
      { name: "Previous", value: 3.9, fill: "hsl(var(--muted))" },
    ],
  },
  {
    title: "Hiring Cost",
    metric: "$4,129",
    change: "+$250",
    changeType: "increase",
    description: "Average cost to hire a new employee.",
    chartData: [
      { name: "Current", value: 4129, fill: "hsl(var(--chart-5))" },
      { name: "Budget", value: 4500, fill: "hsl(var(--muted))" },
    ],
  },
]

export const departmentPerformanceData = [
  { department: "Engineering", headcount: 350, turnover: 5.8 },
  { department: "Sales", headcount: 220, turnover: 12.1 },
  { department: "Marketing", headcount: 150, turnover: 9.5 },
  { department: "Product", headcount: 180, turnover: 4.2 },
  { department: "HR", headcount: 80, turnover: 7.0 },
  { department: "Support", headcount: 224, turnover: 10.5 },
]
