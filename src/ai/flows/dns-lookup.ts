'use server';

/**
 * @fileOverview A flow for looking up DNS records for a domain.
 *
 * - dnsLookup - A function that takes a domain name and returns its DNS records.
 * - DnsLookupInput - The input type for the dnsLookup function.
 * - DnsLookupOutput - The return type for the dnsLookup function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { resolve } from 'path';
import { promises as dns } from 'dns';

const DnsLookupInputSchema = z.object({
  domain: z.string().describe('The domain name to look up.'),
});
export type DnsLookupInput = z.infer<typeof DnsLookupInputSchema>;


const DnsRecordSchema = z.object({
    type: z.string(),
    value: z.string().optional(),
    address: z.string().optional(),
    priority: z.number().optional(),
    exchange: z.string().optional(),
    name: z.string().optional(),
    ttl: z.number().optional(),
});

const DnsLookupOutputSchema = z.object({
    records: z.array(DnsRecordSchema).describe("An array of DNS records found for the domain."),
    error: z.string().optional().describe("An error message if the lookup failed."),
});
export type DnsLookupOutput = z.infer<typeof DnsLookupOutputSchema>;


export async function dnsLookup(input: DnsLookupInput): Promise<DnsLookupOutput> {
  return dnsLookupFlow(input);
}

const dnsLookupFlow = ai.defineFlow(
  {
    name: 'dnsLookupFlow',
    inputSchema: DnsLookupInputSchema,
    outputSchema: DnsLookupOutputSchema,
  },
  async ({ domain }) => {
    try {
        const records = await dns.resolveAny(domain);
        
        // Ensure TTL is included if available. Some record types might not have it from resolveAny.
        const mappedRecords = records.map(r => {
            const baseRecord: z.infer<typeof DnsRecordSchema> = { type: r.type };
            if ('address' in r) baseRecord.address = r.address;
            if ('value' in r) baseRecord.value = r.value as string|undefined;
            if ('priority' in r) baseRecord.priority = r.priority;
            if ('exchange' in r) baseRecord.exchange = r.exchange;
            if ('name' in r) baseRecord.name = r.name;
            if ('ttl' in r) baseRecord.ttl = r.ttl;
            return baseRecord;
        });

        return { records: mappedRecords };
    } catch (e: any) {
        if (e.code === 'ENODATA' || e.code === 'ENOTFOUND') {
            return { records: [], error: 'No DNS records found for this domain or the domain does not exist.' };
        }
        console.error(`DNS lookup failed for ${domain}`, e);
        return { records: [], error: 'An unexpected error occurred during the DNS lookup. The domain may not be valid.' };
    }
  }
);
