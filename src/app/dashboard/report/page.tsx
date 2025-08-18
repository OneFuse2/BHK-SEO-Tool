import { Suspense } from 'react';
import { getBlogPost, getBlogPosts } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { suggestKeywords, AIKeywordSuggestionsOutput } from '@/ai/flows/ai-keyword-suggestions';
import { analyzeSeoAndPerformance, AISeoReportOutput } from '@/ai/flows/ai-seo-report';
import ReportDisplay from './report-display';

function ReportSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-10 w-24" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-40 rounded-lg" />
                <Skeleton className="h-40 rounded-lg" />
                <Skeleton className="h-40 rounded-lg" />
            </div>
            <div>
                <Skeleton className="h-10 w-1/3 mb-4" />
                <Skeleton className="h-64 w-full rounded-lg" />
            </div>
        </div>
    )
}

async function ReportDataFetcher({ url }: { url: string }) {
    let keywordData: AIKeywordSuggestionsOutput | null = null;
    let reportData: AISeoReportOutput | null = null;
    let error: string | null = null;

    try {
        // Run requests in parallel
        const [keywordResult, reportResult] = await Promise.allSettled([
            suggestKeywords({ url }),
            analyzeSeoAndPerformance({ url })
        ]);

        if (keywordResult.status === 'fulfilled') {
            keywordData = keywordResult.value;
        } else {
            console.error("Keyword suggestion failed:", keywordResult.reason);
        }

        if (reportResult.status === 'fulfilled') {
            reportData = reportResult.value;
        } else {
            console.error("SEO & Perf analysis failed:", reportResult.reason);
        }

        if (keywordResult.status === 'rejected' && reportResult.status === 'rejected') {
             throw new Error("All AI analysis tasks failed.");
        }

    } catch (e) {
        console.error(e);
        error = "Failed to fetch analysis data. The AI model may be unavailable or the URL may be inaccessible."
    }

    return <ReportDisplay 
        url={url} 
        keywordData={keywordData} 
        reportData={reportData}
        error={error}
    />;
}


export default function ReportPage({ searchParams }: { searchParams: { url?: string } }) {
  const url = searchParams?.url;

  if (!url) {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Invalid URL</h1>
                <p className="text-muted-foreground mt-2">Please provide a URL to analyze.</p>
                <Link href="/dashboard" className="mt-4 inline-block text-primary hover:underline">
                    Go back to Dashboard
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-primary/5 min-h-full">
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">SEO Report For</h1>
            <Link href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                {url}
            </Link>

            <div className="mt-8">
                 <Suspense fallback={<ReportSkeleton />}>
                    <ReportDataFetcher url={url} />
                </Suspense>
            </div>
        </div>
    </div>
  );
}
