
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link as LinkIcon, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

// Dummy function for now, will be replaced with actual implementation
async function generatePost(url: string, title: string) {
    console.log(`Generating post for ${url} with title "${title}"`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    // In the future, this will call the AI flow and save the post.
    return { slug: `/${title.toLowerCase().replace(/\s+/g, '-')}` };
}


export default function BacklinkCreatorPage() {
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleFetchSitemap = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sitemapUrl) {
      toast({ title: 'Sitemap URL is missing', description: 'Please enter the URL to your sitemap.xml file.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setUrls([]);
    try {
      // NOTE: This is a simplified client-side fetch and will be blocked by CORS for most external URLs.
      // A robust solution requires a server-side proxy to fetch the sitemap content.
      // For demo purposes, this may work with permissive sitemaps.
      const response = await fetch(sitemapUrl);
      if (!response.ok) throw new Error('Failed to fetch sitemap.');
      const text = await response.text();
      
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'application/xml');
      const urlNodes = xml.getElementsByTagName('loc');
      const foundUrls = Array.from(urlNodes).map(node => node.textContent || '').filter(Boolean);

      if(foundUrls.length === 0) {
        toast({ title: 'No URLs Found', description: 'Could not find any <loc> tags in the sitemap.', variant: 'destructive'});
      }
      setUrls(foundUrls);

    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to Parse Sitemap',
        description: 'Could not fetch or parse the sitemap. Please check the URL and ensure it is accessible.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleGeneratePost = async (url: string) => {
    setIsGenerating(prev => ({...prev, [url]: true}));
    try {
        const title = `AI-Generated Post for: ${new URL(url).pathname.split('/').filter(Boolean).pop() || new URL(url).hostname}`;
        const result = await generatePost(url, title);
        toast({
            title: "Post Generation Started!",
            description: "Your new blog post is being created by AI. It will be available on the blog page shortly.",
            action: (
                <Button asChild variant="outline">
                    <Link href={`/blog${result.slug}`}>View Post</Link>
                </Button>
            )
        });
    } catch (e) {
        toast({ title: 'Generation Failed', description: 'Could not generate the blog post.', variant: 'destructive'});
    } finally {
        setIsGenerating(prev => ({...prev, [url]: false}));
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <Wand2 className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
          Sitemap to Content Generator
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Paste your sitemap URL to automatically generate engaging blog posts for every page, boosting your content and internal linking structure.
        </p>
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleFetchSitemap} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    value={sitemapUrl}
                    onChange={(e) => setSitemapUrl(e.target.value)}
                    placeholder="https://your-website.com/sitemap.xml"
                    className="h-12 text-base pl-10"
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" size="lg" className="h-12" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                  Fetch URLs
                </Button>
              </form>
               <Alert className="mt-4 text-left">
                  <AlertTitle>How does this work?</AlertTitle>
                  <AlertDescription>
                    This tool fetches all the URLs from your sitemap. You can then use our AI to generate a unique, SEO-friendly blog post for each URL, using the content of that page as context.
                  </AlertDescription>
                </Alert>
            </CardContent>
          </Card>
        </div>

        {urls.length > 0 && (
            <div className="mt-12 text-left">
                <Card>
                    <CardHeader>
                        <CardTitle>URLs Found in Sitemap</CardTitle>
                        <CardDescription>Click the "Generate Post" button next to any URL to create a new blog post based on its content.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {urls.map(url => (
                                <li key={url} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                                    <Link href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate mr-4">{url}</Link>
                                    <Button size="sm" onClick={() => handleGeneratePost(url)} disabled={isGenerating[url]}>
                                        {isGenerating[url] ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                        Generate Post
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        )}
      </div>
    </div>
  );
}
