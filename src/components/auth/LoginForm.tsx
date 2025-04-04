'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import Link from 'next/link';

interface LoginFormProps {
    onSubmit: (email: string, password: string) => Promise<void>; // Make onSubmit async
    isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });

    // Load remembered credentials on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedEmail = localStorage.getItem('rememberedEmail');
            // const savedPassword = localStorage.getItem('rememberedPassword'); // Avoid storing passwords directly
            if (savedEmail) {
                setEmail(savedEmail);
                setRemember(true); // Check the box if email was remembered
            }
            // if (savedPassword) setPassword(savedPassword);
        }
    }, []);

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = { email: '', password: '' };

        if (!email.trim()) {
            newErrors.email = 'Email is required!';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Invalid email format!';
            isValid = false;
        }


        if (!password) {
            newErrors.password = 'Password is required!';
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long!';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const clearError = (field: keyof typeof errors) => {
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }

        // Handle remember me logic before submitting
        if (remember) {
            localStorage.setItem('rememberedEmail', email);
            // localStorage.setItem('rememberedPassword', password); // Avoid storing password
        } else {
            localStorage.removeItem('rememberedEmail');
            // localStorage.removeItem('rememberedPassword');
        }

        await onSubmit(email, password); // Call the async onSubmit prop
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            // Create a synthetic event or directly call validation and submit logic
            if (validateForm()) {
                if (remember) localStorage.setItem('rememberedEmail', email);
                else localStorage.removeItem('rememberedEmail');
                onSubmit(email, password);
            }
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
                <label htmlFor="email" className="form-label">
                    Email
                </label>
                <input
                    type="email" // Use type="email" for better validation/mobile input
                    id="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    onFocus={() => clearError('email')}
                    className={`form-control ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    aria-describedby="email-error"
                    aria-invalid={!!errors.email}
                    autoComplete="email"
                />
                {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600">
                        {errors.email}
                    </p>
                )}
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="form-label">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    onFocus={() => clearError('password')}
                    onKeyDown={handleKeyDown} // Add keydown listener
                    className={`form-control ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    aria-describedby="password-error"
                    aria-invalid={!!errors.password}
                    autoComplete="current-password"
                />
                {errors.password && (
                    <p id="password-error" className="mt-1 text-sm text-red-600">
                        {errors.password}
                    </p>
                )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember"
                        type="checkbox"
                        checked={remember}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setRemember(e.target.checked)}
                        className="form-check-input" // Use Tailwind component class if defined, or apply utilities directly
                    />
                    <label htmlFor="remember" className="form-check-label">
                        Remember me
                    </label>
                </div>
                <Link href="/forgot-password" // Update link if needed
                      className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Forgot Password?
                </Link>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex justify-center items-center" // Ensure button uses full width and centers content
            >
                {isLoading ? (
                    <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Loading...
                    </>
                ) : (
                    'Sign In'
                )}
            </button>

            {/* Register Link */}
            <div className="text-sm text-center text-gray-600">
                Need an account?{' '}
                <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700">
                    Sign up
                </Link>
            </div>
        </form>
    );
};

export default LoginForm;