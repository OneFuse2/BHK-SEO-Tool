
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
import { IPLookupOutput, ipLookup } from '@/ai/flows/ip-lookup';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const ResultDisplay = ({ title, data }: { title: string, data: IPLookupOutput | null }) => {
  if (!data) return null;

  if (data.status === 'fail') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Lookup Failed</AlertTitle>
            <AlertDescription>{data.message || 'Could not retrieve IP information.'}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {data.query && <CardDescription>{data.query}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Location:</span>
          <span className="font-medium">{[data.city, data.regionName, data.country].filter(Boolean).join(', ')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">ISP:</span>
          <span className="font-medium">{data.isp}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Organization:</span>
          <span className="font-medium">{data.org}</span>
        </div>
         <div className="flex justify-between">
          <span className="text-muted-foreground">Timezone:</span>
          <span className="font-medium">{data.timezone}</span>
        </div>
        {data.lat && data.lon && (
          <div className="pt-2">
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lon}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center"
            >
              <MapPin className="mr-1 h-4 w-4" /> View on Map
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


export default function IpCheckerPage() {
  const [ip, setIp] = useState('');
  const [results, setResults] = useState<IPLookupOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserIpInfo, setCurrentUserIpInfo] = useState<IPLookupOutput | null>(null);
  const [isLoadingCurrentUserIp, setIsLoadingCurrentUserIp] = useState(true);

  useEffect(() => {
    async function fetchCurrentUserIp() {
      setIsLoadingCurrentUserIp(true);
      const res = await ipLookup({});
      setCurrentUserIpInfo(res);
      setIsLoadingCurrentUserIp(false);
    }
    fetchCurrentUserIp();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ip) return;
    setIsLoading(true);
    setResults(null);
    const res = await ipLookup({ ip });
    setResults(res);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <MapPin className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
          IP Address Lookup
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Enter an IP address to find its location and other information.
        </p>
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  placeholder="8.8.8.8"
                  className="h-12 text-base flex-grow"
                  disabled={isLoading}
                />
                <Button type="submit" size="lg" className="h-12" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <MapPin className="mr-2 h-5 w-5" />
                  )}
                  Lookup IP
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="mt-12 text-left space-y-8">
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </CardContent>
            </Card>
          ) : results && (
            <ResultDisplay title="Lookup Results" data={results} />
          )}

          {isLoadingCurrentUserIp ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Current IP Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </CardContent>
            </Card>
          ) : (
            <ResultDisplay title="Your Current IP Information" data={currentUserIpInfo} />
          )}
        </div>
      </div>
    </div>
  );
}
