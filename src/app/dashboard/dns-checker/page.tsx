'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';
import { DnsLookupOutput, dnsLookup } from '@/ai/flows/dns-lookup';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DnsCheckerPage() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<DnsLookupOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!domain) return;
    setIsLoading(true);
    setResults(null);
    const res = await dnsLookup({ domain });
    setResults(res);
    setIsLoading(false);
  };

  const groupRecords = (records: DnsLookupOutput['records'] = []) => {
    return records.reduce((acc, record) => {
        (acc[record.type] = acc[record.type] || []).push(record);
        return acc;
    }, {} as Record<string, typeof records>);
  }

  const groupedResults = groupRecords(results?.records);


  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <Search className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
          DNS Lookup Tool
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Enter a domain name to check its DNS records in real-time.
        </p>
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                  className="h-12 text-base flex-grow"
                  disabled={isLoading}
                />
                <Button type="submit" size="lg" className="h-12" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-5 w-5" />
                  )}
                  Lookup DNS
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-left">
          {isLoading && (
             <Card>
                <CardHeader>
                    <CardTitle>Looking up records...</CardTitle>
                    <CardDescription>Please wait while we fetch the DNS records.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
          )}

          {results && (
            <Card>
              <CardHeader>
                <CardTitle>DNS Records for {domain}</CardTitle>
                <CardDescription>
                  {results.records.length > 0
                    ? `Found ${results.records.length} records.`
                    : 'No records found.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{results.error}</AlertDescription>
                    </Alert>
                )}

                {Object.entries(groupedResults).map(([type, records]) => (
                    <div key={type}>
                        <h3 className="font-bold text-lg mb-2">{type} Records</h3>
                        <div className="rounded-md border text-sm">
                            {records.map((record, index) => (
                                <div key={index} className="p-3 border-b last:border-b-0 bg-muted/20">
                                    {record.address && <p><strong>Address:</strong> {record.address}</p>}
                                    {record.value && <p className="break-all"><strong>Value:</strong> {record.value}</p>}
                                    {record.exchange && <p><strong>Exchange:</strong> {record.exchange}</p>}
                                    {record.priority !== undefined && <p><strong>Priority:</strong> {record.priority}</p>}
                                    {record.ttl && <p><strong>TTL:</strong> {record.ttl}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
