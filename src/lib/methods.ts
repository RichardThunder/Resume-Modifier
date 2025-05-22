'use client'
import axios from 'axios';
import { getToken } from '@/lib/auth'; // Adjusted path
// Removed router import - handle navigation in components/pages

// Function to convert score (0-100) to RGB color string
export const scoreToColors = (score: number): string => {
    if (score < 0 || score > 100) {
        console.warn('Score must be between 0 and 100. Received:', score);
        // Return a default color or clamp the score
        score = Math.max(0, Math.min(100, score));
        // return 'rgb(128, 128, 128)'; // Gray for invalid score
    }

    const deepRed = { r: 139, g: 0, b: 0 };
    const red = { r: 255, g: 0, b: 0 };
    const yellow = { r: 255, g: 255, b: 0 };
    const lightGreen = { r: 0, g: 255, b: 0 };
    const deepGreen = { r: 0, g: 100, b: 0 };

    let r: number, g: number, b: number;
    let t: number; // Interpolation factor (0 to 1)

    if (score <= 25) { // Deep Red to Red
        t = score / 25;
        r = deepRed.r + (red.r - deepRed.r) * t;
        g = deepRed.g + (red.g - deepRed.g) * t;
        b = deepRed.b + (red.b - deepRed.b) * t;
    } else if (score <= 50) { // Red to Yellow
        t = (score - 25) / 25;
        r = red.r + (yellow.r - red.r) * t;
        g = red.g + (yellow.g - red.g) * t;
        b = red.b + (yellow.b - red.b) * t;
    } else if (score <= 75) { // Yellow to Light Green
        t = (score - 50) / 25;
        r = yellow.r + (lightGreen.r - yellow.r) * t;
        g = yellow.g + (lightGreen.g - yellow.g) * t;
        b = yellow.b + (lightGreen.b - yellow.b) * t;
    } else { // Light Green to Deep Green
        t = (score - 75) / 25;
        r = lightGreen.r + (deepGreen.r - lightGreen.r) * t;
        g = lightGreen.g + (deepGreen.g - lightGreen.g) * t;
        b = lightGreen.b + (deepGreen.b - lightGreen.b) * t;
    }

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};

// Converts text with bullet points (•) to an HTML unordered list
export const textToHtml = (text: string | string[] | null | undefined): string => {
    if (!text) return '';
    if (Array.isArray(text)) {
        // Handle case where achievements might be an array
        return `<ul>${text.map(item => `<li>${item.trim()}</li>`).join('')}</ul>`;
    }
    if (typeof text !== 'string' || text.length === 0) return '';

    const items = text.split('•')
        .map(item => item.trim())
        .filter(item => item.length > 0);

    if (items.length === 0) {
        // If no bullet points found, treat the whole text as one item or return as is
        // Option 1: Wrap the whole text in a single list item if desired
        // return `<ul><li>${text.trim()}</li></ul>`;
        // Option 2: Or maybe just return the text if no bullets are expected generally
        return text; // Let's return the text itself if no bullets are found
    }

    const listItems = items.map(item => `<li>${item}</li>`).join('');
    return `<ul>${listItems}</ul>`;
};


// Converts HTML list back to plain text with bullet points
export const htmlToPlainText = (html: string | null | undefined): string => {
    if (!html) return '';
    // More robust replacement using regex: handles spaces and variations
    return html
        .replace(/<\/?ul[^>]*>/gi, '')      // Remove <ul> and </ul> tags
        .replace(/<li[^>]*>/gi, '• ')       // Replace <li> tags with bullet point and space
        .replace(/<\/?li[^>]*>/gi, '\n')    // Replace </li> tags with newline for separation
        .replace(/<br\s*\/?>/gi, '\n')      // Replace <br> tags with newline
        .replace(/<[^>]+>/g, '')          // Remove any other remaining HTML tags
        .replace(/•\s*\n/g, '• ')          // Clean up extra newline after bullet
        .split('\n')                      // Split into lines
        .map(line => line.trim())         // Trim each line
        .filter(line => line.length > 0) // Remove empty lines
        .join('\n');                      // Join back with single newlines
};


// This function was specific to Vue's reactive objects and might not be needed
// directly in the same way with Zustand, as updates are handled via actions.
// If you need a generic deep object assignment, you could use lodash's merge or assign.
// export const reAssign = <T extends object>(target: T, source: T): void => {
//     // 1) Clear existing keys (might be too destructive depending on use case)
//     Object.keys(target).forEach(key => {
//         delete target[key as keyof T];
//     });
//     // 2) Assign properties from source
//     Object.assign(target, source);
// };

// Formats description text (potentially with bullet points) into HTML list items for dangerouslySetInnerHTML
export function formatDescriptionToHtmlList(description: string | string[] | null | undefined): string {
    if (!description) {
        return '';
    }

    let lines: string[];

    if (Array.isArray(description)) {
        // If it's already an array (like achievements might be), use it directly
        lines = description.map(line => String(line).trim()).filter(line => line);
    } else if (typeof description === 'string') {
        // If it's a string, split by newline and handle potential bullet points
        lines = description.split(/\r?\n/)
            .map(line => {
                line = line.trim();
                // Remove leading bullet point (•) and space if present
                if (line.startsWith('•')) {
                    return line.substring(1).trim();
                }
                return line;
            })
            .filter(line => line); // Remove empty lines
    } else {
        return ''; // Not a string or array
    }


    // Wrap each non-empty line in an <li> tag
    return lines.map(line => `<li style="line-height: 1.2; margin-bottom: 5px;">${line}</li>`).join('');

    // Optionally wrap in <ul> if you always want a list structure
    // if (lines.length > 0) {
    //    return `<ul>${lines.map(line => `<li style="line-height: 1.2; margin-bottom: 5px;">${line}</li>`).join('')}</ul>`;
    // }
    // return ''; // Return empty string if no lines
}


// --- Feedback function (kept separate, similar logic) ---
// Note: Needs careful handling of navigation in React/Next.js context
// Instead of `router.push`, components calling this should handle redirection.
export const feedBack = async (data: { feedback: string; section: any, section_type: string, updated_resume: any }) => {
    const jwtToken = getToken();
    if (!jwtToken) {
        console.error('JWT token not found');
        // Throw an error or return a specific status to indicate auth failure
        // alert('You need to Login to continue'); // Avoid alerts in library functions
        return { success: false, error: 'Authentication required', shouldRedirect: true };
    }
    if (!data.feedback) {
        // alert('Please provide feedback');
        return { success: false, error: 'Feedback is required' };
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL; // Use Next.js env variable convention
    if (!API_URL) {
        console.error("API URL is not configured.");
        return { success: false, error: 'API URL is not configured.' };
    }

    let requestBody: any;
    if (data.section_type === "summary") {
        requestBody = {
            section: {
                "section type": data.section_type,
                summary: data.section // Assuming data.section IS the summary string here
            },
            feedback: data.feedback,
            updated_resume: data.updated_resume,
        };
    } else {
        requestBody = {
            section: {
                "section type": data.section_type,
                ...data.section // Spread the section object
            },
            feedback: data.feedback,
            updated_resume: data.updated_resume,
        };
    }


    try {
        const response = await axios.put(
            `${API_URL}/feedback`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

        if (response.data.status === 200) {
            console.log('Data received from server:', response.data);
            const content = response.data.data.Content;
            return { success: true, content: content };
        } else {
            // alert('Failed to upload data. Please try again.');
            console.error('Error uploading data:', response.data);
            return { success: false, error: response.data.message || 'Failed to process feedback.' };
        }
    } catch (error: any) {
        console.error('Failed to upload data:', error);
        let errorMessage = 'Network error or server issue.';
        if (error.response) {
            // Handle specific API error responses if needed
            errorMessage = error.response.data?.message || error.response.statusText || errorMessage;
            if (error.response.status === 401) { // Unauthorized
                return { success: false, error: 'Authentication failed.', shouldRedirect: true };
            }
        } else if (error.request) {
            errorMessage = 'No response received from server.';
        } else {
            errorMessage = error.message;
        }
        return { success: false, error: errorMessage };
    }
};

export const getTimestampedFilename = function(prefix = 'file', ext = 'pdf') {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());

  return `${prefix}_${year}${month}${day}_${hour}${minute}${second}.${ext}`;
}