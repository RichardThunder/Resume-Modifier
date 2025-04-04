import axios from "axios";
import { setToken } from '@/lib/auth'; // Ensure correct path

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginSuccessResponse {
    token: string;
    user: {
        email: string;
        // Add other user properties if available in response
    };
}

interface LoginResult {
    success: boolean;
    token?: string;
    email?: string;
    error?: string;
}

export const login = async (email: string, password: string): Promise<LoginResult> => {
    if (!API_URL) {
        console.error("API URL is not configured.");
        return { success: false, error: 'API URL configuration missing.' };
    }
    try {
        const response = await axios.post<LoginSuccessResponse>(`${API_URL}/login`, {
            email: email.trim(),
            password: password,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Check response status code for success (e.g., 200 OK)
        if (response.status === 200 && response.data.token) {
            // Set token in local storage upon successful login
            setToken(response.data.token);
            return {
                success: true,
                token: response.data.token,
                email: response.data.user.email
            };
        } else {
            // Handle cases where status is 200 but data might be unexpected
            return { success: false, error: 'Login failed: Invalid response data.' };
        }

    } catch (error: any) {
        console.error("Login API call failed:", error);
        if (axios.isAxiosError(error) && error.response) {
            // Handle specific HTTP error codes
            switch (error.response.status) {
                case 401:
                    return { success: false, error: "Invalid email or password" };
                case 400:
                    // Check if the error message provides more detail
                    const errorMsg = error.response.data?.error || "Email and password required.";
                    return { success: false, error: errorMsg };
                default:
                    // Use error message from response if available, otherwise generic message
                    const defaultErrorMsg = error.response.data?.error || `Login failed with status ${error.response.status}`;
                    return { success: false, error: defaultErrorMsg };
            }
        } else {
            // Handle network errors or other non-HTTP errors
            return { success: false, error: 'Network error or server is unreachable.' };
        }
    }
};