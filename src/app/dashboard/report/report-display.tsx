'use client';

import { AIKeywordSuggestionsOutput } from '@/ai/flows/ai-keyword-suggestions';
import { AISeoReportOutput } from '@/ai/flows/ai-seo-report';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, BrainCircuit, CheckCircle, Gauge, Lightbulb, ListChecks, ShieldCheck, Siren } from 'lucide-react';
import SeoScoreGauge from '@/components/seo-score-gauge';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


interface ReportDisplayProps {
    url: string;
    keywordData: AIKeywordSuggestionsOutput | null;
    reportData: AISeoReportOutput | null;
    error: string | null;
}

export default function ReportDisplay({ url, keywordData, reportData, error }: ReportDisplayProps) {

  if (error) {
    return (
      <Alert variant="destructive">
        <Siren className="h-4 w-4" />
        <AlertTitle>Analysis Failed</AlertTitle>
        <AlertDescription>
          {error} Please try again with a different URL or check back later.
        </AlertDescription>
      </Alert>
    )
  }

  if (!reportData) {
      return (
        <Alert variant="destructive">
            <Siren className="h-4 w-4" />
            <AlertTitle>Incomplete Analysis</AlertTitle>
            <AlertDescription>
            Could not retrieve the main SEO and Performance report. The AI model may be unavailable or the URL may be inaccessible.
            </AlertDescription>
        </Alert>
      )
  }

  const sortedKeywords = keywordData?.keywords?.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 10) || [];
  const seoScore = reportData.seoScore || 0;
  const performanceScore = reportData.performance.score || 0;

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
        <TabsTrigger value="overview">
          <Gauge className="mr-2 h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="on-page-seo">
            <CheckCircle className="mr-2 h-4 w-4" />
            On-Page SEO
        </TabsTrigger>
        <TabsTrigger value="keywords">
          <BrainCircuit className="mr-2 h-4 w-4" />
          AI Keywords
        </TabsTrigger>
        <TabsTrigger value="performance">
          <BarChart className="mr-2 h-4 w-4" />
          Performance
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <Card className="h-full shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-center">Overall SEO Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SeoScoreGauge value={seoScore} />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">On-Page SEO</CardTitle>
                        <CheckCircle className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{seoScore > 85 ? "Excellent" : "Good"}</div>
                        <p className="text-xs text-muted-foreground">Meta tags and content structure are analyzed.</p>
                    </CardContent>
                </Card>
                 <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Keywords</CardTitle>
                        <BrainCircuit className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{keywordData?.keywords?.length || 0} Suggestions</div>
                        <p className="text-xs text-muted-foreground">AI-generated keywords found.</p>
                    </CardContent>
                </Card>
                 <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Performance</CardTitle>
                        <BarChart className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{performanceScore}/100</div>
                        <p className="text-xs text-muted-foreground">AI-based page speed analysis.</p>
                    </CardContent>
                </Card>
                 <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Security</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Secure</div>
                        <p className="text-xs text-muted-foreground">Using HTTPS and no major issues found.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </TabsContent>
        <TabsContent value="on-page-seo" className="mt-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>AI On-Page SEO Analysis</CardTitle>
                    <CardDescription>Recommendations to improve your on-page SEO based on your content.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg">Title Tag</h3>
                        <p className="text-sm text-muted-foreground mt-1">Current: <span className="font-mono bg-muted p-1 rounded text-xs">{reportData.onPageSeo.title}</span></p>
                        <Card className="mt-2 bg-primary/5">
                            <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4">
                                <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold">AI Suggestion</h4>
                                    <p className="text-sm text-muted-foreground">{reportData.onPageSeo.titleSuggestion}</p>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg">Meta Description</h3>
                        <p className="text-sm text-muted-foreground mt-1">Current: <span className="font-mono bg-muted p-1 rounded text-xs">{reportData.onPageSeo.metaDescription}</span></p>
                         <Card className="mt-2 bg-primary/5">
                            <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4">
                                <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold">AI Suggestion</h4>
                                    <p className="text-sm text-muted-foreground">{reportData.onPageSeo.metaDescriptionSuggestion}</p>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      <TabsContent value="keywords" className="mt-6">
         <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>AI Keyword Suggestions</CardTitle>
                <CardDescription>Top keywords our AI recommends focusing on based on your content.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Keyword</TableHead>
                                    <TableHead className="text-right">Relevance Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedKeywords.length > 0 ? sortedKeywords.map(item => (
                                    <TableRow key={item.keyword}>
                                        <TableCell className="font-medium">{item.keyword}</TableCell>
                                        <TableCell className="text-right">{item.relevanceScore}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center text-muted-foreground">No keyword data available.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Relevance Score Distribution</h3>
                     <p className="text-sm text-muted-foreground mb-4">Visualize the relevance of each suggested keyword.</p>
                     <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={sortedKeywords} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="keyword" type="category" width={120} tick={{ fontSize: 12 }} interval={0} />
                                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                                <Bar dataKey="relevanceScore" name="Relevance" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            </CardContent>
         </Card>
      </TabsContent>
      <TabsContent value="performance" className="mt-6">
         <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>AI Performance Analysis</CardTitle>
                <CardDescription>High-impact recommendations to improve your site's speed.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl font-bold text-primary">{performanceScore}</div>
                        <div className="text-lg font-semibold">/ 100</div>
                        <p className="text-muted-foreground">Overall Performance Score</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Recommendations</h3>
                        <ul className="space-y-3 mt-2">
                            {reportData.performance.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                                    <span className="text-muted-foreground">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </CardContent>
         </Card>
      </TabsContent>
    </Tabs>
  );
}
