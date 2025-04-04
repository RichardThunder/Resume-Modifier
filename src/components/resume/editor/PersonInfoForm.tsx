'use client';

import React, { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { scoreToColors } from '@/lib/methods'; // Adjusted path

// --- Helper: Progress Circle Component ---
interface ProgressCircleProps {
    score: number | undefined;
    size?: number;
    width?: number;
}
const ProgressCircle: React.FC<ProgressCircleProps> = ({ score = 0, size = 30, width = 4 }) => {
    const radius = (size - width) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = scoreToColors(score);

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            {/* Background Circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#e5e7eb" // gray-200
                strokeWidth={width}
                fill="transparent"
            />
            {/* Progress Arc */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth={width}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round" // Make ends rounded
                style={{ transition: 'stroke-dashoffset 0.3s ease' }} // Smooth transition
            />
            {/* Text */}
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em" // Adjust vertical alignment
                className="text-xs font-semibold fill-current text-black rotate-90 origin-center" // Rotate text back
            >
                {score}
            </text>
        </svg>
    );
};

// --- Helper: Tooltip Component (Simple CSS Tooltip) ---
interface TooltipProps {
    text: string | undefined;
    children: React.ReactNode;
}
const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
    if (!text) return <>{children}</>; // Don't render tooltip if no text

    return (
        <div className="relative group inline-block">
            {children}
            <div className={`absolute bottom-full left-1/2 z-20 mb-2
                           transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white
                           text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200
                           whitespace-nowrap max-w-xs pointer-events-none`}> {/* Added max-w-xs */}
                {text}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div> {/* Arrow */}
            </div>
        </div>
    );
};


// --- Main Component ---
const PersonInfoForm: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true); // Default to visible
    const { userInfo, updateUserInfoField, analysis } = useResumeStore((state) => ({
        userInfo: state.model.userInfo,
        updateUserInfoField: state.updateUserInfoField,
        analysis: state.analysis, // Get analysis data
    }));

    const overallScore = analysis.overallAnalysis?.score;
    const overallComment = analysis.overallAnalysis?.comment;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Type assertion to ensure 'name' is a key of UserInfo
        updateUserInfoField(name as keyof typeof userInfo, value);
    };

    const toggleShow = () => setIsVisible(!isVisible);

    return (
        <div className="card mb-3 mx-auto w-full"> {/* Use w-full for responsiveness */}
            <div
                className="card-header flex justify-between items-center cursor-pointer p-3"
                onClick={toggleShow}
                aria-expanded={isVisible}
            >
                <span className="font-semibold text-lg">ℹ️ Personal Information</span>
                <div className="flex items-center space-x-2">
                    {/* Overall Analysis Score/Tooltip */}
                    {overallScore !== undefined && (
                        <Tooltip text={overallComment}>
                            <ProgressCircle score={overallScore} />
                        </Tooltip>
                    )}
                    <span className={`transform transition-transform duration-300 ${isVisible ? 'rotate-180' : ''}`}>▼</span>
                </div>
            </div>

            {/* Collapsible Body */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isVisible ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="card-body p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* First Name */}
                        <div>
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={userInfo.firstName || ''}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="form-control form-control-sm"
                            />
                        </div>
                        {/* Last Name */}
                        <div>
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={userInfo.lastName || ''}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="form-control form-control-sm"
                            />
                        </div>
                        {/* Headline */}
                        <div className="md:col-span-2">
                            <label htmlFor="headLine" className="form-label">Headline</label>
                            <input
                                type="text"
                                id="headLine"
                                name="headLine"
                                value={userInfo.headLine || ''}
                                onChange={handleChange}
                                placeholder="e.g., Software Engineer | Full-Stack Developer"
                                className="form-control form-control-sm"
                            />
                        </div>
                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                            <input
                                type="tel" // Use tel type
                                id="phoneNumber"
                                name="phoneNumber"
                                value={userInfo.phoneNumber || ''}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className="form-control form-control-sm"
                            />
                        </div>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={userInfo.email || ''}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="form-control form-control-sm"
                            />
                        </div>
                        {/* City */}
                        <div>
                            <label htmlFor="city" className="form-label">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={userInfo.city || ''}
                                onChange={handleChange}
                                placeholder="City"
                                className="form-control form-control-sm"
                            />
                        </div>
                        {/* Country */}
                        <div>
                            <label htmlFor="country" className="form-label">Country</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={userInfo.country || ''}
                                onChange={handleChange}
                                placeholder="Country"
                                className="form-control form-control-sm"
                            />
                        </div>
                        {/* LinkedIn URL */}
                        <div>
                            <label htmlFor="linkedInURL" className="form-label">LinkedIn URL</label>
                            <input
                                type="url" // Use url type
                                id="linkedInURL"
                                name="linkedInURL"
                                value={userInfo.linkedInURL || ''}
                                onChange={handleChange}
                                placeholder="linkedin.com/in/yourprofile"
                                className="form-control form-control-sm"
                            />
                        </div>
                        {/* Other Profile URL */}
                        <div>
                            <label htmlFor="websiteOrOtherProfileURL" className="form-label">Website/Other URL</label>
                            <input
                                type="url"
                                id="websiteOrOtherProfileURL"
                                name="websiteOrOtherProfileURL"
                                value={userInfo.websiteOrOtherProfileURL || ''}
                                onChange={handleChange}
                                placeholder="github.com/yourprofile or portfolio link"
                                className="form-control form-control-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonInfoForm;