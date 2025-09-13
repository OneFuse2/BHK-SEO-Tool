
import CompareForm from './compare-form';
import { GitCompareArrows } from 'lucide-react';

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <GitCompareArrows className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
          Compare Website Performance
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Enter two URLs to see a side-by-side comparison of their SEO and performance metrics.
        </p>
        <div className="mt-8">
          <CompareForm />
        </div>
      </div>
    </div>
  );
}
