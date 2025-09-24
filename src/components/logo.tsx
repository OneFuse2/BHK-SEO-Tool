
import React from 'react';
import { Search } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Search className="h-8 w-8 text-primary" />
      <span className="font-bold text-2xl text-foreground whitespace-nowrap">
        BHK SEO Tools
      </span>
    </div>
  );
};

export default Logo;
