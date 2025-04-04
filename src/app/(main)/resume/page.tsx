'use client'; // Required for useState, useEffect, event listeners

import React, { useState, useEffect, useCallback } from 'react';
import PersonalForm from '@/components/resume/editor/PersonalForm';
import ResumePreview from '@/components/resume/preview/ResumePreview';
import { useResumeStore } from '@/store/resumeStore'; // Import the store
import { modelExample } from '@/store/resumeStore'; // Import example data

export default function ResumePage() {
    const [showForm, setShowForm] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Access store actions and state
    const loadFromLocalStorage = useResumeStore((state) => state.loadFromLocalStorage);
    const setModel = useResumeStore((state) => state.setModel);
    const isInitialized = useResumeStore((state) => state.isInitialized);
    const model = useResumeStore((state) => state.model); // Get model for checking if empty

    // Effect to load data from local storage on mount (client-side)
    // This replaces the Vue onMounted logic with ResumeSaver
    useEffect(() => {
        // Ensure this runs only once on the client after Zustand is potentially hydrated
        if (!isInitialized && typeof window !== 'undefined') {
            loadFromLocalStorage();
            // If after loading, the model is still essentially empty (check a key field), load example
            // Check against a truly empty state, not just the default clear state
            const isEmpty = !model.userInfo?.firstName && !model.summary && model.education?.length === 0;
            if (isEmpty) {
                console.log("Loaded data is empty, setting example model.");
                setModel(modelExample); // Use Zustand action to set example data
            }
        }
    }, [isInitialized, loadFromLocalStorage, setModel, model]); // Add model to dependencies carefully


    // Effect to handle screen resizing
    useEffect(() => {
        const handleResize = () => {
            const small = window.innerWidth < 768; // md breakpoint in Tailwind default
            setIsSmallScreen(small);
            // On small screens, always show the form if it was hidden? Or keep its state?
            // Let's keep its state unless toggled.
            // If screen becomes small AND form was hidden, maybe force it open?
            // if (small && !showForm) setShowForm(true); // Decide on desired behavior
            // Let's stick to the original logic: toggle button works on large screens,
            // but maybe we hide the button on small screens?
            if (!small && !showForm) {
                // If resizing larger and form is hidden, keep it hidden
            } else if (small) {
                // On small screens, maybe default to showing the form?
                setShowForm(true);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [showForm]); // Re-run if showForm changes maybe? Or just on mount/unmount. Let's keep it simple.


    const toggleForm = useCallback(() => {
        // Toggle only allowed on larger screens
        if (!isSmallScreen) {
            setShowForm(prevShow => !prevShow);
        }
        // On small screens, the button might be hidden or disabled, or always show form.
    }, [isSmallScreen]);

    // Calculate column classes dynamically
    const formColumnClass = showForm && !isSmallScreen ? 'w-5/12' : 'w-0 hidden'; // 5/12 is approx 41.66%
    const previewColumnClass = showForm && !isSmallScreen ? 'w-7/12' : 'w-full';

    // Conditional rendering or dynamic classes for hiding/showing form
    // Using dynamic width and hidden class for smoother transition potential
    return (
        <div className="flex flex-row h-full w-full relative">
            {/* Toggle Button - Conditionally rendered or styled based on screen size */}
            {!isSmallScreen && (
                <button
                    title={showForm ? 'Hide Editor' : 'Show Editor'}
                    className={`fixed top-1/2 -translate-y-1/2 z-30 w-5 h-12 p-0 flex items-center justify-center
                                rounded-r-md border border-l-0 border-gray-300 bg-blue-custom shadow-md
                                text-white hover:bg-blue-custom-dark transition-all duration-300 ease-in-out
                                ${showForm ? 'left-[41.66%]' : 'left-0'}`} // Adjust 41.66% (5/12) if needed
                    onClick={toggleForm}
                    style={{ transition: 'left 0.3s ease-in-out' }} // Smooth transition for left property
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-transform duration-300 ${showForm ? '' : 'rotate-180'}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button>
            )}

            {/* Form Section */}
            <div
                className={`editor-panel-container ${formColumnClass} border-r border-gray-200 shadow-sm overflow-y-auto h-full bg-white transition-all duration-300 ease-in-out`}
                // style={{ transition: 'width 0.3s ease-in-out' }}
            >
                {/* Only render content if it should be visible to avoid unnecessary processing */}
                { (showForm || isSmallScreen) && <PersonalForm /> }
            </div>

            {/* Preview Section */}
            <div className={`resume-preview-container ${previewColumnClass} overflow-y-auto h-full bg-gray-50 transition-all duration-300 ease-in-out`}>
                {/* Padding removed, handled by ResumePreview potentially */}
                <ResumePreview />
            </div>
        </div>
    );
}