import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // Include if using Pages Router
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // Add Raleway font if imported via CSS/font file
                raleway: ['Raleway', 'sans-serif'],
                // Or define using Next/Font variable if set up in layout:
                // raleway: ['var(--font-raleway)', 'sans-serif'],
            },
            colors: {
                // Define custom colors matching original CSS variables
                'text-color': '#0E051F',
                'background-color': '#f9fbfd',
                'button-primary-color': '#4a95ce', // Use in components like bg-button-primary-color
                'button-secondary-color': '#96c4e8',
                'button-thirdary-color': '#3c89c0',
                'blue-custom': '#4a95ce', // Alias for btn-custom
                'blue-custom-dark': '#3c89c0', // Darker shade for hover
                'fuchsia-100': '#EF5DA8',
                'fuchsia-80': '#F178B6',
                'fuchsia-60': '#FCDDEC',
            },
            // Example: Extend spacing or other properties if needed
            // spacing: {
            //   '15mm': '15mm',
            //   '10mm': '10mm',
            //   '8mm': '8mm',
            // },
            maxWidth: {
                'a4': '210mm', // Define A4 width for preview container
            },
            minHeight: {
                'a4': '297mm', // Define A4 height
            },
            width: {
                'a4': '210mm',
            },
            spacing: { // Add spacing for print margins if needed directly
                '15mm': '15mm',
                '8mm': '8mm',
            },
            // Allow prose styles to use custom colors if needed
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.gray.700'), // Default prose color
                        // Customize other prose elements if necessary
                        'ul > li::marker': { // Example: style list markers
                            // color: theme('colors.gray.500'),
                        },
                        a: {
                            color: theme('colors.blue.600'),
                            '&:hover': {
                                color: theme('colors.blue.800'),
                            },
                        },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'), // Add typography plugin for prose styling
        require('@tailwindcss/forms'),    // Add forms plugin for better default form styles
    ],
};
export default config;