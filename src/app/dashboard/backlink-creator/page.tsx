
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link as LinkIcon, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { createBlogPostFromUrl } from '@/ai/flows/create-blog-post-from-url';
import { fetchSitemapUrls } from '@/app/actions/fetch-sitemap';
import { addBlogPost } from '@/lib/blog-data';


async function generatePost(url: string, title: string) {
    console.log(`Generating post for ${url} with title "${title}"`);
    const newPostData = await createBlogPostFromUrl({ url, title });
    
    // In a real app this would be a server action to write to a DB
    // For now, this is a client-side simulation and won't persist
    const newPost = {
      ...newPostData,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };

    // This is still a limitation - we can't directly trigger a file write from a client component
    // in a simple way without a dedicated API route or server action. 
    // We will create a server action for this.
    try {
        const response = await fetch('/api/add-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save post');
        }

        const result = await response.json();
        return { slug: result.slug };

    } catch (error) {
        console.error("Failed to save post via API", error);
        throw new Error('Failed to save the new post.');
    }
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
        const result = await fetchSitemapUrls(sitemapUrl);
        if (result.error) {
            throw new Error(result.error);
        }
        
        if(result.urls.length === 0) {
            toast({ title: 'No URLs Found', description: 'Could not find any URLs in the sitemap.', variant: 'destructive'});
        }
        setUrls(result.urls);

    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Failed to Parse Sitemap',
        description: error.message || 'Could not fetch or parse the sitemap. Please check the URL and ensure it is accessible.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleGeneratePost = async (url: string) => {
    setIsGenerating(prev => ({...prev, [url]: true}));
    try {
        const title = `AI-Generated content for ${url}`;
        const result = await generatePost(url, title);
        toast({
            title: "Blog Post Generated!",
            description: "Your new blog post is now available on the blog page.",
            action: (
                <Button asChild variant="outline">
                    <Link href={`/blog/${result.slug}`}>View Post</Link>
                </Button>
            )
        });
    } catch (e: any) {
        toast({ title: 'Generation Failed', description: e.message || 'Could not generate the blog post.', variant: 'destructive'});
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
