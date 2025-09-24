
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronDown } from 'lucide-react';
import Logo from '@/components/logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import UserNav from './user-nav';

const mainNavLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
];

const toolsLinks = [
  { href: '/dashboard/compare', label: 'Compare' },
  { href: '/dashboard/favicon-checker', label: 'Favicon Checker' },
  { href: '/dashboard/dns-checker', label: 'DNS Checker' },
  { href: '/dashboard/speed-test', label: 'Speed Test' },
  { href: '/dashboard/ip-checker', label: 'IP Checker' },
  { href: '/dashboard/meta-generator', label: 'Meta Tag Generator' },
  { href: '/dashboard/backlink-creator', label: 'Content Generator' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, loading } = useAuth();

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        pathname === href ? 'text-primary' : 'text-muted-foreground'
      )}
      onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {mainNavLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus:outline-none">
                Tools <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {toolsLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {loading ? null : user ? (
            <UserNav />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-6 pt-8">
                {mainNavLinks.map((link) => (
                  <NavLink key={link.href} {...link} />
                ))}
                <div className="flex flex-col gap-4">
                    <h3 className="font-semibold">Tools</h3>
                    {toolsLinks.map(link => (
                        <NavLink key={link.href} {...link} />
                    ))}
                </div>
                <div className="mt-6 flex flex-col gap-4">
                  {loading ? null : user ? (
                      <Button onClick={() => {
                        // In a real app, you would call your sign-out function here
                        setIsMobileMenuOpen(false);
                      }}>Log Out</Button>
                  ) : (
                    <>
                      <Button variant="ghost" asChild>
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
