
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChromeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    const handleGoogleSignIn = () => {
        // Placeholder for Google Sign-In logic
        // In a real app, this would trigger the Firebase auth flow
        console.log("Signing in with Google...");
        // For now, we'll just redirect to the dashboard
        router.push('/dashboard');
    }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-primary/5">
        <Card className="w-full max-w-md mx-4 shadow-2xl">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl md:text-3xl">Welcome Back</CardTitle>
                <CardDescription>Sign in to access your dashboard and tools.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <Button onClick={handleGoogleSignIn} className="w-full h-12 text-base" size="lg">
                        <ChromeIcon className="mr-2 h-5 w-5" />
                        Sign in with Google
                    </Button>
                </div>
                 <p className="mt-4 text-xs text-center text-muted-foreground">
                    By signing in, you agree to our{' '}
                    <a href="/terms" className="underline hover:text-primary">
                        Terms of Service
                    </a>
                    .
                </p>
            </CardContent>
        </Card>
    </div>
  );
}

// A simple stand-in for the Google Chrome icon
const ChromeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="21.17" y1="8" x2="12" y2="8" />
        <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
        <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
    </svg>
);
