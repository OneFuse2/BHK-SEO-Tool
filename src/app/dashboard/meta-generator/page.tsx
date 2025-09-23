'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wand2, Loader2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateMetaTags, MetaTagGeneratorOutput } from '@/ai/flows/meta-tag-generator';
import { Badge } from '@/components/ui/badge';

export default function MetaGeneratorPage() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<MetaTagGeneratorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) {
        toast({ title: 'URL is missing', description: 'Please enter a URL to generate meta tags.', variant: 'destructive'});
        return;
    };

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
      const res = await generateMetaTags({ url });
      setResults(res);
    } catch (e) {
      console.error(e);
      toast({
        title: 'Generation Failed',
        description: 'Could not generate meta tags. The AI model might be unavailable or the URL is not accessible.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };
  
  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
        toast({ title: 'Copied!', description: `${fieldName} copied to clipboard.`});
    }, (err) => {
        toast({ title: 'Failed to copy', description: `Could not copy ${fieldName} to clipboard.`, variant: 'destructive'});
    });
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <Wand2 className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
          Meta Tag & Keyword Generator
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Enter a URL and let our AI generate SEO-optimized titles, descriptions, and keywords for you.
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
                    <Wand2 className="mr-2 h-5 w-5" />
                  )}
                  Generate
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-left">
          {isLoading && (
            <Card>
              <CardHeader>
                <CardTitle>Generating...</CardTitle>
                <CardDescription>Please wait while our AI analyzes your page.</CardDescription>
              </CardHeader>
              <CardContent className="text-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              </CardContent>
            </Card>
          )}

          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Meta Tags</CardTitle>
                <CardDescription>
                  Here are the AI-generated meta tags for your URL.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Title */}
                <div>
                  <h3 className="font-semibold text-lg">Title Tag</h3>
                  <div className="relative mt-2">
                    <p className="bg-muted text-muted-foreground rounded-md p-3 pr-10 text-sm font-mono break-words">{results.title}</p>
                    <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8" onClick={() => copyToClipboard(results.title, 'Title')}>
                        <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Meta Description */}
                <div>
                  <h3 className="font-semibold text-lg">Meta Description</h3>
                   <div className="relative mt-2">
                    <p className="bg-muted text-muted-foreground rounded-md p-3 pr-10 text-sm font-mono break-words">{results.metaDescription}</p>
                    <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8" onClick={() => copyToClipboard(results.metaDescription, 'Meta Description')}>
                        <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <h3 className="font-semibold text-lg">Keywords</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {results.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-base">{keyword}</Badge>
                    ))}
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
