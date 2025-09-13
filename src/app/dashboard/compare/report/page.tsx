
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GitCompareArrows } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { suggestKeywords, AIKeywordSuggestionsOutput } from '@/ai/flows/ai-keyword-suggestions';
import { analyzeSeoAndPerformance, AISeoReportOutput } from '@/ai/flows/ai-seo-report';
import ComparisonDisplay from './comparison-display';

function ComparisonSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-40 rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-40 rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
            </div>
        </div>
    )
}

interface ReportResult {
    keywords: AIKeywordSuggestionsOutput | null;
    report: AISeoReportOutput | null;
    error?: string;
}

async function fetchUrlData(url: string): Promise<ReportResult> {
    try {
        const [keywordResult, reportResult] = await Promise.allSettled([
            suggestKeywords({ url }),
            analyzeSeoAndPerformance({ url })
        ]);

        const keywords = keywordResult.status === 'fulfilled' ? keywordResult.value : null;
        const report = reportResult.status === 'fulfilled' ? reportResult.value : null;
        
        if (reportResult.status === 'rejected') {
            throw new Error("Failed to fetch main report.");
        }

        return { keywords, report };
    } catch (e: any) {
        console.error(`Failed to fetch data for ${url}`, e);
        return { keywords: null, report: null, error: e.message || "Failed to fetch analysis data." };
    }
}


async function ComparisonDataFetcher({ url1, url2 }: { url1: string, url2: string }) {
    const [data1, data2] = await Promise.all([
        fetchUrlData(url1),
        fetchUrlData(url2)
    ]);

    return <ComparisonDisplay url1={url1} data1={data1} url2={url2} data2={data2} />;
}


export default function CompareReportPage({ searchParams }: { searchParams: { url1?: string, url2?: string } }) {
  const { url1, url2 } = searchParams;

  if (!url1 || !url2) {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Invalid Parameters</h1>
                <p className="text-muted-foreground mt-2">Please provide two URLs to compare.</p>
                <Link href="/dashboard/compare" className="mt-4 inline-block text-primary hover:underline">
                    Go back to Comparison
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-primary/5 min-h-screen">
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <GitCompareArrows className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Comparison Report</h1>
                </div>
                <Button asChild variant="outline">
                    <Link href="/dashboard/compare">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Compare Others
                    </Link>
                </Button>
            </div>

            <Suspense fallback={<ComparisonSkeleton />}>
                <ComparisonDataFetcher url1={url1} url2={url2} />
            </Suspense>
        </div>
    </div>
  );
}
