import { सuspense } from 'react';
import { getBlogPost, getBlogPosts } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { suggestKeywords, AIKeywordSuggestionsOutput } from '@/ai/flows/ai-keyword-suggestions';
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
    let error: string | null = null;

    try {
        keywordData = await suggestKeywords({ url });
    } catch (e) {
        console.error(e);
        error = "Failed to fetch keyword suggestions. The AI model may be unavailable or the URL may be inaccessible."
    }

    // Mock other data
    const mockPerformanceData = {
        score: 88,
        metrics: [
            { name: "First Contentful Paint", value: "1.2s" },
            { name: "Speed Index", value: "2.1s" },
            { name: "Largest Contentful Paint", value: "1.8s" },
            { name: "Time to Interactive", value: "2.5s" },
        ]
    };

    const mockSeoScore = Math.floor(Math.random() * (95 - 70 + 1) + 70); // Random score between 70-95

    return <ReportDisplay 
        url={url} 
        keywordData={keywordData} 
        performanceData={mockPerformanceData}
        seoScore={mockSeoScore}
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
