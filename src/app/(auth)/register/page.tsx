'use client'; // This page involves client-side interaction

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/auth/RegisterForm'; // Corrected path
import { registerService } from '@/lib/services/registerService'; // Corrected path
import Header from '@/components/common/Header'; // 导入Header组件

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [successEmail, setSuccessEmail] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(5);
    const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store interval ID

    useEffect(() => {
        // Cleanup interval on component unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleRegister = async (email: string, password: string) => {
        setError(null);
        setSuccessEmail(null);
        setIsLoading(true);
        if (intervalRef.current) clearInterval(intervalRef.current); // Clear previous interval if any

        const result = await registerService.register(email, password);

        setIsLoading(false);

        if (result.success && result.data?.user?.email) {
            setSuccessEmail(result.data.user.email);
            setError(null);
            setCountdown(5); // Reset countdown

            // Start countdown timer
            intervalRef.current = setInterval(() => {
                setCountdown((prevCount) => {
                    if (prevCount <= 1) {
                        clearInterval(intervalRef.current!); // Use non-null assertion
                        router.push('/login'); // Redirect to login
                        return 0;
                    }
                    return prevCount - 1;
                });
            }, 1000);

        } else {
            setError(result.error || 'An unknown registration error occurred.');
            // Clear error after some time
            setTimeout(() => setError(null), 5000);
        }
    };

    return (
        <>
            {/* 添加Header组件 */}
            <Header />

            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-12 pt-24"> {/* 添加pt-24以为Header留出空间 */}
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Sign Up
                    </h1>
                    <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />

                    {error && (
                        <div
                            className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}
                    {successEmail && (
                        <div
                            className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm"
                            role="alert"
                        >
                            <strong>Success!</strong> Registered as {successEmail}.
                            Redirecting to login in {countdown} seconds...
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}