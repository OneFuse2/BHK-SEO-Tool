'use server';

/**
 * @fileOverview A comprehensive SEO and performance analysis AI agent.
 *
 * - analyzeSeoAndPerformance - A function that handles the SEO and performance analysis process.
 * - AISeoReportInput - The input type for the analyzeSeoAndPerformance function.
 * - AISeoReportOutput - The return type for the analyzeSeoAndPerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISeoReportInputSchema = z.object({
  url: z.string().url().describe('The URL of the content to analyze.'),
});
export type AISeoReportInput = z.infer<typeof AISeoReportInputSchema>;

const AISeoReportOutputSchema = z.object({
  seoScore: z.number().min(0).max(100).describe('Overall SEO score from 0 to 100.'),
  onPageSeo: z.object({
      title: z.string().describe('The SEO title of the page.'),
      metaDescription: z.string().describe('The meta description of the page.'),
      titleSuggestion: z.string().describe('A suggestion to improve the SEO title.'),
      metaDescriptionSuggestion: z.string().describe('A suggestion to improve the meta description.'),
  }),
  performance: z.object({
      score: z.number().min(0).max(100).describe('Overall performance score from 0 to 100.'),
      recommendations: z.array(z.string()).describe('A list of performance improvement recommendations.'),
  })
});
export type AISeoReportOutput = z.infer<typeof AISeoReportOutputSchema>;

export async function analyzeSeoAndPerformance(input: AISeoReportInput): Promise<AISeoReportOutput> {
  return aiSeoReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSeoReportPrompt',
  input: {schema: AISeoReportInputSchema},
  output: {schema: AISeoReportOutputSchema},
  prompt: `You are a world-class SEO and web performance expert. Analyze the content of the provided URL and generate a comprehensive report.

URL: {{{url}}}

Based on the content of the URL, provide the following:
1.  An overall SEO score between 0 and 100.
2.  The current SEO title and meta description.
3.  Actionable suggestions for improving the title and meta description to be more compelling and keyword-rich.
4.  An overall performance score between 0 and 100.
5.  A list of 3-5 concrete, high-impact recommendations to improve the website's speed and performance.

Format the output as a JSON object matching the defined schema.`,
});

const aiSeoReportFlow = ai.defineFlow(
  {
    name: 'aiSeoReportFlow',
    inputSchema: AISeoReportInputSchema,
    outputSchema: AISeoReportOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
