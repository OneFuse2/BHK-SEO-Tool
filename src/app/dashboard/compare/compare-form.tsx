
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { GitCompareArrows } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function CompareForm() {
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url1 || !url1.trim()) {
      toast({ title: 'First URL is missing', description: 'Please enter a URL to compare.', variant: 'destructive' });
      return;
    }
    try {
      new URL(url1);
    } catch (_) {
      toast({ title: 'Invalid First URL', description: 'Please enter a complete and valid URL (e.g., https://example.com).', variant: 'destructive' });
      return;
    }

    if (!url2 || !url2.trim()) {
        toast({ title: 'Second URL is missing', description: 'Please enter a second URL to compare.', variant: 'destructive' });
        return;
    }
    try {
      new URL(url2);
    } catch (_) {
      toast({ title: 'Invalid Second URL', description: 'Please enter a complete and valid URL (e.g., https://example.com).', variant: 'destructive' });
      return;
    }

    if (url1 === url2) {
      toast({ title: 'URLs are the same', description: 'Please enter two different URLs to compare.', variant: 'destructive' });
      return;
    }
    
    router.push(`/dashboard/compare/report?url1=${encodeURIComponent(url1)}&url2=${encodeURIComponent(url2)}`);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    type="url"
                    value={url1}
                    onChange={(e) => setUrl1(e.target.value)}
                    placeholder="https://your-website.com"
                    className="h-12 text-base"
                    required
                />
                <Input
                    type="url"
                    value={url2}
                    onChange={(e) => setUrl2(e.target.value)}
                    placeholder="https://competitor-website.com"
                    className="h-12 text-base"
                    required
                />
            </div>
            <Button type="submit" size="lg" className="h-12 w-full">
                <GitCompareArrows className="mr-2 h-5 w-5" />
                Compare Now
            </Button>
        </form>
      </CardContent>
    </Card>
  );
}
