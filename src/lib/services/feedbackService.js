'use client'
import { getToken } from "@/lib/auth";
import axios from "axios";


const feedbackService = {
    sendFeedback: async (sectionData, section_type, feedback, updated_resume, index=0) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_URL) {
            console.error("API URL is not configured.");
            return { success: false, error: 'API URL configuration missing.' };
        }
        feedback = feedback || "";
        const jwtToken = getToken();
        if (!jwtToken) {
            console.warn('Feedback service: JWT token not found');
            return { success: false, error: 'Authentication required.', shouldRedirect: true };
        }
        
        let requestBody;
        switch (section_type) {
            case "summary":
                requestBody = {
                    section: {
                        "section type": section_type,
                        summary: sectionData
                    },
                    feedback: "Rewrite my Personal Summary to be more compelling, focusing on the unique value and expected contributions I can bring to a SDE role. My current summary is below",
                    updated_resume,
                };
                break;

            case "education":
                requestBody = {
                    section: {
                        "section type": section_type,
                        education: updated_resume.education[index] || sectionData
                    },
                    feedback: "Rewrite my education deacription, Emphasize courses relevant to programming.Do not include any GPA, degree or school name which is mentioned below. Return with bullet sentence start with '•', My current description is below",
                    updated_resume,
                };
                break;

            case "workExperience":
                requestBody = {
                    section: {
                        "section type": section_type,
                        workExperience: updated_resume.workExperience[index] || sectionData
                    },
                    feedback: "Please act as an experienced hiring manager. Help me optimize the following Work Experience description using the STAR method (Situation, Task, Action, Result) and quantify achievements wherever possible. Focus on my key responsibilities and accomplishments as a SDE. Start bullet points with strong action verbs. Return with bullet sentence start with '•', My current description is below. Please rewrite this into 3-5 impactful, accomplishment-driven bullet points.",
                    updated_resume,
                };
                break;

            case "projects":
                requestBody = {
                    section: {
                        "section type": section_type,
                        projects: updated_resume.projects[index] || sectionData
                    },
                    feedback: "Please optimize the following Project Experience description. Clearly state my role in the project, the key technologies/tools used (e.g., [Tech 1], [Tech 2]), the challenges faced, the solutions I implemented, and the final project outcomes or impact. Return with bullet sentence start with '•', My current description is below. Emphasize my individual contributions and problem-solving abilities.",
                    updated_resume,
                };
                break;

            case "achievements":
                requestBody = {
                    section: {
                        "section type": section_type,
                        achievements: updated_resume.achievements[index] || sectionData
                    },
                    feedback:"Please review my list of Achievements/Awards and help me select the most relevant ones for my career goal of becoming a SDE. Then, optimize their descriptions to strongly support my application for such roles.Return with bullet sentence start with '•',  My description is below",
                    updated_resume,
                };
                break;

            default:
                requestBody = {
                    section: {
                        "section type": section_type,
                        ...sectionData
                    },
                    feedback,
                    updated_resume,
                };
                break;
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
                const content = response.data.data.Content;
                console.log("Feedback processed successfully:", content);
                return { success: true, content };
            } else {
                console.error("Feedback API error response:", response.data);
                const errorMessage = response.data?.message || 'Failed to process feedback.';
                return { success: false, error: errorMessage };
            }
        } catch (error) {
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
