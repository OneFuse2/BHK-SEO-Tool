'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UrlForm() {
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
    
    // Basic URL validation
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
    
    router.push(`/dashboard/report?url=${encodeURIComponent(url)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <Input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://your-website.com"
        className="h-12 text-base flex-grow"
        required
      />
      <Button type="submit" size="lg" className="h-12">
        <Search className="mr-2 h-5 w-5" />
        Analyze
      </Button>
    </form>
  );
}
