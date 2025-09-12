
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search } from 'lucide-react';

export default function DnsCheckerPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <Search className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
          DNS Lookup Tool
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Enter a domain name to check its DNS records. (Feature coming soon!)
        </p>
        <div className="mt-8">
            <Card>
                <CardContent className="p-6">
                    <form className="flex flex-col sm:flex-row gap-2">
                        <Input
                            placeholder="example.com"
                            className="h-12 text-base flex-grow"
                            disabled
                        />
                        <Button type="submit" size="lg" className="h-12" disabled>
                            <Search className="mr-2 h-5 w-5" />
                            Lookup DNS
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>

        <div className="mt-12 text-left">
            <Card>
                <CardHeader>
                    <CardTitle>DNS Records</CardTitle>
                    <CardDescription>Results will be displayed here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Enter a domain above to start a lookup.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
