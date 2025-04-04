'use client';

import React, { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import FeedbackModal from '@/components/common/FeedbackModal'; // Corrected path

const SummaryForm: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false); // Default to hidden
    const { summary, updateSummary, model } = useResumeStore((state) => ({
        summary: state.model.summary,
        updateSummary: state.updateSummary,
        model: state.model, // Need the full model for feedback context
    }));

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateSummary(e.target.value);
    };

    const toggleShow = () => setIsVisible(!isVisible);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Callback for FeedbackModal to update summary
    const handleUpdateSummary = (newContent: string) => {
        updateSummary(newContent);
    };

    // Data for FeedbackModal (summary is just a string here)
    const summarySectionData = { summary: summary }; // Package for feedback service if needed

    return (
        <div className="card mb-3 mx-auto w-full">
            <div
                className="card-header flex justify-between items-center cursor-pointer p-3"
                onClick={toggleShow}
                aria-expanded={isVisible}
            >
                <span className="font-semibold text-lg">📝 Summary</span>
                <span className={`transform transition-transform duration-300 ${isVisible ? 'rotate-180' : ''}`}>▼</span>
            </div>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isVisible ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="card-body p-4">
                    <div className="mb-3">
                        <label htmlFor="summary" className="form-label">Brief Summary</label>
                        <textarea
                            id="summary"
                            value={summary}
                            onChange={handleChange}
                            placeholder="Write a brief summary about your professional background and skills."
                            rows={5} // Increased rows slightly
                            className="form-control form-control-sm min-h-[120px]" // Added min-height
                        />
                        <div className="flex justify-end mt-2">
                            <button onClick={openModal} className="btn-custom btn-sm">
                                AI Writer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Modal */}
            <FeedbackModal
                isOpen={isModalOpen}
                onClose={closeModal}
                sectionData={summary} // Pass the summary string directly as section data
                sectionType="summary"
                currentResumeModel={model} // Pass the entire current resume model
                onUpdateContent={handleUpdateSummary} // Pass the update callback
            />
        </div>
    );
};

export default SummaryForm;