
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
