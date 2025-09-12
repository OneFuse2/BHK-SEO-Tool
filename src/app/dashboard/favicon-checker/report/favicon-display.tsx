
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Siren } from 'lucide-react';

interface FaviconDisplayProps {
    siteUrl: string;
    faviconUrl: string;
    error: string | null;
}

const BrowserTab = ({ theme, faviconUrl, siteTitle }: { theme: 'light' | 'dark', faviconUrl: string, siteTitle: string }) => {
    const isLight = theme === 'light';
    const bgColor = isLight ? 'bg-slate-200' : 'bg-slate-800';
    const textColor = isLight ? 'text-slate-800' : 'text-slate-200';
    const tabColor = isLight ? 'bg-white' : 'bg-slate-700';

    return (
        <div className={`${bgColor} ${textColor} p-2 rounded-t-lg font-sans text-sm`}>
            <div className={`${tabColor} flex items-center gap-2 p-2 rounded-md shadow-md`}>
                {faviconUrl && <Image src={faviconUrl} alt="favicon" width={16} height={16} className="shrink-0" />}
                <span className="truncate">{siteTitle}</span>
            </div>
        </div>
    )
}

const GoogleSearchResult = ({ theme, faviconUrl, siteUrl }: { theme: 'light' | 'dark', faviconUrl: string, siteUrl: string }) => {
    const isLight = theme === 'light';
    const bgColor = isLight ? 'bg-white' : 'bg-slate-900';
    const urlColor = isLight ? 'text-slate-600' : 'text-slate-400';
    const titleColor = isLight ? 'text-blue-800' : 'text-blue-400';
    const descColor = isLight ? 'text-slate-700' : 'text-slate-300';
    
    let displayUrl = "example.com";
    try {
        displayUrl = new URL(siteUrl).hostname;
    } catch {}


    return (
        <div className={`${bgColor} p-4 rounded-lg border ${isLight ? 'border-slate-200' : 'border-slate-700'} font-sans`}>
            <div className="flex items-center gap-2">
                {faviconUrl && <Image src={faviconUrl} alt="favicon" width={24} height={24} className="rounded-full" />}
                <div>
                    <div className="font-semibold text-base">{displayUrl}</div>
                    <div className={`text-xs ${urlColor}`}>{displayUrl}</div>
                </div>
            </div>
            <h3 className={`mt-2 text-xl ${titleColor} hover:underline`}>Your Website Title Appears Here</h3>
            <p className={`mt-1 text-sm ${descColor}`}>A preview of your site's meta description will be shown here to give users an idea of what your page is about.</p>
        </div>
    )
}

const AppIconPreview = ({ faviconUrl }: { faviconUrl: string }) => {
    return (
        <div className="flex flex-wrap gap-4">
            <div className="flex flex-col items-center gap-1">
                <h4 className="text-sm font-semibold text-muted-foreground">iOS/Android</h4>
                {faviconUrl ? (
                    <Image src={faviconUrl} alt="App Icon" width={64} height={64} className="rounded-xl shadow-md" />
                ) : (
                    <div className="w-16 h-16 rounded-xl shadow-md bg-muted flex items-center justify-center text-muted-foreground">?</div>
                )}
                <span className="text-xs text-muted-foreground">App Name</span>
            </div>
        </div>
    )
}


export default function FaviconDisplay({ siteUrl, faviconUrl, error }: FaviconDisplayProps) {

    if (error || !faviconUrl) {
        return (
          <Alert variant="destructive">
            <Siren className="h-4 w-4" />
            <AlertTitle>Could Not Find Favicon</AlertTitle>
            <AlertDescription>
                We couldn't automatically find a favicon for this URL. This can happen if the site doesn't have a standard `favicon.ico` file in the root directory. Support for detecting favicons in HTML `&lt;link&gt;` tags is coming soon.
            </AlertDescription>
          </Alert>
        )
    }

    let siteTitle = "Your Website Title";
    try {
        siteTitle = new URL(siteUrl).hostname;
    } catch {}

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Browser Tab Preview</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-center mb-2">Light Mode</h3>
                        <BrowserTab theme="light" faviconUrl={faviconUrl} siteTitle={siteTitle} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-center mb-2">Dark Mode</h3>
                        <BrowserTab theme="dark" faviconUrl={faviconUrl} siteTitle={siteTitle} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Google Search Result Preview</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-center mb-2">Light Mode</h3>
                        <GoogleSearchResult theme="light" faviconUrl={faviconUrl} siteUrl={siteUrl} />
                    </div>
                     <div>
                        <h3 className="font-semibold text-center mb-2">Dark Mode</h3>
                        <GoogleSearchResult theme="dark" faviconUrl={faviconUrl} siteUrl={siteUrl} />
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>App & Bookmark Icon Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <AppIconPreview faviconUrl={faviconUrl} />
                </CardContent>
            </Card>
        </div>
    )
}
