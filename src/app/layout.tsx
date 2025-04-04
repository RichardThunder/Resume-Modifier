import type { Metadata } from "next";
import { Raleway } from "next/font/google"; // Import Raleway font
import "./globals.css";
import React from "react";

// Configure Raleway font
const raleway = Raleway({
    subsets: ["latin"],
    weight: ["400", "500", "700"], // Load desired weights
    variable: '--font-raleway', // Optional: Define CSS variable
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
        {/* Apply Raleway font class to the body */}
        <body className={`${raleway.className} bg-background-color text-text-color`}>
        {children}
        </body>
        </html>
    );
}