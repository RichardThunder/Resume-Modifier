import React, { useState } from 'react';
import feedbackService from '@/lib/services/feedbackService'; // Corrected path
import { ResumeModel } from '@/types/resume';
import { useRouter } from 'next/navigation'; // Use for potential redirection

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    sectionData: any; // Data for the specific section being edited
    sectionType: string;
    currentResumeModel: ResumeModel; // Pass the entire current model
    onUpdateContent: (newContent: string) => void; // Callback to update the parent component's state
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         sectionData,
                                                         sectionType,
                                                         currentResumeModel,
                                                         onUpdateContent,
                                                     }) => {
    const [feedbackText, setFeedbackText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const cleanedText = (text: string): string =>
        text.split('\n')
            .map(line => line.replace(/^-\s*/, '').trim()) // Trim after removing bullet
            .filter(line => line.length > 0) // Remove empty lines
            .join('\n');

    const handleSubmitFeedback = async () => {
        if (!feedbackText.trim()) {
            setError('Please enter your feedback to rewrite.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        const result = await feedbackService.sendFeedback(
            sectionData,
            sectionType,
            feedbackText,
            currentResumeModel
        );

        setIsLoading(false);

        if (result.success && result.content) {
            const cleanedContent = cleanedText(result.content);
            onUpdateContent(cleanedContent); // Update parent component
            setSuccess(true);
            setFeedbackText(''); // Clear feedback input on success
            setTimeout(() => {
                setSuccess(false); // Hide success message
                onClose(); // Close modal after success
            }, 2000);
        } else {
            setError(result.error || 'Failed to get feedback.');
            if (result.shouldRedirect) {
                // Handle redirection if authentication failed
                alert("Authentication failed. Please log in again."); // Or use a better notification
                router.push('/login');
            }
            // Clear error message after a delay
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleClose = () => {
        // Reset state on close
        setFeedbackText('');
        setError(null);
        setSuccess(false);
        setIsLoading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        // Using fixed position for modal overlay and content
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg z-10">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h5 className="text-xl font-semibold text-gray-800">Provide Your Feedback</h5>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">
                    {error && <div className="alert alert-danger mb-3">{error}</div>}
                    {success && <div className="alert alert-success mb-3">Rewrite successful!</div>}
                    <label htmlFor="modalText" className="form-label">Feedback for AI Writer:</label>
                    <textarea
                        id="modalText"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Enter your feedback to rewrite the section..."
                        className="form-control min-h-[100px]" // Ensure textarea has reasonable height
                        rows={4}
                        disabled={isLoading}
                    />
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center p-4 border-t border-gray-200 space-x-3">
                    {/* Error/Success Messages (Optional alternative placement) */}
                    {/* {error && <div className="text-red-600 text-sm mr-auto">{error}</div>} */}
                    {/* {success && <div className="text-green-600 text-sm mr-auto">Success!</div>} */}

                    <button
                        type="button"
                        className="btn-secondary px-4 py-2 rounded"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn-primary px-4 py-2 rounded min-w-[80px] flex justify-center items-center" // Added min-width and flex for spinner alignment
                        onClick={handleSubmitFeedback}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;