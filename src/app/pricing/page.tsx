import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'For individuals and hobbyists starting out.',
    features: [
      '1 website analysis per day',
      'Basic SEO metrics',
      'AI Keyword Suggestions (10)',
      'Limited support',
    ],
    cta: 'Get Started',
    href: '/dashboard',
    isPopular: false,
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'For professionals and small businesses.',
    features: [
      'Unlimited website analyses',
      'Full SEO reports',
      'AI Keyword Suggestions (Unlimited)',
      'Performance & Security tests',
      'Priority email support',
    ],
    cta: 'Choose Pro',
    href: '/dashboard',
    isPopular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large teams and agencies.',
    features: [
      'Everything in Pro, plus:',
      'API access',
      'Team collaboration tools',
      'Dedicated account manager',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    href: '#',
    isPopular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-background">
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Find the Perfect Plan
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            Choose the plan that fits your needs and start improving your SEO today. No hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col h-full ${tier.isPopular ? 'border-primary shadow-2xl scale-105' : 'shadow-lg'}`}>
               {tier.isPopular && (
                  <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-semibold rounded-t-lg">
                    Most Popular
                  </div>
                )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-center mb-6">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.price !== 'Custom' && tier.price !== '$0' && <span className="text-muted-foreground">/month</span>}
                </div>
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant={tier.isPopular ? 'default' : 'secondary'}>
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
