import { getToken } from "@/lib/auth";
import axios from "axios";
import { ResumeModel } from "@/types/resume";

interface FeedbackPayload {
    section: {
        "section type": string;
        [key: string]: any; // Allow additional properties like summary, etc.
    };
    feedback: string;
    updated_resume: ResumeModel;
}

interface FeedbackResult {
    success: boolean;
    content?: string; // The rewritten content
    error?: string;
    shouldRedirect?: boolean; // Flag to indicate auth failure requires redirect
}

const feedbackService = {
    sendFeedback: async (
        sectionData: any, // Can be string (for summary) or object for others
        section_type: string,
        feedback: string,
        updated_resume: ResumeModel
    ): Promise<FeedbackResult> => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_URL) {
            console.error("API URL is not configured.");
            return { success: false, error: 'API URL configuration missing.' };
        }

        const jwtToken = getToken();
        if (!jwtToken) {
            console.warn('Feedback service: JWT token not found');
            // alert('You need to Login to continue'); // Avoid alert here
            // Returning a specific status/flag is better for the caller to handle redirection
            return { success: false, error: 'Authentication required.', shouldRedirect: true };
        }

        let requestBody: FeedbackPayload;
        if (section_type === "summary") {
            requestBody = {
                section: {
                    "section type": section_type,
                    summary: sectionData as string // Assert sectionData is string for summary
                },
                feedback: feedback,
                updated_resume: updated_resume,
            };
        } else {
            requestBody = {
                section: {
                    "section type": section_type,
                    ...(sectionData as object) // Assert sectionData is object and spread it
                },
                feedback: feedback,
                updated_resume: updated_resume,
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

            // Check for successful status code (e.g., 200) and expected data structure
            if (response.status === 200 && response.data?.status === 200 && response.data?.data?.Content) {
                const content: string = response.data.data.Content;
                console.log("Feedback processed successfully:", content);
                return { success: true, content };
            } else {
                console.error("Feedback API error response:", response.data);
                const errorMessage = response.data?.message || 'Failed to process feedback.';
                return { success: false, error: errorMessage };
            }
        } catch (error: any) {
            console.error("Feedback API call failed:", error);
            let errorMessage = 'Network error or server issue during feedback.';
            let shouldRedirect = false;

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.message || error.response.statusText || errorMessage;
                if (error.response.status === 401) { // Unauthorized
                    errorMessage = 'Authentication failed.';
                    shouldRedirect = true;
                }
                // Add handling for other potential status codes like 400, 500
                else if (error.response.status === 400) {
                    errorMessage = `Bad request: ${errorMessage}`;
                } else if (error.response.status === 500) {
                    errorMessage = `Server error during feedback: ${errorMessage}`;
                }
            } else if (error.request) {
                errorMessage = 'No response received from server during feedback.';
            } else {
                errorMessage = error.message;
            }
            return { success: false, error: errorMessage, shouldRedirect };
        }
    }
};

export default feedbackService;