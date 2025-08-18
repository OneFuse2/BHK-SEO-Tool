// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant keywords based on a given URL.
 *
 * - `suggestKeywords` -  A function that takes a URL and returns a list of keyword suggestions.
 * - `AIKeywordSuggestionsInput` - The input type for the `suggestKeywords` function, which is a URL string.
 * - `AIKeywordSuggestionsOutput` - The output type for the `suggestKeywords` function, which is a list of keyword suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIKeywordSuggestionsInputSchema = z.object({
  url: z.string().url().describe('The URL of the content to analyze for keyword suggestions.'),
  query: z.string().optional().describe('Optional search query.'),
});
export type AIKeywordSuggestionsInput = z.infer<typeof AIKeywordSuggestionsInputSchema>;

const AIKeywordSuggestionsOutputSchema = z.object({
  keywords: z.array(
    z.object({
      keyword: z.string().describe('The suggested keyword.'),
      relevanceScore: z.number().describe('The relevance score of the keyword to the URL content.'),
    })
  ).describe('A list of keyword suggestions with their relevance scores.'),
});
export type AIKeywordSuggestionsOutput = z.infer<typeof AIKeywordSuggestionsOutputSchema>;


export async function suggestKeywords(input: AIKeywordSuggestionsInput): Promise<AIKeywordSuggestionsOutput> {
  return aiKeywordSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiKeywordSuggestionsPrompt',
  input: { schema: AIKeywordSuggestionsInputSchema },
  output: { schema: AIKeywordSuggestionsOutputSchema },
  prompt: `You are an SEO expert. Given the URL of a website, suggest relevant keywords that can help improve the website's search engine optimization.

URL: {{{url}}}

Query: {{{query}}}

Suggest keywords that are high-volume and low-competition, and provide a relevance score for each keyword.

Format the output as a JSON object with a 'keywords' array. Each object in the array should have a 'keyword' field and a 'relevanceScore' field.
`, 
});

const aiKeywordSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiKeywordSuggestionsFlow',
    inputSchema: AIKeywordSuggestionsInputSchema,
    outputSchema: AIKeywordSuggestionsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
