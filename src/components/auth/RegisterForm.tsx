'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';

interface RegisterFormProps {
    onSubmit: (email: string, password: string) => Promise<void>; // Make onSubmit async
    isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' });

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = { email: '', password: '', confirmPassword: '' };

        // Email Validation
        if (!email.trim()) {
            newErrors.email = 'Email is required!';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Invalid email format!';
            isValid = false;
        }

        // Password Validation
        if (!password) {
            newErrors.password = 'Password is required!';
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long!';
            isValid = false;
        }

        // Confirm Password Validation
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password!';
            isValid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match!';
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
        await onSubmit(email, password); // Call the async onSubmit prop
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
                <label htmlFor="email" className="form-label">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    onFocus={() => clearError('email')}
                    className={`form-control ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    aria-describedby="email-error"
                    aria-invalid={!!errors.email}
                    autoComplete="email"
                />
                {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="form-label">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    onFocus={() => clearError('password')}
                    className={`form-control ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    aria-describedby="password-error"
                    aria-invalid={!!errors.password}
                    autoComplete="new-password"
                />
                {errors.password && <p id="password-error" className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    onFocus={() => clearError('confirmPassword')}
                    className={`form-control ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    aria-describedby="confirmPassword-error"
                    aria-invalid={!!errors.confirmPassword}
                    autoComplete="new-password"
                />
                {errors.confirmPassword && <p id="confirmPassword-error" className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex justify-center items-center" // Ensure full width and centered content
            >
                {isLoading ? (
                    <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Loading...
                    </>
                ) : (
                    'Sign Up'
                )}
            </button>

            {/* Login Link */}
            <div className="text-sm text-center text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
                    Sign in
                </Link>
            </div>
        </form>
    );
};

export default RegisterForm;