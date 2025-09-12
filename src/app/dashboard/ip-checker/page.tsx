
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function IpCheckerPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <MapPin className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
          IP Address Lookup
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Enter an IP address to find its location and other information. (Feature coming soon!)
        </p>
        <div className="mt-8">
            <Card>
                <CardContent className="p-6">
                    <form className="flex flex-col sm:flex-row gap-2">
                        <Input
                            placeholder="8.8.8.8"
                            className="h-12 text-base flex-grow"
                            disabled
                        />
                        <Button type="submit" size="lg" className="h-12" disabled>
                            <MapPin className="mr-2 h-5 w-5" />
                            Lookup IP
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
        <div className="mt-8 text-left">
             <Card>
                <CardHeader>
                    <CardTitle>Your Current IP Information</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground">Your IP information will be displayed here automatically.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
