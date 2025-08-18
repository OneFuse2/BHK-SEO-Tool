'use client';

import { AIKeywordSuggestionsOutput } from '@/ai/flows/ai-keyword-suggestions';
import { AISeoReportOutput } from '@/ai/flows/ai-seo-report';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import SeoScoreGauge from '@/components/seo-score-gauge';
import { Siren, CheckCircle, Lightbulb } from 'lucide-react';
import Link from 'next/link';

interface ReportResult {
    keywords: AIKeywordSuggestionsOutput | null;
    report: AISeoReportOutput | null;
    error?: string;
}

interface ComparisonDisplayProps {
    url1: string;
    data1: ReportResult;
    url2: string;
    data2: ReportResult;
}

function ReportColumn({ url, data }: { url: string, data: ReportResult }) {
    if (data.error || !data.report) {
        return (
            <div className="p-4">
                 <h2 className="text-lg font-bold text-foreground truncate hover:text-primary">
                    <Link href={url} target="_blank" rel="noopener noreferrer">{url}</Link>
                </h2>
                <Alert variant="destructive" className="mt-4">
                    <Siren className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>
                        Could not retrieve analysis for this URL. It may be inaccessible or the AI model is unavailable.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    const { report } = data;

    return (
        <div className="space-y-6 p-1">
             <h2 className="text-lg font-bold text-foreground truncate hover:text-primary">
                <Link href={url} target="_blank" rel="noopener noreferrer">{url}</Link>
            </h2>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-xl">Overall SEO Score</CardTitle>
                </CardHeader>
                <CardContent>
                    <SeoScoreGauge value={report.seoScore} />
                </CardContent>
            </Card>

             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">Performance</CardTitle>
                    <CardDescription>{report.performance.score}/100 Score</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3 mt-2">
                        {report.performance.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm">
                                <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                                <span className="text-muted-foreground">{rec}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">On-Page SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold">Title Suggestion</h3>
                        <p className="text-sm text-muted-foreground mt-1 flex items-start gap-2"><Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" /> {report.onPageSeo.titleSuggestion}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold">Meta Description Suggestion</h3>
                        <p className="text-sm text-muted-foreground mt-1 flex items-start gap-2"><Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" /> {report.onPageSeo.metaDescriptionSuggestion}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


export default function ComparisonDisplay({ url1, data1, url2, data2 }: ComparisonDisplayProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <ReportColumn url={url1} data={data1} />
      <ReportColumn url={url2} data={data2} />
    </div>
  );
}
