import type { Metadata } from "next";
import { Raleway, Playfair_Display } from "next/font/google"; // Import fonts
import "./globals.css";
import "../styles/print.css"; // Import print styles
import React from "react";

// Configure Raleway font
const raleway = Raleway({
    subsets: ["latin"],
    weight: ["400", "500", "700"], 
    variable: '--font-raleway',
});

// Configure Playfair Display font
const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ['normal', 'italic'],
    variable: '--font-playfair',
});

export const metadata: Metadata = {
    title: "Resume Editor", // Default title
    description: "Resume Editor built with React, Next.js, and Tailwind CSS",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        {/* Apply font variables */}
        <body className={`${raleway.variable} ${playfair.variable} font-sans bg-background-color text-text-color`}>
        {children}
        </body>
        </html>
    );
}