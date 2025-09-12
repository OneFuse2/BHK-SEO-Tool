
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ImageUp, Link as LinkIcon, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FaviconCheckerPage() {
  const [url, setUrl] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url || !url.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid URL.',
        variant: 'destructive',
      });
      return;
    }
    
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
    
    router.push(`/dashboard/favicon-checker/report?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <Eye className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
          Real-time Favicon Checker
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          See how your website's favicon looks across different browsers and modes. Just enter your URL to get started.
        </p>
        <div className="mt-8">
            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-grow">
                             <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://your-website.com"
                                className="h-12 text-base pl-10"
                                required
                            />
                        </div>
                        <Button type="submit" size="lg" className="h-12">
                            <Eye className="mr-2 h-5 w-5" />
                            Check Favicon
                        </Button>
                    </form>
                    <div className="relative mt-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                            Or
                            </span>
                        </div>
                    </div>
                    <Button variant="outline" size="lg" className="h-12 w-full mt-4" disabled>
                        <ImageUp className="mr-2 h-5 w-5" />
                        Upload an Image (Coming Soon)
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
