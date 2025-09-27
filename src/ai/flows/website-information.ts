
'use server';

/**
 * @fileOverview A flow for gathering comprehensive information about a website.
 *
 * - getWebsiteInformation - A function that takes a domain name and returns detailed information.
 * - WebsiteInfoInput - The input type for the function.
 * - WebsiteInfoOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WebsiteInfoInputSchema = z.object({
  domain: z.string().describe('The domain name to look up.'),
});
export type WebsiteInfoInput = z.infer<typeof WebsiteInfoInputSchema>;

const WebsiteInfoOutputSchema = z.object({
  summary: z.object({
    age: z.string().describe('The age of the website (e.g., "22 years old").'),
    traffic: z.string().describe('A qualitative description of traffic (e.g., "medium-traffic").'),
    globalRank: z.string().describe('The estimated global rank as a formatted number (e.g., "#653,951").'),
    pageRank: z.string().describe('The estimated PageRank (e.g., "3.4").'),
    backlinks: z.string().describe('A qualitative description of backlinks (e.g., "a pretty good amount of backlinks").'),
    hosting: z.string().describe('The name of the hosting provider.'),
    serverLocation: z.string().describe('The country where the server is located.'),
    registrar: z.string().describe('The domain registrar name.'),
    expiry: z.string().describe('Time until domain expiration (e.g., "in 1 year and 9 months").'),
  }),
  overview: z.object({
    country: z.string().describe('The country of the website owner or organization.'),
    countryCode: z.string().length(2).describe('The two-letter country code (e.g., "US", "IN").'),
    owner: z.string().describe('The name of the website owner or organization.'),
    registeredWith: z.string().describe('The domain registrar.'),
    registrationDate: z.string().describe('The full registration date (e.g., "23 July 2003").'),
    registrationAge: z.string().describe('The human-readable age from registration (e.g., "22 years and 2 months ago").'),
    expirationDate: z.string().describe('The full expiration date (e.g., "23 July 2027").'),
    expirationDuration: z.string().describe('The human-readable time until expiration (e.g., "in 1 year and 9 months").'),
    ipAddress: z.string().ip().describe('The primary IP address of the website.'),
    ipWebsiteCount: z.number().describe('The number of other websites hosted on the same IP.'),
    hostedBy: z.string().describe('The hosting provider name.'),
    serverLocation: z.string().describe('The server location (Country -> Geolocation).'),
    safety: z.string().describe('A safety assessment (e.g., "Safe").'),
    safetyScore: z.string().describe('A safety score (e.g., "7/7").'),
  }),
});
export type WebsiteInfoOutput = z.infer<typeof WebsiteInfoOutputSchema>;


export async function getWebsiteInformation(input: WebsiteInfoInput): Promise<WebsiteInfoOutput> {
  return websiteInformationFlow(input);
}


const prompt = ai.definePrompt({
    name: 'websiteInformationPrompt',
    input: { schema: WebsiteInfoInputSchema },
    output: { schema: WebsiteInfoOutputSchema },
    prompt: `You are a world-class website analyst. Given a domain name, you must perform a comprehensive analysis and return structured data about it. You will need to use your knowledge to find or estimate information like WHOIS data, hosting provider, IP address, SEO rank, and more.

Domain: {{{domain}}}

Based on your analysis of the domain, provide the following information:

For the summary object:
- age: A human-readable string for the website's age.
- traffic: A qualitative description of traffic (low, medium, high).
- globalRank: Estimated global rank, formatted with a '#' and commas (e.g., '#1,234,567').
- pageRank: A string representation of the estimated PageRank.
- backlinks: A qualitative description of the number of backlinks.
- hosting: The name of the hosting provider.
- serverLocation: The country where the server is located.
- registrar: The domain registrar's name.
- expiry: A human-readable string for when the domain will expire.

For the overview object:
- country: The country associated with the owner.
- countryCode: The two-letter code for the owner's country.
- owner: The name of the registered owner/organization.
- registeredWith: The registrar's name.
- registrationDate: The full date of registration (e.g., "23 July 2003").
- registrationAge: How long ago it was registered (e.g., "22 years and 2 months ago").
- expirationDate: The full date of expiration.
- expirationDuration: How long until it expires (e.g., "in 1 year and 9 months").
- ipAddress: The primary IP address.
- ipWebsiteCount: The number of other websites on that IP.
- hostedBy: The hosting provider.
- serverLocation: The server location string.
- safety: A one-word safety status (e.g., "Safe").
- safetyScore: A safety score like "7/7".

Return the data in a clean JSON object matching the defined schema.
`,
});

const websiteInformationFlow = ai.defineFlow(
  {
    name: 'websiteInformationFlow',
    inputSchema: WebsiteInfoInputSchema,
    outputSchema: WebsiteInfoOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
