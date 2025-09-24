'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import React from "react";


export default function RequestAccessForm() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real app, this would send an email or a notification to the admin
        toast({
            title: "Request Sent!",
            description: "Your request for access has been sent to the website administrator.",
        });
        const form = e.target as HTMLFormElement;
        form.reset();
    }

    return (
        <Card className="bg-muted/30">
            <CardHeader>
                <CardTitle>Request Access to Content Generation</CardTitle>
                <CardDescription>
                    This feature is available for approved website owners. Please enter your email to request access from the site administrator.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                    <Input 
                        type="email" 
                        placeholder="your.email@example.com" 
                        required 
                        className="flex-grow"
                    />
                    <Button type="submit">
                        <Send className="mr-2 h-4 w-4"/>
                        Request Access
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
