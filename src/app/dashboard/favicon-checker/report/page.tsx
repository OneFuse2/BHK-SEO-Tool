
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import FaviconDisplay from './favicon-display';


function FaviconSkeleton() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                </div>
                 <div className="space-y-4">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                </div>
            </div>
             <div className="space-y-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-32 w-full rounded-lg" />
            </div>
        </div>
    )
}

// A simplified favicon fetcher. A real one would need to parse the HTML head.
// For now, we'll try the default /favicon.ico path.
async function FaviconDataFetcher({ url, imageData }: { url?: string, imageData?: string }) {
    let faviconUrl = '';
    let error: string | null = null;
    
    if (imageData) {
        faviconUrl = imageData;
    } else if (url) {
        try {
            const urlObject = new URL(url);
            // This is a simplified approach. A robust solution would parse the HTML
            // to find <link rel="icon"> tags.
            const potentialFaviconUrl = `${urlObject.origin}/favicon.ico`;

            // Check if the favicon.ico exists
            const response = await fetch(potentialFaviconUrl, { method: 'HEAD', redirect: 'follow' });
            
            if (response.ok) {
                faviconUrl = potentialFaviconUrl;
            } else {
                // As a fallback, try to use Google's favicon service
                faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${urlObject.hostname}`;
            }
        } catch(e) {
            console.error(e);
            error = "Could not construct a valid URL or fetch the favicon."
        }
    } else {
         error = "No URL or image data provided."
    }

    return <FaviconDisplay siteUrl={url || "local-preview"} faviconUrl={faviconUrl} error={error} />;
}


export default function FaviconReportPage({ searchParams }: { searchParams: { url?: string, imageData?: string, siteUrl?: string } }) {
  const { url, imageData, siteUrl } = searchParams;
  const displayUrl = url || siteUrl || "Uploaded Image";

  if (!url && !imageData) {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Invalid Input</h1>
                <p className="text-muted-foreground mt-2">Please provide a URL or upload an image to check.</p>
                <Link href="/dashboard/favicon-checker" className="mt-4 inline-block text-primary hover:underline">
                    Go back to Checker
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-primary/5 min-h-full">
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                 <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Favicon Preview For</h1>
                    {displayUrl.startsWith('http') ? (
                         <Link href={displayUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                            {displayUrl}
                        </Link>
                    ) : (
                        <p className="text-primary break-all">{displayUrl}</p>
                    )}
                </div>
                <Button asChild variant="outline">
                    <Link href="/dashboard/favicon-checker">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Check Another
                    </Link>
                </Button>
            </div>

            <Suspense fallback={<FaviconSkeleton />}>
                <FaviconDataFetcher url={url} imageData={imageData} />
            </Suspense>
        </div>
    </div>
  );
}
