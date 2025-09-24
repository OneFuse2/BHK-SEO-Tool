
'use server';

import { z } from 'zod';

const SitemapUrlSchema = z.string().url();

export async function fetchSitemapUrls(sitemapUrl: string): Promise<{ urls: string[], error?: string }> {
  try {
    const validatedUrl = SitemapUrlSchema.parse(sitemapUrl);
    
    const response = await fetch(validatedUrl, {
        headers: {
            'User-Agent': 'BHK-SEO-Tools-Sitemap-Fetcher/1.0',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap. Status: ${response.status}`);
    }
    const text = await response.text();
    
    // This is a simple regex parser, not a full XML parser.
    // It's faster and avoids heavy dependencies for this specific task.
    const urlRegex = /<loc>(.*?)<\/loc>/g;
    const urls = [];
    let match;
    while ((match = urlRegex.exec(text)) !== null) {
        urls.push(match[1]);
    }

    if (urls.length === 0) {
        // Fallback for XML namespaces which the regex might miss
        const urlRegexNs = /<url><loc>(.*?)<\/loc>/g;
        while ((match = urlRegexNs.exec(text)) !== null) {
            urls.push(match[1]);
        }
    }

    return { urls };
  } catch (error: any) {
    console.error('Sitemap fetch/parse error:', error);
    if (error instanceof z.ZodError) {
        return { urls: [], error: 'Invalid URL format provided.' };
    }
    return { urls: [], error: error.message || 'An unknown error occurred while fetching the sitemap.' };
  }
}
