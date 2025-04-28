'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getToken } from '@/lib/auth';
import { useResume } from '@/context/ResumeContext';
import usePrint from '@/hooks/usePrint';
import Image from 'next/image';
import saveResumeService from '@/lib/services/saveResumeService';

const ResumeToolbar: React.FC = () => {
    const {
        resumeData,
        setResumeData,
        saveToLocalStorage,
        clearLocalStorage
    } = useResume();

    const { exportToPDF, isPrinting } = usePrint();

    const [isEditingName, setIsEditingName] = useState(false);
    const [fileName, setLocalFileName] = useState('Resume');
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

    // 历史记录状态
    const [history, setHistory] = useState<any[]>([]);
    const [future, setFuture] = useState<any[]>([]);
    const [currentData, setCurrentData] = useState(resumeData);

    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // 初始化时保存当前状态
    useEffect(() => {
        setCurrentData(resumeData);
    }, []);

    // 监听resumeData变化，更新历史记录
    useEffect(() => {
        if (JSON.stringify(currentData) !== JSON.stringify(resumeData)) {
            setHistory(prev => [...prev, currentData]);
            setFuture([]);
            setCurrentData(resumeData);
        }
    }, [resumeData]);

    // Focus input when editing starts
    useEffect(() => {
        if (isEditingName && fileNameInputRef.current) {
            fileNameInputRef.current.focus();
            fileNameInputRef.current.select();
        }
    }, [isEditingName]);

    // --- 撤销和重做功能 ---
    const undo = () => {
        if (history.length > 0) {
            const prevState = history[history.length - 1];
            const newHistory = history.slice(0, -1);
            
            setFuture([currentData, ...future]);
            setHistory(newHistory);
            setCurrentData(prevState);
            setResumeData(prevState);
        }
    };

    const redo = () => {
        if (future.length > 0) {
            const nextState = future[0];
            const newFuture = future.slice(1);
            
            setHistory([...history, currentData]);
            setFuture(newFuture);
            setCurrentData(nextState);
            setResumeData(nextState);
        }
    };

    // --- Filename Editing ---
    const handleEditFileName = () => setIsEditingName(true);

    const handleSaveFileName = () => {
        const trimmedName = fileName.trim();
        const finalName = trimmedName || 'Resume'; // Default if empty
        setLocalFileName(finalName);
        setIsEditingName(false);
    };

    const handleFileNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSaveFileName();
        } else if (e.key === 'Escape') {
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
        if (!jwtToken) { alert('Login required'); router.push('/login'); return; }
        if (!selectedFile) { alert('Please select a file'); return; }
        if (!API_URL) { alert('API URL not configured'); return; }

        const formData = new FormData();
        formData.append('file', selectedFile);

        // 打印请求信息
        console.log('准备上传简历:', {
            fileName: selectedFile.name,
            fileSize: `${(selectedFile.size / 1024).toFixed(2)} KB`,
            fileType: selectedFile.type,
            endpoint: `${API_URL}/pdfupload`
        });


        setIsResumeLoading(true);
        setApiError(null);
        try {
            console.log('开始上传简历...');
            console.time('简历上传耗时');
            
            const response = await axios.post(`${API_URL}/pdfupload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${jwtToken}`
                },
                timeout: 30000, // 30秒超时
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    console.log(`上传进度: ${percentCompleted}%`);
                }
            });
            
            console.timeEnd('简历上传耗时');
            console.log('简历上传响应:', {
                status: response.status,
                statusText: response.statusText,
                dataStatus: response.data?.status,
                hasData: !!response.data?.data
            });

            if (response.data.status === 200 && response.data.data) {
                console.log('简历上传成功，开始处理数据');
                setLocalFileName(selectedFile.name);
                setResumeData(response.data.data);
                toggleResumeModal();
                console.log('简历数据已更新，模态框已关闭');
            } else {
                console.warn('服务器返回成功但数据异常:', response.data);
                throw new Error(response.data.message || '上传简历失败');
            }
        } catch (error: any) {
            console.error('简历上传错误:', error);
        } finally {
            setIsResumeLoading(false);
            console.log('简历上传流程结束');
        }
    };

    // --- JD Upload ---
    const submitJdUpload = async () => {
        const jwtToken = getToken();
        if (!jwtToken) { alert('Login required'); router.push('/login'); return; }
        if (!jobDescription.trim()) { alert('Please enter job description'); return; }
        if (!API_URL) { alert('API URL not configured'); return; }

        setIsJdLoading(true);
        setApiError(null);
        try {
            const response = await axios.post(`${API_URL}/job_description_upload`, {
                updated_resume: resumeData,
                job_description: jobDescription.trim()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (response.data.status === 200 && response.data.data) {
                setResumeData({
                    ...resumeData,
                    analysis: response.data.data
                });
                toggleJdModal();
            } else {
                throw new Error(response.data.message || '上传职位描述失败');
            }
        } catch (error: any) {
            console.error('职位描述上传错误:', error);
            const message = error.response?.data?.message || error.message || '上传职位描述时出错';
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
        setApiError(null);
        const result = await saveResumeService.save(getTimestampedFilename(fileName,'pdf'),resumeData)
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
    const handlePDFAction = () => {
        exportToPDF();
    };

    // --- Reset Resume ---
    const handleResetResume = () => {
        if (window.confirm('Are you sure you want to reset the resume? This will clear all data and restore the default template.')) {
            clearLocalStorage();
            setHistory([]);
            setFuture([]);
            setCurrentData(resumeData);
        }
    };

    const canUndo = history.length > 0;
    const canRedo = future.length > 0;
 const getTimestampedFilename = function(prefix = 'file', ext = 'pdf') {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());

  return `${prefix}_${year}${month}${day}_${hour}${minute}${second}.${ext}`;
}
    return (
        <>
            {/* 修改为垂直工具栏 */}
            <div className="toolbar-container fixed right-0 top-0 h-full z-30 flex flex-col items-center justify-start bg-gray-200 border-l border-gray-300 py-4 px-2 w-16 overflow-auto">
                {/* 文件名编辑 - 垂直布局 */}
                <div className="filename-edit mb-6 w-full">
                    {isEditingName ? (
                        <div className="flex flex-col items-center">
                            <input
                                ref={fileNameInputRef}
                                type="text"
                                value={fileName}
                                onChange={(e) => setLocalFileName(e.target.value)}
                                onKeyDown={handleFileNameKeyDown}
                                onBlur={handleSaveFileName}
                                className="form-control form-control-sm file-name-input w-full px-1 py-0.5 text-xs text-center mb-1"
                            />
                            <button
                                className="p-1 bg-blue-500 text-white hover:bg-blue-600 rounded-full shadow-sm"
                                onClick={handleSaveFileName}
                                title="Save filename"
                            >
                                <Image src="/toolbar/save.svg" alt="Save name" width={16} height={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            className="btn-custom btn-sm btn-outline-dark flex flex-col items-center w-full px-1 py-2 bg-blue-400 rounded-lg shadow-sm border border-blue-500 text-white hover:bg-blue-500"
                            title={`Current filename: ${fileName}. Click to rename.`}
                            onClick={handleEditFileName}
                        >
                            <Image src="/toolbar/ep_edit.svg" alt="Edit name" width={16} height={16} className="mb-1" />
                            <span className="truncate w-full text-xs text-center">{fileName.split('.')[0]}</span>
                        </button>
                    )}
                </div>

                {/* 撤销/重做 - 垂直布局 */}
                <div className="flex flex-col items-center space-y-2 mb-6 w-full">
                    <button
                        className="btn-custom btn-sm p-2 disabled:opacity-50 bg-blue-400 rounded-lg shadow-sm w-full flex justify-center text-white hover:bg-blue-500 border border-blue-500"
                        disabled={!canUndo}
                        onClick={undo}
                        title="Undo"
                    >
                        <Image src="/toolbar/material-symbols-light_undo.svg" alt="Undo" width={18} height={18} />
                    </button>
                    <button
                        className="btn-custom btn-sm p-2 disabled:opacity-50 bg-blue-400 rounded-lg shadow-sm w-full flex justify-center text-white hover:bg-blue-500 border border-blue-500"
                        disabled={!canRedo}
                        onClick={redo}
                        title="Redo"
                    >
                        <Image src="/toolbar/material-symbols-light_redo.svg" alt="Redo" width={18} height={18} />
                    </button>
                </div>

                {/* 操作按钮 - 垂直布局 */}
                <div className="flex flex-col items-center space-y-3 w-full">
                    {/* 上传简历 */}
                    <button
                        className="btn-custom btn-sm flex flex-col items-center px-1 py-2 bg-blue-400 rounded-lg shadow-sm w-full border border-blue-500 text-white hover:bg-blue-500"
                        onClick={toggleResumeModal}
                        title="Upload Resume PDF"
                    >
                        <Image src="/toolbar/circum_export.svg" alt="Upload" width={16} height={16} className="mb-1" />
                        <span className="text-xs">Resume</span>
                    </button>
                    
                    {/* 上传JD */}
                    <button
                        className="btn-custom btn-sm flex flex-col items-center px-1 py-2 bg-blue-400 rounded-lg shadow-sm w-full border border-blue-500 text-white hover:bg-blue-500"
                        onClick={toggleJdModal}
                        title="Analyze Job Description"
                    >
                        <Image src="/toolbar/circum_export.svg" alt="上传" width={16} height={16} className="mb-1" />
                        <span className="text-xs">JD</span>
                    </button>
                    
                    {/* Reset button */}
                    <button
                        className="btn-custom btn-sm flex flex-col items-center px-1 py-2 bg-blue-400 rounded-lg shadow-sm w-full border border-blue-500 text-white hover:bg-blue-500"
                        onClick={handleResetResume}
                        title="Reset Resume"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mb-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        <span className="text-xs">Reset</span>
                    </button>
                    
                    {/* 保存按钮 */}
                    <button
                        type="button"
                        className={`btn-custom btn-sm flex flex-col items-center px-1 py-2 rounded-lg shadow-sm w-full border
                            ${isSaveSuccess ? 'bg-green-500 hover:bg-green-600 text-white border-green-600' : 'bg-blue-400 text-white border-blue-500 hover:bg-blue-500'} 
                            ${isSaveFailed ? 'bg-red-500 hover:bg-red-600 text-white border-red-600' : ''}`}
                        onClick={handleSaveResume}
                        disabled={isSaveLoading}
                        title={isSaveSuccess ? 'Saved!' : isSaveFailed ? `Saved failed: ${apiError || ''}` : 'Save Resume'}
                    >
                        {/* Save button content remains unchanged */}
                        <span className="text-xs">Save</span>
                    </button>
                    
                    {/* 下载PDF */}
                    <button
                        className="btn-custom btn-sm flex flex-col items-center px-1 py-2 bg-blue-400 rounded-lg shadow-sm w-full border border-blue-500 text-white hover:bg-blue-500"
                        onClick={handlePDFAction}
                        disabled={isPrinting}
                        title="Download PDF"
                    >
                        {/* Download button content remains unchanged */}
                        <span className="text-xs">Export</span>
                    </button>
                </div>
            </div>

            {/* 模态框保持不变 */}
            {showResumeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h5 className="text-lg font-semibold">upload resume</h5>
                            <button onClick={toggleResumeModal} className="text-gray-400 hover:text-gray-600">×</button>
                        </div>
                        <div className="p-4 space-y-3">
                            {apiError && <div className="alert alert-danger text-sm p-2">{apiError}</div>}
                            <div>
                                <label htmlFor="fileUpload" className="form-label">Choose PDF File:</label>
                                <input
                                    id="fileUpload"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
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
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h5 className="text-lg font-semibold">Analyze Job Description</h5>
                            <button onClick={toggleJdModal} className="text-gray-400 hover:text-gray-600">×</button>
                        </div>
                        <div className="p-4 space-y-3">
                            {apiError && <div className="alert alert-danger text-sm p-2">{apiError}</div>}
                            <div>
                                <label htmlFor="jobDescription" className="form-label">Add Job Description:</label>
                                <textarea
                                    id="jobDescription"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Add full job description here..."
                                    className="form-control min-h-[150px]"
                                    rows={8}
                                    disabled={isJdLoading}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 p-4 border-t">
                            <button type="button" className="btn-secondary" onClick={toggleJdModal} disabled={isJdLoading}>cancel</button>
                            <button type="button" className="btn-primary min-w-[80px] flex justify-center items-center" onClick={submitJdUpload} disabled={isJdLoading || !jobDescription.trim()}>
                                {isJdLoading ? <span className="spinner-border spinner-border-sm"></span> : 'submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ResumeToolbar;