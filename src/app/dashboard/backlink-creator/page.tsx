
'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link as LinkIcon, Loader2, Sparkles, Wand2, FileText, Upload } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  const parseSitemap = (sitemapContent: string) => {
    // This is a simple regex parser, not a full XML parser.
    const urlRegex = /<loc>(.*?)<\/loc>/g;
    const foundUrls = [];
    let match;
    while ((match = urlRegex.exec(sitemapContent)) !== null) {
        foundUrls.push(match[1]);
    }
     if (foundUrls.length === 0) {
        // Fallback for XML namespaces which the regex might miss
        const urlRegexNs = /<url><loc>(.*?)<\/loc>/g;
        while ((match = urlRegexNs.exec(sitemapContent)) !== null) {
            foundUrls.push(match[1]);
        }
    }
    return foundUrls;
  }

  const handleFetchSitemap = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setUrls([]);

    if (sitemapUrl) {
        // Fetch from URL
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
    } else if (fileInputRef.current?.files?.[0]) {
        // Process uploaded file
        const file = fileInputRef.current.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            const foundUrls = parseSitemap(content);
             if(foundUrls.length === 0) {
                toast({ title: 'No URLs Found', description: 'Could not find any URLs in the sitemap file.', variant: 'destructive'});
            }
            setUrls(foundUrls);
        };
        reader.onerror = (e) => {
            toast({ title: 'Failed to Read File', description: 'There was an error reading your sitemap file.', variant: 'destructive' });
        }
        reader.readAsText(file);
    } else {
        toast({ title: 'No Input Provided', description: 'Please provide a sitemap URL or upload a sitemap.xml file.', variant: 'destructive' });
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setSitemapUrl(''); // Clear URL input if a file is chosen
    } else {
      setFileName('');
    }
  };


  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
            <FileText className="h-12 w-12 text-primary" />
            <div>
                 <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight text-left">
                    Bulk Article Generator from Sitemap
                </h1>
                <p className="text-left text-lg md:text-xl text-muted-foreground">
                    Generate unique articles from a sitemap.
                </p>
            </div>
        </div>
        
        <div className="mt-8 text-left">
          <Card>
             <CardHeader>
                <CardTitle>Sitemap Input</CardTitle>
                <CardDescription>Provide a sitemap URL or upload a sitemap.xml file.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleFetchSitemap} className="flex flex-col gap-4">
                
                <div>
                  <label htmlFor="sitemap-url" className="block text-sm font-medium text-foreground mb-1">Sitemap URL</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="sitemap-url"
                      value={sitemapUrl}
                      onChange={(e) => {
                          setSitemapUrl(e.target.value);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                          setFileName('');
                      }}
                      placeholder="https://your-website.com/sitemap.xml"
                      className="text-base pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="relative flex items-center">
                    <div className="flex-grow border-t border-muted"></div>
                    <span className="flex-shrink mx-4 text-muted-foreground text-sm">OR</span>
                    <div className="flex-grow border-t border-muted"></div>
                </div>

                <div>
                    <label htmlFor="sitemap-file" className="block text-sm font-medium text-foreground mb-1">Upload Sitemap File</label>
                    <div className="relative">
                         <input 
                            type="file" 
                            id="sitemap-file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".xml, text/xml"
                            disabled={isLoading}
                        />
                        <Button 
                            type="button"
                            variant="outline"
                            className="w-full justify-start text-muted-foreground font-normal" 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {fileName || "Choose File"}
                        </Button>
                    </div>
                </div>
                
                <Button type="submit" size="lg" className="h-12 mt-4" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                  Get URLs & Generate
                </Button>
              </form>
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

    