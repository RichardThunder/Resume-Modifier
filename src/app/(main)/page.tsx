'use client'; // If using client-side logic like redirection

import React from 'react';
// import { useRouter } from 'next/navigation'; // Use if redirecting client-side

export default function HomePage() {
    // const router = useRouter();

    // Option 1: Redirect to resume editor immediately (client-side)
    // useEffect(() => {
    //   router.replace('/resume'); // Use replace to avoid adding to history
    // }, [router]);
    // return <div>Redirecting...</div>; // Show loading/redirect message

    // Option 2: Show a simple Home page content
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to ResumeBot</h1>
            <p className="text-lg text-gray-700">
                Navigate using the header to edit your resume or view templates.
            </p>
            {/* Add more content or links as needed */}
        </div>
    );
}

// Option 3: Server-side redirect (preferred for immediate redirect)
// Create a middleware.ts file or handle in getServerSideProps if using Pages Router
// For App Router, middleware is the standard way. See middleware.ts example later.