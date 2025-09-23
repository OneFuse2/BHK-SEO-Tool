'use server';

/**
 * @fileOverview A flow for generating SEO meta tags (title, description) and keywords for a given URL.
 *
 * - generateMetaTags - A function that takes a URL and returns SEO-optimized metadata.
 * - MetaTagGeneratorInput - The input type for the generateMetaTags function.
 * - MetaTagGeneratorOutput - The return type for the generateMetaTags function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MetaTagGeneratorInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to generate meta tags for.'),
});
export type MetaTagGeneratorInput = z.infer<typeof MetaTagGeneratorInputSchema>;

const MetaTagGeneratorOutputSchema = z.object({
  title: z.string().describe('The generated SEO-optimized title for the page.'),
  metaDescription: z.string().describe('The generated SEO-optimized meta description for the page.'),
  keywords: z.array(z.string()).describe('A list of relevant SEO keywords for the page.'),
});
export type MetaTagGeneratorOutput = z.infer<typeof MetaTagGeneratorOutputSchema>;

export async function generateMetaTags(input: MetaTagGeneratorInput): Promise<MetaTagGeneratorOutput> {
  return metaTagGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'metaTagGeneratorPrompt',
  input: { schema: MetaTagGeneratorInputSchema },
  output: { schema: MetaTagGeneratorOutputSchema },
  prompt: `You are an SEO expert. Based on the content of the provided URL, generate the following:
1.  A concise and compelling SEO title (around 50-60 characters).
2.  A meta description (around 150-160 characters) that is engaging and encourages clicks.
3.  A list of 5-10 relevant keywords.

URL: {{{url}}}

Format the output as a JSON object matching the defined schema.`,
});

const metaTagGeneratorFlow = ai.defineFlow(
  {
    name: 'metaTagGeneratorFlow',
    inputSchema: MetaTagGeneratorInputSchema,
    outputSchema: MetaTagGeneratorOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
