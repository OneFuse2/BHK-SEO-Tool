
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Loader2, Zap, CheckCircle } from 'lucide-react';
import { AISeoReportOutput, analyzeSeoAndPerformance } from '@/ai/flows/ai-seo-report';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import SeoScoreGauge from '@/components/seo-score-gauge';


export default function SpeedTestPage() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<AISeoReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) return;

    try {
      new URL(url);
    } catch (_) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a complete and valid URL (e.g., https://example.com).',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResults(null);
    try {
        const res = await analyzeSeoAndPerformance({ url });
        setResults(res);
    } catch (e) {
        console.error(e);
        toast({
            title: 'Analysis Failed',
            description: 'Could not analyze the URL. The AI model might be unavailable or the URL is not accessible.',
            variant: 'destructive'
        });
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <Zap className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
          Website Speed Test
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Enter a URL to analyze its performance and get AI-powered recommendations to make it faster.
        </p>
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="h-12 text-base flex-grow"
                  disabled={isLoading}
                />
                <Button type="submit" size="lg" className="h-12" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-5 w-5" />
                  )}
                  Test Speed
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-left">
          {isLoading && (
             <Card>
                <CardHeader>
                    <CardTitle>Analyzing Performance...</CardTitle>
                    <CardDescription>Please wait while we test your website's speed.</CardDescription>
                </CardHeader>
                <CardContent className="text-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                </CardContent>
            </Card>
          )}

          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Report for <Link href={url} target='_blank' rel='noopener noreferrer' className='text-primary hover:underline'>{url}</Link></CardTitle>
                <CardDescription>
                  Here is the AI-driven performance analysis for your website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="flex justify-center">
                         <div className="relative flex items-center justify-center w-48 h-48 mx-auto">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle className="text-muted/50" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50"/>
                                <circle strokeWidth="10" strokeLinecap="round" stroke="hsl(var(--primary))" fill="transparent" r="45" cx="50" cy="50" style={{ strokeDasharray: `${2 * Math.PI * 45}`, strokeDashoffset: `${2 * Math.PI * 45 * (1 - results.performance.score / 100)}`, transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1.5s ease-out' }}/>
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-primary">{results.performance.score}</span>
                                <span className="text-sm text-muted-foreground">Out of 100</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">AI Recommendations</h3>
                        <ul className="space-y-3 mt-2">
                            {results.performance.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                                    <span className="text-muted-foreground text-sm">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
