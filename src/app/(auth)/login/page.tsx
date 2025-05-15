'use client'; // This page involves client-side interaction (form handling, state)

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm'; // Corrected path
import { login } from '@/lib/services/authService'; // Corrected path
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
            router.push('enterResume');

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