// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that are public (don't require authentication)
const PUBLIC_PATHS = ['/login', '/register'];

// Define paths that require authentication (adjust as needed)
const PROTECTED_PATHS = ['/', '/resume', '/profile', '/template'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isDevelopment = process.env.NODE_ENV === 'development';

    // --- Get Token (Prioritize Cookies in Middleware) ---
    const token = request.cookies.get('jwt_token')?.value;

    // --- Allow Next.js internals, static assets, API routes ---
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/assets') ||
        /\.(png|jpg|jpeg|gif|svg|ico|css|js)$/.test(pathname)
    ) {
        return NextResponse.next();
    }

    // --- Authentication Logic ---
    const isPublicPath = PUBLIC_PATHS.includes(pathname);
    const isProtectedRoute = PROTECTED_PATHS.includes(pathname);

    // --- DEVELOPMENT MODE BYPASS ---
    // If in development, allow access to everything *except* trying to access
    // login/register pages when theoretically logged in (if token exists).
    if (isDevelopment) {
        console.warn(`🚧 DEV MODE: Auth checks bypassed for ${pathname}.`);
        // Still redirect logged-in users away from login/register in dev? (Optional)
        // if (token && isPublicPath) {
        //     console.log(`Middleware (Dev): Authenticated user accessing public path ${pathname}. Redirecting to /resume.`);
        //     return NextResponse.redirect(new URL('/resume', request.url));
        // }
        // Otherwise, allow access in development regardless of token or path protection
        return NextResponse.next();
    }
    // --- END DEVELOPMENT MODE BYPASS ---


    // --- PRODUCTION/OTHER ENVIRONMENTS AUTH LOGIC ---
    // Case 1: User is logged in (has token)
    if (token) {
        // Redirect away from public auth pages if logged in
        if (isPublicPath) {
            console.log(`Middleware: Authenticated user accessing public path ${pathname}. Redirecting to /resume.`);
            return NextResponse.redirect(new URL('/resume', request.url));
        }
        // Allow access to protected or other paths
        return NextResponse.next();
    }
    // Case 2: User is NOT logged in (no token)
    else {
        // Redirect to login if trying to access a protected path
        if (isProtectedRoute) {
            console.log(`Middleware: Unauthenticated user accessing protected path ${pathname}. Redirecting to /login.`);
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
        // Allow access to public paths
        return NextResponse.next();
    }
}

// --- Matcher Configuration (Keep as before) ---
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|assets|favicon.ico).*)',
    ],
};