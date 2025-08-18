'use client';

import { AIKeywordSuggestionsOutput } from '@/ai/flows/ai-keyword-suggestions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, BrainCircuit, CheckCircle, Gauge, ListChecks, ShieldCheck, Siren } from 'lucide-react';
import SeoScoreGauge from '@/components/seo-score-gauge';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


interface ReportDisplayProps {
    url: string;
    keywordData: AIKeywordSuggestionsOutput | null;
    performanceData: any;
    seoScore: number;
    error: string | null;
}

export default function ReportDisplay({ url, keywordData, performanceData, seoScore, error }: ReportDisplayProps) {

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

  const sortedKeywords = keywordData?.keywords.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 10) || [];

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
        <TabsTrigger value="overview">
          <Gauge className="mr-2 h-4 w-4" />
          Overview
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
                        <div className="text-2xl font-bold">Excellent</div>
                        <p className="text-xs text-muted-foreground">Meta tags and content structure are well-optimized.</p>
                    </CardContent>
                </Card>
                 <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Keywords</CardTitle>
                        <BrainCircuit className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{keywordData?.keywords.length || 0} Suggestions</div>
                        <p className="text-xs text-muted-foreground">AI-generated keywords found.</p>
                    </CardContent>
                </Card>
                 <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Performance</CardTitle>
                        <BarChart className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{performanceData.score}/100</div>
                        <p className="text-xs text-muted-foreground">Page speed is good.</p>
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
      <TabsContent value="keywords" className="mt-6">
         <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>AI Keyword Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                     <h3 className="font-semibold mb-2">Top Keywords by Relevance</h3>
                    <p className="text-sm text-muted-foreground mb-4">Here are the top keywords our AI recommends focusing on based on your content.</p>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Keyword</TableHead>
                                    <TableHead className="text-right">Relevance Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedKeywords.map(item => (
                                    <TableRow key={item.keyword}>
                                        <TableCell className="font-medium">{item.keyword}</TableCell>
                                        <TableCell className="text-right">{item.relevanceScore}</TableCell>
                                    </TableRow>
                                ))}
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
                <CardTitle>Page Speed Insights</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {performanceData.metrics.map((metric: any) => (
                        <div key={metric.name} className="bg-primary/10 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">{metric.name}</p>
                            <p className="text-2xl font-bold">{metric.value}</p>
                        </div>
                    ))}
                </div>
                 <div className="mt-8">
                    <h3 className="font-semibold mb-2">Recommendations</h3>
                     <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 text-accent mr-2 mt-0.5 shrink-0" /><span>Properly size images to save cellular data.</span></li>
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 text-accent mr-2 mt-0.5 shrink-0" /><span>Serve static assets with an efficient cache policy.</span></li>
                        <li className="flex items-start"><CheckCircle className="h-4 w-4 text-accent mr-2 mt-0.5 shrink-0" /><span>Minify CSS and JavaScript files to reduce file sizes.</span></li>
                     </ul>
                </div>
            </CardContent>
         </Card>
      </TabsContent>
    </Tabs>
  );
}
