'use client'
import axios from 'axios';
import { getToken } from '@/lib/auth';
import { getTimestampedFilename } from '@/lib/methods'; // Import the utility function

interface SaveResumePayload {
    resume_title: string;
    updated_resume: any; // Changed from ResumeModel to accept resumeData directly
}

interface SaveResult {
    success: boolean;
    error?: string;
    shouldRedirect?: boolean; // Flag for auth failures
}

const saveResumeService = {
    async save(fileName: string, resumeData: any): Promise<SaveResult> {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_URL) {
            console.error("API URL is not configured.");
            return { success: false, error: 'API URL configuration missing.' };
        }

        const jwtToken = getToken();
        if (!jwtToken) {
            console.error('Save resume service: JWT token not found');
            // alert('You need to Login to continue'); // Avoid alert
            return { success: false, error: 'Authentication required.', shouldRedirect: true };
        }

        const payload: SaveResumePayload = {
            resume_title: fileName,
            updated_resume: resumeData
        };

        try {
            const response = await axios.put(`${API_URL}/save_resume`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            // Check for successful status (e.g., 200 OK)
            if (response.status === 200) {
                console.log("Resume saved successfully.");
                return { success: true };
            } else {
                console.warn(`Unexpected success status code: ${response.status}`);
                const errorMessage = response.data?.message || `Failed to save resume with status ${response.status}`;
                return { success: false, error: errorMessage };
            }
        } catch (error: any) {
            console.error("Save resume API call failed:", error);
            let errorMessage = 'Network error or server issue during save.';
            let shouldRedirect = false;

            if (axios.isAxiosError(error) && error.response) {
                const status = error.response.status;
                const responseData = error.response.data;
                errorMessage = responseData?.error || responseData?.message || `Save failed with status ${status}`;

                switch (status) {
                    case 401: // Unauthorized
                        errorMessage = 'Authentication failed.';
                        shouldRedirect = true;
                        break;
                    case 403: // Forbidden (might indicate permission issues)
                        errorMessage = "Permission denied to save resume.";
                        break;
                    case 400: // Bad Request (e.g., validation errors on the server)
                        errorMessage = `Invalid data: ${errorMessage}`;
                        break;
                    case 500: // Internal Server Error
                        errorMessage = "Server error while saving resume.";
                        break;
                    // Add other specific status codes if needed
                }
                return { success: false, error: errorMessage, shouldRedirect };
            } else if (error.request) {
                errorMessage = 'No response received from server during save.';
            } else {
                errorMessage = error.message;
            }
            return { success: false, error: errorMessage };
        }
    }
};
// 将游客简历数据保存到后端
//TODO: tingpei 根据后端api设计, 修改游客模式下的建立数据上传
 export  const saveGuestResumeToBackend = async (resumeData: any) => {
        try {
            const result = await saveResumeService.save(getTimestampedFilename("MyResume", 'pdf'), resumeData)
            const response = await fetch('/api/resume/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ resumeData }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || '保存简历失败');
            }

            console.log('游客简历数据已成功保存到用户账户');
        } catch (error) {
            console.error('保存游客简历数据失败:', error);
            // 可以选择在这里显示错误通知，但不阻止用户继续
        }
    };

export default saveResumeService;

