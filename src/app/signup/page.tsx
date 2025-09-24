
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Github, Mail, Lock, User, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/logo';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.636,44,30.836,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
        <path fill="#3b5998" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path>
        <path fill="#fff" d="M29,24h-4v12h-6V24h-3v-5h3v-4c0-2.761,2.239-5,5-5h4v5h-4c-0.552,0-1,0.448-1,1v3h5L29,24z"></path>
    </svg>
);


export default function SignupPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-gradient-to-r from-purple-50 to-blue-50 px-4">
            <div className="absolute top-24">
                <Logo />
            </div>
            <Card className="w-full max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden grid md:grid-cols-2">
                <CardContent className="p-8 md:p-12">
                    <div className="text-left">
                        <h1 className="text-3xl font-bold tracking-tight">Create an Account</h1>
                        <p className="text-muted-foreground mt-2">Join our community to get started.</p>
                    </div>

                    <form className="mt-8 space-y-6">
                         <div className="space-y-2">
                            <Label htmlFor="fullname">Full Name</Label>
                             <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input id="fullname" type="text" placeholder="John Doe" required className="pl-10" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                             <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input id="email" type="email" placeholder="your.email@example.com" required className="pl-10" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                             <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input id="password" type="password" required className="pl-10" />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-11" size="lg">
                            Create account
                        </Button>
                    </form>

                     <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                         <Button variant="outline">
                            <GoogleIcon className="mr-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline">
                            <Github className="mr-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline">
                            <FacebookIcon className="mr-2 h-4 w-4" />
                        </Button>
                    </div>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Log in
                        </Link>
                    </p>
                </CardContent>

                <div className="hidden md:flex flex-col items-center justify-center bg-blue-50/50 p-12 text-center border-l">
                     <Image
                        src="https://picsum.photos/seed/signup-promo/400/300"
                        alt="Productivity Illustration"
                        width={400}
                        height={300}
                        data-ai-hint="team collaboration illustration"
                        className="rounded-lg"
                    />
                    <h2 className="text-2xl font-bold mt-8">Start Your Journey</h2>
                    <p className="text-muted-foreground mt-2 max-w-xs">
                       Create an account to access powerful tools and join a growing community of creators.
                    </p>
                </div>
            </Card>
        </div>
    );
}

