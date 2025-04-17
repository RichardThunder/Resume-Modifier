'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Education } from '@/types/resume';
import { scoreToColors } from '@/lib/methods';
import FeedbackModal from '@/components/common/FeedbackModal';
import DraggableItem from './DraggableItem'; // Assuming a reusable DraggableItem component

// --- Helper Components (ProgressCircle, Tooltip - copied from PersonInfoForm.tsx or import if made common) ---
interface ProgressCircleProps { score: number | undefined; size?: number; width?: number; }
const ProgressCircle: React.FC<ProgressCircleProps> = ({ score = 0, size = 35, width = 4 }) => { /* ... implementation ... */
    const radius = (size - width) / 2; const circumference = 2 * Math.PI * radius; const offset = circumference - (score / 100) * circumference; const color = scoreToColors(score);
    return (<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90"><circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth={width} fill="transparent" /><circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={width} fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.3s ease' }} /><text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-[10px] font-semibold fill-current text-black rotate-90 origin-center">{score}</text></svg>);
};
interface TooltipProps { text: string | undefined; children: React.ReactNode; }
const Tooltip: React.FC<TooltipProps> = ({ text, children }) => { /* ... implementation ... */
    if (!text) return <>{children}</>;
    return (<div className="relative group inline-block">{children}<div className={`absolute bottom-full left-1/2 z-20 mb-2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap max-w-xs pointer-events-none`}>{text}<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div></div></div>);
};
// --- End Helper Components ---

