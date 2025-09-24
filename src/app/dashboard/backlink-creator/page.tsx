'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link as LinkIcon, Loader2, Sparkles, Wand2, FileText, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { createBlogPostFromUrl } from '@/ai/flows/create-blog-post-from-url';
import { generateMetaTags } from '@/ai/flows/meta-tag-generator';
import { fetchSitemapUrls } from '@/app/actions/fetch-sitemap';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { BlogPost } from '@/lib/blog-data';
import RequestAccessForm from './request-access-form';


async function generatePost(url: string, title: string): Promise<BlogPost & { slug: string }> {
    console.log(`Generating post for ${url} with title "${title}"`);
    const newPostData = await createBlogPostFromUrl({ url, title });
    
    const newPost: BlogPost = {
      ...newPostData,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };

    try {
        const response = await fetch('/api/add-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save post');
        }

        const result = await response.json();
        return { ...newPost, slug: result.slug };

    } catch (error) {
        console.error("Failed to save post via API", error);
        throw new Error('Failed to save the new post.');
    }
}


interface ArticleState {
    title: string;
    isGeneratingTitle: boolean;
    content: string;
    isGenerating: boolean;
    generatedPost: (BlogPost & { slug: string }) | null;
}

export default function BacklinkCreatorPage() {
  // In a real app, this would come from your authentication system (e.g., Firebase Auth roles/claims)
  const isOwner = false;

  const [sitemapUrl, setSitemapUrl] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [articles, setArticles] = useState<Record<string, ArticleState>>({});

  const parseSitemap = (sitemapContent: string) => {
    const urlRegex = /<loc>(.*?)<\/loc>/g;
    const foundUrls = [];
    let match;
    while ((match = urlRegex.exec(sitemapContent)) !== null) {
        foundUrls.push(match[1]);
    }
     if (foundUrls.length === 0) {
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
    setArticles({});

    let sitemapContent = '';

    if (sitemapUrl) {
        try {
            const result = await fetchSitemapUrls(sitemapUrl);
            if (result.error) throw new Error(result.error);
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
        const file = fileInputRef.current.files[0];
        try {
            sitemapContent = await file.text();
            const foundUrls = parseSitemap(sitemapContent);
            if(foundUrls.length === 0) {
                toast({ title: 'No URLs Found', description: 'Could not find any URLs in the sitemap file.', variant: 'destructive'});
            }
            setUrls(foundUrls);
        } catch (e) {
            toast({ title: 'Failed to Read File', description: 'There was an error reading your sitemap file.', variant: 'destructive' });
        }
    } else {
        toast({ title: 'No Input Provided', description: 'Please provide a sitemap URL or upload a sitemap.xml file.', variant: 'destructive' });
    }

    setIsLoading(false);
  };
  
  const handleGenerateTitle = async (url: string) => {
    setArticles(prev => ({
        ...prev, 
        [url]: { title: '', content: '', isGenerating: false, generatedPost: null, isGeneratingTitle: true }
    }));
     try {
      const { title } = await generateMetaTags({ url });
      setArticles(prev => ({
        ...prev,
        [url]: { ...prev[url], title: title, isGeneratingTitle: false }
      }));
    } catch (e) {
      toast({ title: 'Title Generation Failed', description: 'Could not generate a title for this URL.', variant: 'destructive' });
      setArticles(prev => ({ ...prev, [url]: { ...prev[url], isGeneratingTitle: false }}));
    }
  }

  const handleGeneratePost = async (url: string) => {
    setArticles(prev => ({
        ...prev, 
        [url]: { ...prev[url], content: '', isGenerating: true, generatedPost: null }
    }));

    try {
        const title = articles[url]?.title || ''; // Use user-provided title if available
        const post = await generatePost(url, title);
        
        setArticles(prev => ({
            ...prev,
            [url]: { ...prev[url], isGenerating: false, content: post.content, generatedPost: post }
        }));
        
        toast({
            title: "Blog Post Generated!",
            description: "Your new blog post is now available on the blog page.",
            action: (
                <Button asChild variant="outline">
                    <Link href={`/blog/${post.slug}`} target="_blank">View Post</Link>
                </Button>
            )
        });
    } catch (e: any) {
        setArticles(prev => ({ ...prev, [url]: { ...prev[url], isGenerating: false }}));
        toast({ title: 'Generation Failed', description: e.message || 'Could not generate the blog post.', variant: 'destructive'});
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
                  Get URLs
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {urls.length > 0 && (
            <div className="mt-12 text-left">
                <Card>
                    <CardHeader>
                        <CardTitle>Generated Articles</CardTitle>
                        <CardDescription>
                            {isOwner ? "Here are the articles generated from your sitemap. Click on a URL to view and edit its article." : "Article generation is only available for website owners. You can see the URLs found below."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {urls.map(url => (
                                <AccordionItem value={url} key={url}>
                                    <AccordionTrigger>{url}</AccordionTrigger>
                                    <AccordionContent>
                                        {isOwner ? (
                                            <div className="p-4 bg-muted/50 rounded-md space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground mb-1">Article Title</label>
                                                    <div className="relative">
                                                        <Input 
                                                            placeholder="Enter a title or let AI generate one"
                                                            value={articles[url]?.title || ''}
                                                            onChange={(e) => setArticles(prev => ({...prev, [url]: {...prev[url], title: e.target.value, isGenerating: false, content: '', generatedPost: null, isGeneratingTitle: false }}))}
                                                            className="pr-10"
                                                            disabled={articles[url]?.isGeneratingTitle}
                                                        />
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                                            onClick={() => handleGenerateTitle(url)}
                                                            disabled={articles[url]?.isGeneratingTitle || articles[url]?.isGenerating}
                                                        >
                                                            {articles[url]?.isGeneratingTitle ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5 text-muted-foreground" />}
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground mb-1">Generated Content</label>
                                                    <Textarea 
                                                        placeholder="Click 'Generate Article' to create content."
                                                        readOnly 
                                                        value={articles[url]?.isGenerating ? 'Generating...' : articles[url]?.content || ''}
                                                        rows={10}
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <Button onClick={() => handleGeneratePost(url)} disabled={articles[url]?.isGenerating || articles[url]?.isGeneratingTitle}>
                                                        {articles[url]?.isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                                        Generate Article
                                                    </Button>
                                                    {articles[url]?.generatedPost && (
                                                        <Button asChild variant="outline">
                                                            <Link href={`/blog/${articles[url].generatedPost?.slug}`} target="_blank">View Post</Link>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <RequestAccessForm />
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        )}
      </div>
    </div>
  );
}
