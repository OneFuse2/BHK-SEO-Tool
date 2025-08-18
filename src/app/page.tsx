import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrainCircuit, Search, BarChart, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import UrlForm from './dashboard/url-form';

export default function Home() {
  const features = [
    {
      icon: <BrainCircuit className="h-10 w-10 text-accent" />,
      title: 'AI Keyword Research',
      description: 'Discover high-volume, low-competition keywords perfectly tailored to your content.',
    },
    {
      icon: <BarChart className="h-10 w-10 text-accent" />,
      title: 'In-Depth SEO Reports',
      description: 'Get a comprehensive SEO score and actionable insights with beautiful, easy-to-understand reports.',
    },
    {
      icon: <Zap className="h-10 w-10 text-accent" />,
      title: 'Performance Testing',
      description: 'Analyze your page speed and get recommendations to make your site lightning-fast.',
    },
    {
      icon: <Search className="h-10 w-10 text-accent" />,
      title: 'Full Website Audits',
      description: 'Run a complete check on meta tags, security, and more to uncover every optimization opportunity.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah J., Marketing Director',
      image: 'https://placehold.co/100x100.png',
      dataAiHint: 'woman portrait',
      quote: 'SEO AI Pro has been a game-changer for our content strategy. The keyword suggestions are incredibly accurate and have saved us countless hours of manual research.',
    },
    {
      name: 'Mike R., Startup Founder',
      image: 'https://placehold.co/100x100.png',
      dataAiHint: 'man portrait',
      quote: "As a small team, we need to be efficient. This tool gives us the power of an entire SEO agency, helping us compete with much larger companies.",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-primary/5 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight">
            Elevate Your SEO with AI-Powered Insights
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            Stop guessing. Start ranking. SEO AI Pro analyzes your website to give you actionable, data-driven advice to climb the search rankings.
          </p>
          <div className="mt-8 max-w-xl mx-auto">
            <UrlForm />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Get your free, instant SEO report.</p>
        </div>
      </section>

      <section id="features" className="w-full py-20 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Everything You Need to Dominate SEO
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-center text-muted-foreground">
            Our suite of AI-powered tools is designed to cover every aspect of your website's optimization.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="items-center">
                  {feature.icon}
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="w-full bg-primary/5 py-20 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
             <h2 className="text-3xl md:text-4xl font-bold">
              Save Hours on Manual Audits
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Our AI does the heavy lifting, analyzing your URL's content, structure, and performance in seconds. Get the insights you need to make impactful changes without the tedious manual work.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/features">Explore All Features</Link>
            </Button>
          </div>
          <div>
            <Image 
              src="https://placehold.co/600x400.png"
              alt="Dashboard Mockup"
              width={600}
              height={400}
              data-ai-hint="dashboard analytics"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section id="testimonials" className="w-full py-20 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Trusted by Professionals
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card p-6 shadow-lg">
                <CardContent className="p-0">
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  <div className="mt-4 flex items-center">
                    <Avatar>
                      <AvatarImage src={testimonial.image} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="ml-4 font-semibold">{testimonial.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-24 text-center bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Boost Your Rankings?</h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Start your journey to the top of the search results today.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/dashboard">Get Started for Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
