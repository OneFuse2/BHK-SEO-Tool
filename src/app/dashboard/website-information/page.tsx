
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Loader2, Home, BarChart2, Shield, FileText, Globe, ThumbsUp, Database, Image, Link as LinkIcon, Heart } from 'lucide-react';
import { getWebsiteInformation, WebsiteInfoOutput } from '@/ai/flows/website-information';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const InfoRow = ({ label, value, subValue, flag }: { label: string, value: React.ReactNode, subValue?: string, flag?: string }) => (
    <div className="flex justify-between items-center py-3 border-b last:border-none">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="text-right">
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
                {flag && <span className={`fi fi-${flag.toLowerCase()}`}></span>}
                {value}
            </span>
            {subValue && <span className="text-xs text-muted-foreground">{subValue}</span>}
        </div>
    </div>
);


const LoadingSkeleton = () => (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                 <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b last:border-none">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
)


export default function WebsiteInformationPage() {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState<WebsiteInfoOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedDomain, setSubmittedDomain] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue) {
        toast({ title: "Domain is required", description: "Please enter a domain or URL to get information.", variant: "destructive" });
        return;
    };
    
    let domainToSubmit = inputValue;
    try {
        // Prepend http if no protocol is present to allow URL parsing
        const urlInput = inputValue.startsWith('http') ? inputValue : `http://${inputValue}`;
        const url = new URL(urlInput);
        domainToSubmit = url.hostname;
    } catch (error) {
        // If URL parsing fails, assume it's a plain domain.
        console.warn("Could not parse as URL, assuming plain domain:", inputValue);
    }
    
    setSubmittedDomain(domainToSubmit);
    setIsLoading(true);
    setResults(null);

    try {
        const res = await getWebsiteInformation({ domain: domainToSubmit });
        setResults(res);
    } catch (err) {
        console.error(err);
        toast({
            title: "Analysis Failed",
            description: "Could not retrieve information for this domain. The AI model may be unavailable or the domain is invalid.",
            variant: "destructive"
        });
    }
    setIsLoading(false);
  };
  
  const toolIcons = [
    { icon: <BarChart2 size={20} />, label: "Rank" },
    { icon: <Home size={20} />, label: "Homepage" },
    { icon: <FileText size={20} />, label: "Whois" },
    { icon: <Shield size={20} />, label: "Safety" },
    { icon: <Globe size={20} />, label: "DNS" },
    { icon: <ThumbsUp size={20} />, label: "Social" },
    { icon: <Database size={20} />, label: "Hosting" },
    { icon: <Image size={20} />, label: "Images" },
    { icon: <LinkIcon size={20} />, label: "Links" },
    { icon: <Heart size={20} />, label: "Health" },
  ];

  return (
    <div className="bg-muted/20 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

            <div className="text-sm text-muted-foreground mb-2">
                <span>Tools</span> &gt; <span>Website Information</span>
            </div>

            <Card>
                <CardContent className="p-6">
                     <h1 className="text-2xl font-bold text-foreground mb-4">
                        {results ? `${submittedDomain} Website Information` : 'Website Information'}
                    </h1>
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.trim())}
                        placeholder="example.com or https://example.com"
                        className="h-11 text-base flex-grow"
                        disabled={isLoading}
                        />
                        <Button type="submit" size="lg" className="h-11" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'GO'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="mt-8">
                {isLoading && <LoadingSkeleton />}

                {results && (
                    <div className="space-y-8">
                        <Card>
                            <CardContent className="p-6 text-sm text-foreground space-y-2">
                                <p>
                                    <Globe className="inline-block h-4 w-4 mr-2" />
                                    {submittedDomain} is <strong>{results.summary.age}</strong>. It is a {results.summary.traffic} site with a global rank of <strong>{results.summary.globalRank}</strong>. It has a medium PageRank of <strong>{results.summary.pageRank}</strong>, which means that the website has {results.summary.backlinks}.
                                </p>
                                <p>The server is hosted by <strong>{results.summary.hosting}</strong> and located in the <strong>{results.summary.serverLocation}</strong>.</p>
                                <p>The domain is registered with <strong>{results.summary.registrar}</strong> and will expire <strong>{results.summary.expiry}</strong>.</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-2 flex justify-around flex-wrap">
                                {toolIcons.map(item => (
                                    <Button key={item.label} variant="ghost" className="flex flex-col h-auto p-3 items-center gap-1 text-muted-foreground hover:text-primary">
                                        {item.icon}
                                        <span className="text-xs">{item.label}</span>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Home size={20} />
                                    Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pb-6">
                                <InfoRow label="Country" value={results.overview.country} flag={results.overview.countryCode} />
                                <InfoRow label="Owner" value={results.overview.owner} />
                                <InfoRow label="Registered with" value={results.overview.registeredWith} />
                                <InfoRow label="Registration date" value={results.overview.registrationDate} subValue={results.overview.registrationAge} />
                                <InfoRow label="Expiration date" value={results.overview.expirationDate} subValue={results.overview.expirationDuration} />
                                <InfoRow label="IP address" value={<a href="#" className="text-primary hover:underline">{results.overview.ipAddress} ({results.overview.ipWebsiteCount} websites)</a>} />
                                <InfoRow label="Hosted by" value={results.overview.hostedBy} />
                                <InfoRow label="Server location" value={<a href="#" className="text-primary hover:underline">{results.overview.serverLocation}</a>} />
                                <InfoRow label="Safety" value={<Badge variant={results.overview.safety === 'Safe' ? 'secondary' : 'destructive'} className="bg-green-100 text-green-800">{results.overview.safety} {results.overview.safetyScore}</Badge>} />
                            </CardContent>
                        </Card>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
}