const EducationForm: React.FC = () => {
    const { education, addEducation, deleteEducation, reorderEducation, updateEducation, analysis, model } = useResumeStore(state => ({
        education: state.model.education,
        addEducation: state.addEducation,
        deleteEducation: state.deleteEducation,
        reorderEducation: state.reorderEducation,
        updateEducation: state.updateEducation,
        analysis: state.analysis.education, // Get specific analysis section
        model: state.model,
    }));

    const [visibleIndexes, setVisibleIndexes] = useState<Record<number, boolean>>({});
    const [showDragHint, setShowDragHint] = useState(false);
    const [feedbackModalIndex, setFeedbackModalIndex] = useState<number | null>(null);

    // Initialize visibility state based on education array length
    useEffect(() => {
        const initialVisibility: Record<number, boolean> = {};
        education.forEach((_, index) => {
            // Keep existing state or default to false
            initialVisibility[index] = visibleIndexes[index] ?? false;
        });
        setVisibleIndexes(initialVisibility);
    }, [education.length]); // Rerun only when the number of items changes


    const toggleShow = (index: number) => {
        setVisibleIndexes(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handleAddEducation = () => {
        addEducation();
        // Automatically expand the newly added item
        const newIndex = education.length; // Index will be the current length before adding
        setVisibleIndexes(prev => ({ ...prev, [newIndex]: true }));
        setShowDragHint(true);
        setTimeout(() => setShowDragHint(false), 3000);
    };

    const handleDeleteEducation = (index: number, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent toggling show when deleting
        if (window.confirm(`Are you sure you want to delete Education #${index + 1}?`)) {
            deleteEducation(index);
            // Adjust visibility state after deletion if necessary
            setVisibleIndexes(prev => {
                const newState = { ...prev };
                delete newState[index];
                // Shift indexes down for items after the deleted one
                Object.keys(newState).forEach(keyStr => {
                    const key = parseInt(keyStr, 10);
                    if (key > index) {
                        newState[key - 1] = newState[key];
                        delete newState[key];
                    }
                });
                return newState;
            });
        }
    };


    const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const fieldValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

        updateEducation(index, { [name]: fieldValue });
    };

    // Drag and Drop Handler
    const onDragEnd = (startIndex: number, endIndex: number) => {
        if (startIndex === endIndex) return;
        reorderEducation(startIndex, endIndex);
        // Update visibility state to match new order
        setVisibleIndexes(prev => {
            const items = Object.entries(prev); // Convert to [index, isVisible] pairs
            const [removed] = items.splice(startIndex, 1);
            items.splice(endIndex, 0, removed);
            return Object.fromEntries(items.map((item, idx) => [idx, item[1]])); // Rebuild object with new indices
        });
    };

    // Feedback Modal Handling
    const openFeedbackModal = (index: number) => setFeedbackModalIndex(index);
    const closeFeedbackModal = () => setFeedbackModalIndex(null);

    const handleUpdateDescription = (index: number, newDescription: string) => {
        updateEducation(index, { description: newDescription });
    };


    return (
        <div className="mb-6 mx-auto w-full"> {/* Increased bottom margin */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">🎓 Education</h2>
                <button onClick={handleAddEducation} className="btn-custom btn-sm">Add</button>
            </div>

            {showDragHint && (
                <div className="alert alert-success p-2 text-sm mb-3">
                    <strong>Drag & drop</strong> headers to reorder entries.
                </div>
            )}

            <div className="space-y-2">
                {education.map((edu, index) => (
                    <DraggableItem key={index} id={index.toString()} index={index} onDragEnd={onDragEnd}>
                        {(isDragging) => (
                            <div className={`card mb-1 border ${isDragging ? 'opacity-50 shadow-lg' : 'shadow-sm'}`}>
                                <div
                                    className="card-header flex justify-between items-center p-2 cursor-pointer bg-gray-50 hover:bg-gray-100"
                                    onClick={() => toggleShow(index)}
                                    aria-expanded={visibleIndexes[index]}
                                >
                                    <span className="font-medium truncate pr-2">
                                        {edu.degree || `Education #${index + 1}`} at {edu.institutionName || 'Institution'}
                                    </span>
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                        {analysis?.[index]?.score !== undefined && (
                                            <Tooltip text={analysis[index]?.comment}>
                                                <ProgressCircle score={analysis[index].score} />
                                            </Tooltip>
                                        )}
                                        <button
                                            onClick={(e) => handleDeleteEducation(index, e)}
                                            className="p-1 text-gray-400 hover:text-red-600"
                                            title="Delete Education"
                                        >
                                            {/* Simple Trash Icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                        <span className={`transform transition-transform duration-300 ${visibleIndexes[index] ? 'rotate-180' : ''}`}>▼</span>
                                    </div>
                                </div>

                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${visibleIndexes[index] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="card-body p-3 space-y-3">
                                        {/* Row 1 */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label htmlFor={`institutionName-${index}`} className="form-label">Institution Name</label>
                                                <input type="text" id={`institutionName-${index}`} name="institutionName" value={edu.institutionName || ''} onChange={(e) => handleInputChange(index, e)} placeholder="Institution Name" className="form-control form-control-sm" />
                                            </div>
                                            <div>
                                                <label htmlFor={`fieldOfStudy-${index}`} className="form-label">Field of Study</label>
                                                <input type="text" id={`fieldOfStudy-${index}`} name="fieldOfStudy" value={edu.fieldOfStudy || ''} onChange={(e) => handleInputChange(index, e)} placeholder="Field of Study" className="form-control form-control-sm" />
                                            </div>
                                        </div>
                                        {/* Row 2 */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label htmlFor={`degree-${index}`} className="form-label">Degree</label>
                                                <input type="text" id={`degree-${index}`} name="degree" value={edu.degree || ''} onChange={(e) => handleInputChange(index, e)} placeholder="Degree" className="form-control form-control-sm" />
                                            </div>
                                            <div>
                                                <label htmlFor={`grade-${index}`} className="form-label">Grade/GPA</label>
                                                <input type="text" id={`grade-${index}`} name="grade" value={edu.grade || ''} onChange={(e) => handleInputChange(index, e)} placeholder="Grade or GPA" className="form-control form-control-sm" />
                                            </div>
                                        </div>
                                        {/* Row 3 */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label htmlFor={`city-${index}`} className="form-label">City</label>
                                                <input type="text" id={`city-${index}`} name="city" value={edu.city || ''} onChange={(e) => handleInputChange(index, e)} placeholder="City" className="form-control form-control-sm" />
                                            </div>
                                            <div>
                                                <label htmlFor={`country-${index}`} className="form-label">Country</label>
                                                <input type="text" id={`country-${index}`} name="country" value={edu.country || ''} onChange={(e) => handleInputChange(index, e)} placeholder="Country" className="form-control form-control-sm" />
                                            </div>
                                        </div>
                                        {/* Row 4 - Dates */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label htmlFor={`fromDate-${index}`} className="form-label">From Date</label>
                                                <input type="month" id={`fromDate-${index}`} name="fromDate" value={edu.fromDate || ''} onChange={(e) => handleInputChange(index, e)} className="form-control form-control-sm" /> {/* Changed type to month */}
                                            </div>
                                            <div>
                                                <label htmlFor={`toDate-${index}`} className="form-label">To Date</label>
                                                <input type="month" id={`toDate-${index}`} name="toDate" value={edu.toDate || ''} onChange={(e) => handleInputChange(index, e)} className="form-control form-control-sm" disabled={edu.isPresent} /> {/* Changed type to month */}
                                            </div>
                                        </div>
                                        {/* Row 5 - Present Checkbox */}
                                        <div className="flex items-center mt-1">
                                            <input type="checkbox" id={`isPresent-${index}`} name="isPresent" checked={edu.isPresent || false} onChange={(e) => handleInputChange(index, e)} className="form-check-input" />
                                            <label htmlFor={`isPresent-${index}`} className="form-check-label ml-2">Currently Studying Here</label>
                                        </div>
                                        {/* Row 6 - Description */}
                                        <div>
                                            <label htmlFor={`description-${index}`} className="form-label">Description</label>
                                            <textarea id={`description-${index}`} name="description" value={edu.description || ''} onChange={(e) => handleInputChange(index, e)} placeholder="Describe your education details, achievements, or notable projects (use bullet points starting with '-' or '*' for list format)" rows={4} className="form-control form-control-sm min-h-[100px]"></textarea>
                                            <div className="flex justify-end mt-2">
                                                <button onClick={() => openFeedbackModal(index)} className="btn-custom btn-sm">
                                                    AI Writer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Feedback Modal for this item */}
                                {feedbackModalIndex === index && (
                                    <FeedbackModal
                                        isOpen={true}
                                        onClose={closeFeedbackModal}
                                        sectionData={edu} // Pass the specific education item
                                        sectionType="education"
                                        currentResumeModel={model}
                                        onUpdateContent={(newDesc) => handleUpdateDescription(index, newDesc)}
                                    />
                                )}
                            </div>
                        )}
                    </DraggableItem>
                ))}
                {education.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No education entries added yet.</p>
                )}
            </div>
        </div>
    );
};

export default EducationForm;

