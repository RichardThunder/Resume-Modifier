'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Certification } from '@/types/resume'; // Import the Certification type
import { scoreToColors } from '@/lib/methods';
import FeedbackModal from '@/components/common/FeedbackModal';
import DraggableItem from './DraggableItem';

// --- Helper Components (ProgressCircle, Tooltip - Reuse or Import) ---
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

const CertificationForm: React.FC = () => {
    const { certifications, addCertification, deleteCertification, reorderCertification, updateCertification, analysis, model } = useResumeStore(state => ({
        certifications: state.model.certifications,
        addCertification: state.addCertification,
        deleteCertification: state.deleteCertification,
        reorderCertification: state.reorderCertification,
        updateCertification: state.updateCertification,
        analysis: state.analysis.certifications, // Get certification analysis
        model: state.model,
    }));

    const [visibleIndexes, setVisibleIndexes] = useState<Record<number, boolean>>({});
    const [showDragHint, setShowDragHint] = useState(false);
    const [feedbackModalIndex, setFeedbackModalIndex] = useState<number | null>(null);

    // Sync visibility state
    useEffect(() => {
        const initialVisibility: Record<number, boolean> = {};
        certifications.forEach((_, index) => {
            initialVisibility[index] = visibleIndexes[index] ?? false;
        });
        setVisibleIndexes(initialVisibility);
    }, [certifications.length]);


    const toggleShow = (index: number) => {
        setVisibleIndexes(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handleAddCertification = () => {
        addCertification();
        const newIndex = certifications.length;
        setVisibleIndexes(prev => ({ ...prev, [newIndex]: true }));
        setShowDragHint(true);
        setTimeout(() => setShowDragHint(false), 3000);
    };

    const handleDeleteCertification = (index: number, event: React.MouseEvent) => {
        event.stopPropagation();
        if (window.confirm(`Are you sure you want to delete Certification #${index + 1}?`)) {
            deleteCertification(index);
            setVisibleIndexes(prev => {
                const newState = { ...prev }; delete newState[index];
                Object.keys(newState).forEach(keyStr => { const key = parseInt(keyStr, 10); if (key > index) { newState[key - 1] = newState[key]; delete newState[key]; } });
                return newState;
            });
        }
    };

    const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        updateCertification(index, { [name]: value });
    };

    const onDragEnd = (startIndex: number, endIndex: number) => {
        if (startIndex === endIndex) return;
        reorderCertification(startIndex, endIndex);
        setVisibleIndexes(prev => {
            const items = Object.entries(prev); const [removed] = items.splice(startIndex, 1); items.splice(endIndex, 0, removed);
            return Object.fromEntries(items.map((item, idx) => [idx, item[1]]));
        });
    };

    const openFeedbackModal = (index: number) => setFeedbackModalIndex(index);
    const closeFeedbackModal = () => setFeedbackModalIndex(null);
    const handleUpdateDescription = (index: number, newDescription: string) => {
        updateCertification(index, { description: newDescription });
    };

    return (
        <div className="mb-6 mx-auto w-full">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">📜 Certifications</h2>
                <button onClick={handleAddCertification} className="btn-custom btn-sm">Add</button>
            </div>

            {showDragHint && <div className="alert alert-success p-2 text-sm mb-3"><strong>Drag & drop</strong> headers to reorder entries.</div>}

            <div className="space-y-2">
                {certifications.map((cert, index) => (
                    <DraggableItem key={cert.name + index} id={index.toString()} index={index} onDragEnd={onDragEnd}>
                        {(isDragging) => (
                            <div className={`card mb-1 border ${isDragging ? 'opacity-50 shadow-lg' : 'shadow-sm'}`}>
                                <div className="card-header flex justify-between items-center p-2 cursor-pointer bg-gray-50 hover:bg-gray-100" onClick={() => toggleShow(index)} aria-expanded={visibleIndexes[index]}>
                                    <span className="font-medium truncate pr-2">{cert.name || `Certification #${index + 1}`}</span>
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                        {analysis?.[index]?.score !== undefined && <Tooltip text={analysis[index]?.comment}><ProgressCircle score={analysis[index].score} /></Tooltip>}
                                        <button onClick={(e) => handleDeleteCertification(index, e)} className="p-1 text-gray-400 hover:text-red-600" title="Delete Certification">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                                        </button>
                                        <span className={`transform transition-transform duration-300 ${visibleIndexes[index] ? 'rotate-180' : ''}`}>▼</span>
                                    </div>
                                </div>
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${visibleIndexes[index] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="card-body p-3 space-y-3">
                                        {/* Certification Inputs */}
                                        <div><label htmlFor={`cert-name-${index}`} className="form-label">Certification Name</label><input type="text" id={`cert-name-${index}`} name="name" value={cert.name || ''} onChange={(e) => handleInputChange(index, e)} placeholder="Name of Certification" className="form-control form-control-sm" /></div>
                                        <div><label htmlFor={`cert-issuer-${index}`} className="form-label">Issuer</label><input type="text" id={`cert-issuer-${index}`} name="issuer" value={cert.issuer || ''} onChange={(e) => handleInputChange(index, e)} placeholder="Issuing Organization" className="form-control form-control-sm" /></div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div><label htmlFor={`cert-date-${index}`} className="form-label">Issue Date</label><input type="month" id={`cert-date-${index}`} name="date" value={cert.date || ''} onChange={(e) => handleInputChange(index, e)} className="form-control form-control-sm" /></div>
                                            <div><label htmlFor={`cert-expiryDate-${index}`} className="form-label">Expiry Date (Optional)</label><input type="month" id={`cert-expiryDate-${index}`} name="expiryDate" value={cert.expiryDate || ''} onChange={(e) => handleInputChange(index, e)} className="form-control form-control-sm" /></div>
                                        </div>
                                        <div><label htmlFor={`cert-url-${index}`} className="form-label">URL (Optional)</label><input type="url" id={`cert-url-${index}`} name="url" value={cert.url || ''} onChange={(e) => handleInputChange(index, e)} placeholder="https://example.com/verify" className="form-control form-control-sm" /></div>
                                        <div>
                                            <label htmlFor={`description-cert-${index}`} className="form-label">Description</label>
                                            <textarea id={`description-cert-${index}`} name="description" value={cert.description || ''} onChange={(e) => handleInputChange(index, e)} placeholder="Describe the certification..." rows={3} className="form-control form-control-sm min-h-[80px]"></textarea>
                                            <div className="flex justify-end mt-2"><button onClick={() => openFeedbackModal(index)} className="btn-custom btn-sm">AI Writer</button></div>
                                        </div>
                                    </div>
                                </div>
                                {feedbackModalIndex === index && <FeedbackModal isOpen={true} onClose={closeFeedbackModal} sectionData={cert} sectionType="certifications" currentResumeModel={model} onUpdateContent={(newDesc) => handleUpdateDescription(index, newDesc)} />}
                            </div>
                        )}
                    </DraggableItem>
                ))}
                {certifications.length === 0 && <p className="text-center text-gray-500 py-4">No certifications entries added yet.</p>}
            </div>
        </div>
    );
};

export default CertificationForm;