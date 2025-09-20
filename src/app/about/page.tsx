
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Target, Eye, Users } from 'lucide-react';

const teamMembers = [
  {
    name: 'Jane Doe',
    role: 'Founder & CEO',
    image: 'https://picsum.photos/seed/team1/100/100',
    dataAiHint: 'woman portrait',
  },
  {
    name: 'John Smith',
    role: 'Lead Developer',
    image: 'https://picsum.photos/seed/team2/100/100',
    dataAiHint: 'man portrait',
  },
  {
    name: 'Emily White',
    role: 'Head of SEO Strategy',
    image: 'https://picsum.photos/seed/team3/100/100',
    dataAiHint: 'person portrait',
  },
];


export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="w-full py-20 md:py-28 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            About BHK SEO Tools
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            We're on a mission to democratize SEO and empower businesses of all sizes to succeed online.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground">
                <h2 className="text-3xl font-bold">Our Story</h2>
                <p>
                BHK SEO Tools was born from a simple observation: professional-grade SEO tools were often too complex, too expensive, or both. Small businesses, startups, and individual creators were left struggling to compete with larger corporations with dedicated marketing teams.
                </p>
                <p>
                Founded in 2024 by a team of passionate developers and SEO experts, we set out to change that. We believe that everyone should have access to the insights and technology needed to improve their online presence. We leveraged the power of AI to build a suite of tools that is not only powerful but also intuitive and affordable.
                </p>
            </div>
            <div>
                 <Image
                    src="https://picsum.photos/seed/about1/500/350"
                    alt="Team working on laptops"
                    width={500}
                    height={350}
                    data-ai-hint="team collaboration"
                    className="rounded-lg shadow-xl"
                />
            </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold">What We Believe In</h2>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <Target className="h-10 w-10 text-accent mb-4" />
                    <h3 className="text-xl font-semibold">Our Mission</h3>
                    <p className="mt-2 text-muted-foreground">To provide powerful, easy-to-use SEO tools that help businesses grow and succeed in the digital landscape.</p>
                </div>
                 <div className="flex flex-col items-center">
                    <Eye className="h-10 w-10 text-accent mb-4" />
                    <h3 className="text-xl font-semibold">Our Vision</h3>
                    <p className="mt-2 text-muted-foreground">A level playing field where the best ideas and businesses can win, regardless of their budget or size.</p>
                </div>
                 <div className="flex flex-col items-center">
                    <Users className="h-10 w-10 text-accent mb-4" />
                    <h3 className="text-xl font-semibold">Our Values</h3>
                    <p className="mt-2 text-muted-foreground">Innovation, integrity, and an unwavering focus on customer success guide everything we do.</p>
                </div>
            </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Meet the Team</h2>
           <p className="mt-4 text-lg text-muted-foreground">
            We are a small, dedicated team of builders and problem-solvers.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={member.image} alt={member.name} data-ai-hint={member.dataAiHint} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full py-20 bg-primary/5 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold">Join Us on Our Mission</h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Ready to take control of your SEO? Analyze your website for free and see what's possible.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/dashboard">Get Started for Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
