import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from './lib/auth'; // Adjust path as needed

// Define public paths that don't require authentication
const PUBLIC_PATHS = ['/login', '/register']; // Add other public paths like '/forgot-password' if needed
const PROTECTED_PATHS = ['/', '/profile'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('jwt_token')?.value || getToken(); // Check cookies first, then localStorage (though localStorage isn't ideal in middleware)

    // Allow requests for API routes, static files, and Next.js internals
    if (pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/assets/') || // Assuming assets are in public/assets
        pathname.includes('.')) { // Basic check for file extensions
        return NextResponse.next();
    }
    // --- Handle Authentication Logic ---
    const isPublicPath = PUBLIC_PATHS.includes(pathname);
    const isProtectedRoute = PROTECTED_PATHS.includes(pathname); // Or simply check if it's NOT a public path

    // Case 1: User is logged in (has token)
    if (token) {
        // If trying to access login/register while logged in, redirect to a default page
        if (isPublicPath) {
            console.log(`Middleware: Authenticated user accessing public path ${pathname}. Redirecting to /resume.`);
            return NextResponse.redirect(new URL('/resume', request.url)); // Redirect to resume editor
        }
        // Otherwise, allow access to protected paths (or any other path)
        console.log(`Middleware: Authenticated user accessing ${pathname}. Allowing.`);
        return NextResponse.next();
    }
    // Case 2: User is NOT logged in (no token)
    else {
        // If trying to access a protected path without a token, redirect to login
        if (isProtectedRoute) {
            console.log(`Middleware: Unauthenticated user accessing protected path ${pathname}. Redirecting to /login.`);
            const loginUrl = new URL('/login', request.url);
            // Optional: add redirect parameter if your login page handles it
            // loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
        // Otherwise, allow access (must be a public path or a path not explicitly handled)
        console.log(`Middleware: Unauthenticated user accessing public path ${pathname}. Allowing.`);
        return NextResponse.next();
    }
}

// Specify the paths the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - assets (files in public/assets) - Adjust if your asset path is different
         */
        '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
    ],
};