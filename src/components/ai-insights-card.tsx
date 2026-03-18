"use client"

import { useState } from "react"
import { BrainCircuit, Loader } from "lucide-react"

import { generateAiInsights } from "@/ai/flows/ai-insight-generation-flow"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "./ui/skeleton"

type AiInsightsCardProps = {
  metrics: string
}

export default function AiInsightsCard({ metrics }: AiInsightsCardProps) {
  const [loading, setLoading] = useState(false)
  const [insight, setInsight] = useState("")
  const { toast } = useToast()

  const handleGenerateInsight = async () => {
    setLoading(true)
    setInsight("")
    try {
      const result = await generateAiInsights({
        metricsDescription: metrics,
      })
      if (result.summary) {
        setInsight(result.summary)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate AI insights. Please try again.",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="card-sg h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="card-title-text">AI-Powered Insights</CardTitle>
        <BrainCircuit className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : insight ? (
          <p className="text-sm text-muted-foreground">{insight}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click the button to generate an AI summary of the current HR metrics.
          </p>
        )}
      </CardContent>
      <div className="p-6 pt-0">
        <Button
          onClick={handleGenerateInsight}
          disabled={loading}
          className="w-full"
          variant="secondary"
        >
          {loading ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BrainCircuit className="mr-2 h-4 w-4" />
          )}
          {loading ? "Analyzing..." : "Generate Insights"}
        </Button>
      </div>
    </Card>
  )
}
