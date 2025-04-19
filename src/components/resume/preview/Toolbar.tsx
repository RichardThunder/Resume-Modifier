'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { useRouter } from 'next/navigation'; // For redirecting on auth failure
import axios from 'axios';
import { getToken } from '@/lib/auth';
import saveResumeService from '@/lib/services/saveResumeService';
import usePrint from '@/hooks/usePrint';
import Image from 'next/image';

const Toolbar: React.FC = () => {
    const {
        fileName, setFileName,
        undo, redo, history, future,
        setModel, setAnalysis, model, // Need model for uploads
    } = useResumeStore();

    const { exportToPDF, isPrinting } = usePrint(); // Use the print hook

    const [isEditingName, setIsEditingName] = useState(false);
    const [localFileName, setLocalFileName] = useState(fileName);
    const fileNameInputRef = useRef<HTMLInputElement>(null);

    const [showResumeModal, setShowResumeModal] = useState(false);
    const [showJdModal, setShowJdModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isResumeLoading, setIsResumeLoading] = useState(false);
    const [isJdLoading, setIsJdLoading] = useState(false);
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [isSaveSuccess, setIsSaveSuccess] = useState(false);
    const [isSaveFailed, setIsSaveFailed] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Sync local filename state with store
    useEffect(() => {
        setLocalFileName(fileName);
    }, [fileName]);

    // Focus input when editing starts
    useEffect(() => {
        if (isEditingName && fileNameInputRef.current) {
            fileNameInputRef.current.focus();
            fileNameInputRef.current.select();
        }
    }, [isEditingName]);


    // --- Filename Editing ---
    const handleEditFileName = () => setIsEditingName(true);

    const handleSaveFileName = () => {
        const trimmedName = localFileName.trim();
        const finalName = trimmedName || 'Untitled.pdf'; // Default if empty
        setFileName(finalName); // Update store
        setIsEditingName(false);
    };

    const handleFileNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSaveFileName();
        } else if (e.key === 'Escape') {
            setLocalFileName(fileName); // Revert to original store value
            setIsEditingName(false);
        }
    };

    // --- Modal Toggles ---
    const toggleResumeModal = () => { setApiError(null); setShowResumeModal(!showResumeModal); setSelectedFile(null); };
    const toggleJdModal = () => { setApiError(null); setShowJdModal(!showJdModal); setJobDescription(''); };

    // --- File Handling ---
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    // --- Resume Upload ---
    const submitResumeUpload = async () => {
        const jwtToken = getToken();
        if (!jwtToken) { alert('Authentication required.'); router.push('/login'); return; }
        if (!selectedFile) { alert('Please select a file.'); return; }
        if (!API_URL) { alert('API URL not configured.'); return; }

        const formData = new FormData();
        formData.append('file', selectedFile);

        setIsResumeLoading(true);
        setApiError(null);
        try {
            const response = await axios.post(`${API_URL}/pdfupload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (response.data.status === 200 && response.data.data) {
                setFileName(selectedFile.name); // Update filename in store
                setModel(response.data.data); // Update resume model in store
                // Optionally convert descriptions here if needed, though maybe better on display
                // convertModel(response.data.data, textToHtml); // Need to adapt convertModel
                toggleResumeModal(); // Close modal on success
            } else {
                throw new Error(response.data.message || 'Failed to upload resume.');
            }
        } catch (error: any) {
            console.error('Resume upload error:', error);
            const message = error.response?.data?.message || error.message || 'Error uploading resume.';
            setApiError(message);
            if (error.response?.status === 401) router.push('/login');
        } finally {
            setIsResumeLoading(false);
        }
    };

    // --- JD Upload ---
    const submitJdUpload = async () => {
        const jwtToken = getToken();
        if (!jwtToken) { alert('Authentication required.'); router.push('/login'); return; }
        if (!jobDescription.trim()) { alert('Please enter a job description.'); return; }
        if (!API_URL) { alert('API URL not configured.'); return; }

        setIsJdLoading(true);
        setApiError(null);
        try {
            const response = await axios.post(`${API_URL}/job_description_upload`, {
                updated_resume: model, // Send current resume model from store
                job_description: jobDescription.trim()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (response.data.status === 200 && response.data.data) {
                setAnalysis(response.data.data); // Update analysis data in store
                toggleJdModal(); // Close modal on success
            } else {
                throw new Error(response.data.message || 'Failed to upload job description.');
            }
        } catch (error: any) {
            console.error('JD upload error:', error);
            const message = error.response?.data?.message || error.message || 'Error uploading job description.';
            setApiError(message);
            if (error.response?.status === 401) router.push('/login');
        } finally {
            setIsJdLoading(false);
        }
    };

    // --- Save Resume ---
    const handleSaveResume = async () => {
        setIsSaveLoading(true);
        setIsSaveSuccess(false);
        setIsSaveFailed(false);
        setApiError(null); // Clear previous errors

        const result = await saveResumeService.save(fileName, model);

        setIsSaveLoading(false);
        if (result.success) {
            setIsSaveSuccess(true);
            setTimeout(() => setIsSaveSuccess(false), 3000); // Show success briefly
        } else {
            setIsSaveFailed(true);
            setApiError(result.error || 'Failed to save resume.'); // Show specific error
            setTimeout(() => {setIsSaveFailed(false); setApiError(null)}, 5000); // Clear fail state/error
            if (result.shouldRedirect) {
                alert("Authentication expired. Please log in again.");
                router.push('/login');
            }
        }
    };

    // --- Handle PDF Export ---
    const handlePDFAction = async () => {
        // Optional: Save before printing
        // await handleSaveResume(); // Uncomment if save is required before print
        exportToPDF();
    };

    const canUndo = history.length > 0;
    const canRedo = future.length > 0;

    return (
        <>
            <div className="toolbar-container sticky top-0 z-30 flex items-center justify-between bg-gray-200 p-2 border-b border-gray-300 min-h-[50px]">
                {/* Filename Edit */}
                <div className="filename-edit flex items-center">
                    {isEditingName ? (
                        <div className="flex items-center">
                            {/* Save Button */}
                            <button
                                className="p-1 text-green-600 hover:text-green-800 mr-1"
                                onClick={handleSaveFileName}
                                title="Save filename"
                            >
                                <Image src="/toolbar/save.svg" alt="Save Name" width={16} height={16} />
                            </button>
                            <input
                                ref={fileNameInputRef}
                                type="text"
                                value={localFileName}
                                onChange={(e) => setLocalFileName(e.target.value)}
                                onKeyDown={handleFileNameKeyDown}
                                onBlur={handleSaveFileName} // Save on blur as well
                                className="form-control form-control-sm file-name-input w-auto px-2 py-0.5"
                            />
                        </div>
                    ) : (
                        <button
                            className="btn-custom btn-sm btn-outline-dark flex items-center space-x-1 px-2 py-1 bg-transparent border border-gray-400 text-gray-700 hover:bg-gray-100"
                            title={`Current filename: ${fileName}. Click to rename.`}
                            onClick={handleEditFileName}
                        >
                            <Image src="/toolbar/ep_edit.svg" alt="Edit Name" width={16} height={16} />
                            <span className="truncate max-w-[150px] hidden sm:inline">{fileName}</span>
                            <span className="truncate max-w-[100px] sm:hidden">Rename</span>
                        </button>
                    )}
                </div>

                {/* Undo/Redo */}
                <div className="flex items-center space-x-1">
                    <button
                        className="btn-custom btn-sm p-1.5 disabled:opacity-50"
                        disabled={!canUndo}
                        onClick={undo}
                        title="Undo"
                    >
                        <Image src="/toolbar/material-symbols-light_undo.svg" alt="Undo" width={18} height={18} />
                    </button>
                    <button
                        className="btn-custom btn-sm p-1.5 disabled:opacity-50"
                        disabled={!canRedo}
                        onClick={redo}
                        title="Redo"
                    >
                        <Image src="/toolbar/material-symbols-light_redo.svg" alt="Redo" width={18} height={18} />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 md:space-x-3">
                    {/* Upload Resume */}
                    <button
                        className="btn-custom btn-sm flex items-center space-x-1 px-2 py-1"
                        onClick={toggleResumeModal}
                        title="Upload Resume PDF"
                    >
                        <Image src="/toolbar/circum_export.svg" alt="Upload" width={16} height={16} />
                        <span className="hidden sm:inline">Resume</span>
                    </button>
                    {/* Upload JD */}
                    <button
                        className="btn-custom btn-sm flex items-center space-x-1 px-2 py-1"
                        onClick={toggleJdModal}
                        title="Analyze with Job Description"
                    >
                        <Image src="/toolbar/circum_export.svg" alt="Upload" width={16} height={16} />
                        <span className="hidden sm:inline">JD</span>
                    </button>
                    {/* Save Button */}
                    <button
                        type="button"
                        className={`btn-custom btn-sm px-2 py-1 flex items-center justify-center w-8 h-7 ${isSaveSuccess ? 'bg-green-500 hover:bg-green-600' : ''} ${isSaveFailed ? 'bg-red-500 hover:bg-red-600' : ''}`}
                        onClick={handleSaveResume}
                        disabled={isSaveLoading}
                        title={isSaveSuccess ? 'Saved!' : isSaveFailed ? `Save Failed: ${apiError || ''}` : 'Save Resume'}
                    >
                        {isSaveLoading ? (
                            <span className="spinner-border spinner-border-sm text-white" role="status" aria-hidden="true"></span>
                        ) : isSaveSuccess ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg> // Checkmark
                        ) : isSaveFailed ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg> // Error/Info
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg> // Floppy/Save Icon
                        )}
                    </button>
                    {/* Download PDF */}
                    <button
                        className="btn-custom btn-sm px-2 py-1 flex items-center justify-center w-8 h-7"
                        onClick={handlePDFAction}
                        disabled={isPrinting}
                        title="Download as PDF"
                    >
                        {isPrinting ? (
                            <span className="spinner-border spinner-border-sm text-white" role="status" aria-hidden="true"></span>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg> // Download Icon
                        )}
                    </button>
                </div>
            </div>

            {/* Resume Upload Modal */}
            {showResumeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h5 className="text-lg font-semibold">Upload Resume PDF</h5>
                            <button onClick={toggleResumeModal} className="text-gray-400 hover:text-gray-600">×</button>
                        </div>
                        <div className="p-4 space-y-3">
                            {apiError && <div className="alert alert-danger text-sm p-2">{apiError}</div>}
                            <div>
                                <label htmlFor="fileUpload" className="form-label">Choose a .pdf file:</label>
                                <input
                                    id="fileUpload"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                />
                            </div>
                            {selectedFile && <p className="text-sm font-medium text-gray-700">Selected: {selectedFile.name}</p>}
                        </div>
                        <div className="flex justify-end space-x-3 p-4 border-t">
                            <button type="button" className="btn-secondary" onClick={toggleResumeModal} disabled={isResumeLoading}>Cancel</button>
                            <button type="button" className="btn-primary min-w-[80px] flex justify-center items-center" onClick={submitResumeUpload} disabled={isResumeLoading || !selectedFile}>
                                {isResumeLoading ? <span className="spinner-border spinner-border-sm"></span> : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* JD Upload Modal */}
            {showJdModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg"> {/* Wider modal */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <h5 className="text-lg font-semibold">Analyze with Job Description</h5>
                            <button onClick={toggleJdModal} className="text-gray-400 hover:text-gray-600">×</button>
                        </div>
                        <div className="p-4 space-y-3">
                            {apiError && <div className="alert alert-danger text-sm p-2">{apiError}</div>}
                            <div>
                                <label htmlFor="jobDescription" className="form-label">Paste Job Description:</label>
                                <textarea
                                    id="jobDescription"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the full job description here..."
                                    className="form-control min-h-[150px]" // Larger textarea
                                    rows={8}
                                    disabled={isJdLoading}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 p-4 border-t">
                            <button type="button" className="btn-secondary" onClick={toggleJdModal} disabled={isJdLoading}>Cancel</button>
                            <button type="button" className="btn-primary min-w-[80px] flex justify-center items-center" onClick={submitJdUpload} disabled={isJdLoading || !jobDescription.trim()}>
                                {isJdLoading ? <span className="spinner-border spinner-border-sm"></span> : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Toolbar;