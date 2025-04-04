'use client'; // Needed for hooks like useRouter and useEffect

import React, { useEffect } from 'react';
import Header from '@/components/common/Header';
import { isAuthenticated } from '@/lib/auth';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' for App Router

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        // Client-side check for authentication
        if (!isAuthenticated()) {
            console.log('User not authenticated, redirecting to login.');
            router.push('/login'); // Redirect to login page
        }
        // No else needed, just let rendering continue if authenticated
    }, [router]); // Re-run check if router object changes (shouldn't happen often)

    // Optionally, show a loading state while checking auth
    // if (!isAuthenticated()) { // Initial check might prevent flicker
    //     return <div>Loading...</div>;
    // }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            {/* Add top padding to main content to offset fixed header */}
            <main className="flex-grow pt-16"> {/* Adjust pt-16 based on Header height */}
                {children}
            </main>
            {/* Optional Footer */}
            {/* <footer className="bg-gray-200 p-4 text-center">Footer Content</footer> */}
        </div>
    );
}