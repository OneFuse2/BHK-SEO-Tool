'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function PageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const noNavPaths = ['/login', '/signup'];
    const showHeader = !noNavPaths.includes(pathname);
    const showFooter = !noNavPaths.includes(pathname);

    return (
        <>
            {showHeader && <Header />}
            <main className="flex-grow">{children}</main>
            {showFooter && <Footer />}
        </>
    );
}
