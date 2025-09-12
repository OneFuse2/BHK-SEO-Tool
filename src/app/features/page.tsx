import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    title: "AI-Powered Keyword Suggestions",
    description: "Our advanced AI analyzes your content and competitors to find high-impact keywords you might be missing. We provide relevance scores and competition data to help you prioritize the best opportunities for your business.",
    benefits: ["Discover untapped keywords", "Understand keyword relevance instantly", "Save hours on manual research"],
    imageUrl: "https://picsum.photos/seed/f1/500/300",
    dataAiHint: "graphs charts",
    align: "left"
  },
  {
    title: "Comprehensive SEO Reports",
    description: "Get a holistic view of your website's SEO health. Our reports cover over 50 data points, from on-page factors like meta tags and content quality to off-page metrics and technical performance. Visual charts make complex data easy to digest.",
    benefits: ["Get a single SEO score", "Actionable, prioritized recommendations", "Track progress over time"],
    imageUrl: "https://picsum.photos/seed/f2/500/300",
    dataAiHint: "analytics dashboard",
    align: "right"
  },
  {
    title: "Full Website Test Suite",
    description: "Go beyond traditional SEO. We test your site for performance, mobile-friendliness, security vulnerabilities, and more. A fast and secure site is crucial for ranking, and we give you the tools to ensure you're up to par.",
    benefits: ["Identify performance bottlenecks", "Ensure your site is secure", "Optimize for all devices"],
    imageUrl: "https://picsum.photos/seed/f3/500/300",
    dataAiHint: "server code",
    align: "left"
  }
];

export default function FeaturesPage() {
  return (
    <div className="bg-background">
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Powerful Features to Supercharge Your SEO
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            BHK SEO Tools is more than just a keyword tool. It's a complete suite for website optimization.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20 md:pb-28 space-y-24">
        {features.map((feature, index) => (
          <section key={index} className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`md:order-${feature.align === 'left' ? 1 : 2}`}>
              <h2 className="text-3xl font-bold text-foreground">{feature.title}</h2>
              <p className="mt-4 text-muted-foreground">{feature.description}</p>
              <ul className="mt-6 space-y-2">
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-accent mr-3" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`flex justify-center md:order-${feature.align === 'left' ? 2 : 1}`}>
              <Image
                src={feature.imageUrl}
                alt={feature.title}
                width={500}
                height={300}
                data-ai-hint={feature.dataAiHint}
                className="rounded-lg shadow-xl"
              />
            </div>
          </section>
        ))}
      </div>

       <section className="w-full py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Analyze your first website for free and see the power of AI-driven SEO.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/dashboard">Analyze Website</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
