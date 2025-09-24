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
    const noFooterPaths = ['/login', '/signup'];
    const showFooter = !noFooterPaths.includes(pathname);

    return (
        <>
            <Header />
            <main className="flex-grow">{children}</main>
            {showFooter && <Footer />}
        </>
    );
}
