
import React from 'react';
import { Briefcase } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-2 bg-background/80 backdrop-blur-sm border rounded-full px-4 py-2 shadow-sm">
      <Briefcase className="h-6 w-6 text-primary" />
      <span className="font-bold text-lg text-foreground whitespace-nowrap">
        BHK Tools Market
      </span>
    </div>
  );
};

export default Logo;
