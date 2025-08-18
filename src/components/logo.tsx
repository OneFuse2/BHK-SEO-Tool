import { Search } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary text-primary-foreground p-2 rounded-lg">
        <Search className="h-5 w-5" />
      </div>
      <span className="text-xl font-bold text-foreground">SEO AI Pro</span>
    </div>
  );
}
