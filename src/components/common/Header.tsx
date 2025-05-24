'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation'; // Use correct imports for App Router
import { isAuthenticated, getLocalStorage } from '@/lib/auth'; // Assuming auth utils are in lib

const Header: React.FC = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const pathname = usePathname(); // Get current path
    const router = useRouter(); // For potential programmatic navigation

    // Check authentication status on component mount (client-side)
    useEffect(() => {
        setIsAuth(isAuthenticated());

        // Optional: Listen for storage events to update auth status if token changes in another tab
        const handleStorageChange = () => {
            setIsAuth(isAuthenticated());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);


    const toggleNavbar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    const closeNavbar = () => {
        setIsNavbarOpen(false);
    }

    // Example Avatar - replace with actual user data if available
    const userAvatar = "/Avatar.png"; // Path relative to /public

    const navLinkClasses = (path: string) =>
        `block py-2 px-3 md:p-0 rounded md:bg-transparent font-semibold text-lg transition duration-150 ease-in-out ${
            pathname === path
                ? 'text-blue-700 bg-blue-100 md:text-blue-700' // Active link styling
                : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700' // Default link styling
        }`;
    const hotTemplateLinkClasses = (path: string) =>
        `block py-2 px-3 md:p-0 rounded font-semibold text-lg transition duration-150 ease-in-out ${
            pathname === path
                ? 'text-fuchsia-600 bg-fuchsia-50 md:text-fuchsia-600' // Active hot template
                : 'text-fuchsia-500 hover:bg-fuchsia-50 md:hover:bg-transparent md:hover:text-fuchsia-600' // Default hot template
        }`;


    return (
        <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40 w-full border-b border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2">
                {/* Logo and Brand */}
                <Link href={isAuth ? "/" : "/login"} className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Image src="/bot.svg" alt="ResumeBot Logo" width={40} height={40} />
                    <span className="self-center text-2xl font-bold whitespace-nowrap text-gray-800">ResumeBot</span>
                </Link>

                {/* Actions (Login/Avatar) & Mobile Toggle */}
                <div className="flex items-center md:order-2 space-x-3 md:space-x-5 rtl:space-x-reverse">
                    {/* Login/Avatar */}
                    {isAuth ? (
                        <Link href="/profile" onClick={closeNavbar}>
                            <Image
                                src={userAvatar}
                                alt="User Avatar"
                                width={36}
                                height={36}
                                className="rounded-full cursor-pointer object-cover border-2 border-gray-300 hover:border-blue-500"
                            />
                        </Link>
                    ) : (
                        <Link href="/login" onClick={closeNavbar}>
                                <button className="btn-primary btn-sm sign-in-btn">
                                Sign In
                            </button>
                        </Link>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleNavbar}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        aria-controls="navbar-user"
                        aria-expanded={isNavbarOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        {/* Hamburger Icon */}
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>

                {/* Navigation Links */}
                <div
                    className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isNavbarOpen ? 'block' : 'hidden'}`}
                    id="navbar-user"
                >
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
                        <li>
                            <Link href="/modifier" className={navLinkClasses("#")} onClick={closeNavbar}>Home</Link>
                        </li>
                        <li>
                            <a href="https://aws.mintmelon.ca/Chart" className={navLinkClasses("#chart")} onClick={closeNavbar}>Chart</a>
                        </li>
                        <li>
                            <a href="https://aws.mintmelon.ca/job_market" className={navLinkClasses("#job_market")} onClick={closeNavbar}>Job Market</a>
                        </li>
                        <li>
                            <Link href="/template" className={hotTemplateLinkClasses("/template")} onClick={closeNavbar}>
                                Hot Template
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;