'use client'; // This page involves client-side interaction (form handling, state)

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm'; // Corrected path
import { login } from '@/lib/services/authService'; // Corrected path
import { getGuestResume, clearGuestResume, hasGuestResume } from '@/services/guestResumeService';
import saveResumeService from '@/lib/services/saveResumeService';
import { getTimestampedFilename } from '@/lib/methods'; // Import the utility function
import Header from '@/components/common/Header'; // 导入Header组件

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Manage loading state here

    const handleLogin = async (email: string, password: string) => {
        setError(null);
        setSuccess(false);
        setIsLoading(true); // Start loading

        const result = await login(email, password);

        setIsLoading(false); // Stop loading

        if (result.success) {
            setSuccess(true);
            // 登录成功，检查是否有游客简历数据
            try {
                if (hasGuestResume()) {
                    const guestResumeData = getGuestResume();

                    // 将游客数据保存到后端
                    await saveGuestResumeToBackend(guestResumeData);

                    // 清除本地游客数据
                    clearGuestResume();

                    // 重定向到简历编辑页面
                    router.push('/enterResume');
                } else {
                    // 没有游客数据，重定向到用户主页或默认简历页面
                    router.push('enterResume');
                }
            } catch (error) {
                console.error('Error saving guest resume to backend:', error);
            }



            // Redirect after a short delay
            setTimeout(() => {
                router.push('/enterResume'); // Redirect to the main app page (e.g., resume editor)
                // Optionally reload if state isn't updating correctly across layouts, though ideally not needed
                // window.location.reload();
            }, 1000);
        } else {
            setError(result.error || 'An unknown error occurred.');
            // Clear error after some time
            setTimeout(() => setError(null), 5000);
        }
    };
    // 将游客简历数据保存到后端
    const saveGuestResumeToBackend = async (resumeData: any) => {
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

    return (
        <>
            {/* 添加Header组件 */}
            <Header />

            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-12 pt-24"> {/* 添加pt-24以为Header留出空间 */}
                {/* Ensure Header is not rendered here if using separate auth layout */}
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Sign In
                    </h1>
                    <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

                    {error && (
                        <div
                            className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}
                    {success && (
                        <div
                            className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm"
                            role="alert"
                        >
                            <strong>Success!</strong> Redirecting...
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}