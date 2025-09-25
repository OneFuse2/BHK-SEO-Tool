
'use server';

/**
 * @fileOverview A flow for looking up IP address information.
 *
 * - ipLookup - A function that takes an IP address and returns its geolocation information.
 * - IPLookupInput - The input type for the ipLookup function.
 * - IPLookupOutput - The return type for the ipLookup function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IPLookupInputSchema = z.object({
  ip: z.string().optional().describe('The IP address to look up. If not provided, the current user\'s IP will be used.'),
});
export type IPLookupInput = z.infer<typeof IPLookupInputSchema>;

const IPLookupOutputSchema = z.object({
    status: z.string(),
    message: z.string().optional(),
    country: z.string().optional(),
    countryCode: z.string().optional(),
    region: z.string().optional(),
    regionName: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().optional(),
    lat: z.number().optional(),
    lon: z.number().optional(),
    timezone: z.string().optional(),
    isp: z.string().optional(),
    org: z.string().optional(),
    as: z.string().optional(),
    query: z.string().optional(),
});
export type IPLookupOutput = z.infer<typeof IPLookupOutputSchema>;

export async function ipLookup(input: IPLookupInput): Promise<IPLookupOutput> {
  return ipLookupFlow(input);
}

const ipLookupFlow = ai.defineFlow(
  {
    name: 'ipLookupFlow',
    inputSchema: IPLookupInputSchema,
    outputSchema: IPLookupOutputSchema,
  },
  async ({ ip }) => {
    const url = `http://ip-api.com/json/${ip || ''}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return IPLookupOutputSchema.parse(data);
    } catch (error: any) {
      console.error(`IP lookup failed for ${ip}`, error);
      return {
        status: 'fail',
        message: error.message || 'An unexpected error occurred during the IP lookup.',
      };
    }
  }
);
