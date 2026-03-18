'use server';
/**
 * @fileOverview An AI agent that analyzes HR metrics and generates natural language summaries.
 *
 * - generateAiInsights - A function that handles the generation of AI insights from HR metrics.
 * - AiInsightGenerationInput - The input type for the generateAiInsights function.
 * - AiInsightGenerationOutput - The return type for the generateAiInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const AiInsightGenerationInputSchema = z.object({
  metricsDescription: z.string().describe('A detailed description or JSON string of HR metrics and their values for analysis.'),
});
export type AiInsightGenerationInput = z.infer<typeof AiInsightGenerationInputSchema>;

// Output Schema
const AiInsightGenerationOutputSchema = z.object({
  summary: z.string().describe('A natural language summary highlighting key observations, identified anomalies, and potential future trends based on the HR metrics provided.'),
});
export type AiInsightGenerationOutput = z.infer<typeof AiInsightGenerationOutputSchema>;

// Wrapper function
export async function generateAiInsights(input: AiInsightGenerationInput): Promise<AiInsightGenerationOutput> {
  return aiInsightGenerationFlow(input);
}

// Prompt definition
const aiInsightGenerationPrompt = ai.definePrompt({
  name: 'aiInsightGenerationPrompt',
  input: { schema: AiInsightGenerationInputSchema },
  output: { schema: AiInsightGenerationOutputSchema },
  prompt: `You are an expert HR analyst AI. Your task is to analyze the provided HR metrics and generate a concise, natural language summary.
The summary should clearly identify:
1. Key observations and insights from the data.
2. Any significant anomalies or deviations.
3. Potential future trends or implications.

HR Metrics Data:
{{{metricsDescription}}}

Please provide your analysis in a clear, well-structured natural language summary.`,
});

// Flow definition
const aiInsightGenerationFlow = ai.defineFlow(
  {
    name: 'aiInsightGenerationFlow',
    inputSchema: AiInsightGenerationInputSchema,
    outputSchema: AiInsightGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await aiInsightGenerationPrompt(input);
    return output!;
  }
);
