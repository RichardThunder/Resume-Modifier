import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RegisterSuccessData {
    // Define the structure of the successful response data if known
    user: {
        email: string;
        // other user fields?
    };
    message?: string;
}

interface RegisterResult {
    success: boolean;
    data?: RegisterSuccessData;
    error?: string;
}

export const registerService = {
    async register(email: string, password: string): Promise<RegisterResult> {
        if (!API_URL) {
            console.error("API URL is not configured.");
            return { success: false, error: 'API URL configuration missing.' };
        }
        try {
            const response = await axios.post<RegisterSuccessData>(`${API_URL}/register`, {
                email: email.trim(), // Trim email
                password: password   // Password should generally not be trimmed automatically
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Registration successful (status 201 Created)
            if (response.status === 201) {
                return { success: true, data: response.data };
            } else {
                // Handle unexpected success status codes if necessary
                console.warn(`Unexpected success status code: ${response.status}`);
                return { success: false, error: `Registration failed with status ${response.status}` };
            }

        } catch (error: any) {
            console.error("Registration API call failed:", error);
            if (axios.isAxiosError(error) && error.response) {
                const status = error.response.status;
                const responseData = error.response.data;
                let errorMessage = responseData?.error || responseData?.message || `Registration failed with status ${status}`;

                switch (status) {
                    case 403: // Forbidden - typically permission issues, maybe API key related in some contexts
                        errorMessage = "Registration forbidden."; // Or more specific if known
                        if (responseData?.error?.includes("API key")) {
                            errorMessage = "API key is missing or invalid.";
                        }
                        return { success: false, error: errorMessage };
                    case 400: // Bad Request - Often validation errors like duplicate email
                        // More specific check for common "email already registered" message
                        if (errorMessage.toLowerCase().includes("email already registered")) {
                            errorMessage = "Email already registered.";
                        } else {
                            errorMessage = `Invalid input: ${errorMessage}`; // Generic validation error
                        }
                        return { success: false, error: errorMessage };
                    case 500: // Internal Server Error
                        return { success: false, error: "Server error during registration." };
                    default:
                        return { success: false, error: errorMessage };
                }
            } else {
                // Handle network errors or other issues
                return { success: false, error: 'Network error or server is unreachable.' };
            }
        }
    }
};