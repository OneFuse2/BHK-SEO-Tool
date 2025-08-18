import Link from 'next/link';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: '#', label: 'Twitter' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Github className="h-5 w-5" />, href: '#', label: 'GitHub' },
  ];

  const footerLinks = [
    { title: 'Product', links: [{ href: '/features', label: 'Features' }, { href: '/pricing', label: 'Pricing' }, { href: '/dashboard', label: 'Dashboard' }, { href: '/dashboard/compare', label: 'Compare' }] },
    { title: 'Company', links: [{ href: '/blog', label: 'Blog' }, { href: '#', label: 'About Us' }, { href: '#', label: 'Contact' }] },
    { title: 'Legal', links: [{ href: '/terms', label: 'Terms of Service' }, { href: '#', label: 'Privacy Policy' }] },
  ];

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
                <Logo />
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">AI-powered SEO analysis and optimization for modern websites.</p>
            <div className="flex space-x-2 mt-4">
              {socialLinks.map(link => (
                <Button key={link.label} variant="ghost" size="icon" asChild>
                  <a href={link.href} aria-label={link.label}>{link.icon}</a>
                </Button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map(section => (
              <div key={section.title}>
                <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} bhktools.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
