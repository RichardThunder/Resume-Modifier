'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import Toolbar from './Toolbar'; // Assuming Toolbar is in the same directory
import { formatDescriptionToHtmlList } from '@/lib/methods'; // Helper for formatting descriptions

// --- Inline Editing State Hook ---
// Manages editing state for multiple fields within multiple items
const useEditingState = () => {
    // Structure: { sectionKey: { itemIndex: { fieldName: boolean } } }
    // e.g., { education: { 0: { institutionName: true } } }
    const [editingFields, setEditingFields] = useState<Record<string, Record<number, Record<string, boolean>>>>({});

    const enableEdit = useCallback((sectionKey: string, index: number, field: string) => {
        setEditingFields(prev => ({
            ...prev,
            [sectionKey]: {
                ...(prev[sectionKey] || {}),
                [index]: {
                    ...(prev[sectionKey]?.[index] || {}),
                    [field]: true,
                }
            }
        }));
    }, []);

    const disableEdit = useCallback((sectionKey: string, index: number, field: string) => {
        // Check if the field actually exists before trying to modify
        if (editingFields[sectionKey]?.[index]?.[field]) {
            setEditingFields(prev => {
                const newSectionState = { ...prev[sectionKey] };
                const newItemState = { ...newSectionState[index] };
                delete newItemState[field]; // Remove the field to mark as not editing

                // If no fields are being edited for this item, remove the item entry
                if (Object.keys(newItemState).length === 0) {
                    delete newSectionState[index];
                } else {
                    newSectionState[index] = newItemState;
                }

                // If no items are being edited in this section, remove the section entry
                if (Object.keys(newSectionState).length === 0) {
                    const finalState = { ...prev };
                    delete finalState[sectionKey];
                    return finalState;
                } else {
                    return {
                        ...prev,
                        [sectionKey]: newSectionState,
                    };
                }
            });
        }
    }, [editingFields]); // Add editingFields as dependency


    const isEditing = useCallback((sectionKey: string, index: number, field: string): boolean => {
        return !!editingFields[sectionKey]?.[index]?.[field];
    }, [editingFields]);

    return { isEditing, enableEdit, disableEdit };
};


// --- Main Preview Component ---
const ResumePreview: React.FC = () => {
    const model = useResumeStore((state) => state.model);
    const updateField = useResumeStore((state) => state.updateField);
    const updateNestedField = useResumeStore((state) => state.updateNestedField);
    const updateUserInfoField = useResumeStore((state) => state.updateUserInfoField);
    const updateSkill = useResumeStore((state) => state.updateSkill); // Action to update skill
    const { isEditing, enableEdit, disableEdit } = useEditingState();

    // Helper to handle saving changes from inline edits
    const handleSave = (sectionKey: any, index: number, field: string, value: string) => {
        // console.log(`Saving: ${sectionKey}[${index}].${field} = ${value}`);
        updateNestedField(sectionKey, index, field, value.trim());
        disableEdit(sectionKey, index, field);
    };
    const handleSaveUserInfo = (field: keyof typeof model.userInfo, value: string) => {
        updateUserInfoField(field, value.trim());
        disableEdit('userInfo', 0, field); // Assuming index 0 for userInfo
    };
    const handleSaveSummary = (value: string) => {
        updateField('summary', value.trim());
        disableEdit('summary', 0, 'summary'); // Special case for summary
    };
    const handleSaveSkill = (index: number, value: string) => {
        updateSkill(index, value.trim()); // Use the specific updateSkill action
        disableEdit('skills', index, 'skill');
    };
    const handleSaveAchievements = (value: string) => {
        // Assuming achievements are stored as an array, convert back
        const achievementsArray = value
            .split('\n')
            .map(line => line.trim().replace(/^•\s*/, '').trim())
            .filter(line => line.length > 0);
        updateField('achievements', achievementsArray);
        disableEdit('achievements', 0, 'achievements'); // Special case
    };


    // --- InlineEdit Component ---
    interface InlineEditProps {
        sectionKey: string;
        index: number;
        field: string;
        value: string | undefined;
        placeholder?: string;
        onSave: (sectionKey: any, index: number, field: string, value: string) => void;
        multiline?: boolean;
        rows?: number;
    }

    const InlineEdit: React.FC<InlineEditProps> = ({ sectionKey, index, field, value = '', placeholder = "...", onSave, multiline = false, rows = 3 }) => {
        const [currentValue, setCurrentValue] = useState(value);
        const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
        const isCurrentlyEditing = isEditing(sectionKey, index, field);

        useEffect(() => {
            setCurrentValue(value); // Sync with external changes
        }, [value]);

        useEffect(() => {
            if (isCurrentlyEditing && inputRef.current) {
                inputRef.current.focus();
                if (inputRef.current instanceof HTMLInputElement) {
                    inputRef.current.select();
                } else if (inputRef.current instanceof HTMLTextAreaElement) {
                    const textarea = inputRef.current;
                    textarea.style.height = 'auto'; // Reset height
                    textarea.style.height = `${textarea.scrollHeight}px`; // Set to content height
                    // Place cursor at end
                    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
                }
            }
        }, [isCurrentlyEditing]);

        const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setCurrentValue(e.target.value);
            // Auto-resize textarea
            if (multiline && inputRef.current instanceof HTMLTextAreaElement) {
                inputRef.current.style.height = 'auto';
                inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
            }
        };

        const handleLocalBlur = () => {
            if (currentValue !== value) {
                onSave(sectionKey, index, field, currentValue);
            }
            disableEdit(sectionKey, index, field); // Always disable on blur
        };

        const handleLocalKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !multiline) { // Save on Enter for single line
                handleLocalBlur();
            } else if (e.key === 'Enter' && e.shiftKey && multiline) {
                // Allow Shift+Enter for newline in textarea (default behavior)
            } else if (e.key === 'Enter' && !e.shiftKey && multiline) {
                // Optional: Save on Enter in textarea (if desired, otherwise remove this)
                // e.preventDefault(); // Prevent newline
                // handleLocalBlur();
            } else if (e.key === 'Escape') {
                setCurrentValue(value); // Revert changes
                disableEdit(sectionKey, index, field);
            }
        };

        return isCurrentlyEditing ? (
            multiline ? (
                <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={currentValue}
                    onChange={handleLocalChange}
                    onBlur={handleLocalBlur}
                    onKeyDown={handleLocalKeyDown}
                    rows={rows}
                    className="p-1 border border-dashed border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded text-inherit bg-transparent w-full resize-none leading-normal" // Adjusted styles
                />
            ) : (
                <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type="text"
                    value={currentValue}
                    onChange={handleLocalChange}
                    onBlur={handleLocalBlur}
                    onKeyDown={handleLocalKeyDown}
                    className="p-1 border border-dashed border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded text-inherit bg-transparent w-full leading-normal" // Adjusted styles
                />
            )
        ) : (
            <span
                onDoubleClick={() => enableEdit(sectionKey, index, field)}
                className="hover:bg-gray-100 px-1 cursor-pointer min-h-[1em] block" // block display for full width click area
                title="Double-click to edit"
            >
                 {value || <span className="text-gray-400 italic">{placeholder}</span>}
             </span>
        );
    };
    // --- End InlineEdit Component ---


    // --- InlineEdit for specific non-nested fields ---
    const InlineEditSimple = ({ sectionKey, field, value, placeholder, onSave, multiline = false, rows = 3 }: { sectionKey: string; field: string; value: string | undefined; placeholder?: string; onSave: (value: string) => void; multiline?: boolean, rows?: number }) => {
        const [currentValue, setCurrentValue] = useState(value || '');
        const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
        const isCurrentlyEditing = isEditing(sectionKey, 0, field); // Use index 0 for simple fields

        useEffect(() => { setCurrentValue(value || ''); }, [value]); // Sync with external

        useEffect(() => {
            if (isCurrentlyEditing && inputRef.current) {
                inputRef.current.focus();
                // Selection/cursor logic as in InlineEdit
                if (inputRef.current instanceof HTMLInputElement) inputRef.current.select();
                else if (inputRef.current instanceof HTMLTextAreaElement) {
                    const ta = inputRef.current; ta.selectionStart = ta.selectionEnd = ta.value.length;
                    ta.style.height = 'auto'; ta.style.height = `${ta.scrollHeight}px`;
                }
            }
        }, [isCurrentlyEditing]);

        const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setCurrentValue(e.target.value);
            if (multiline && inputRef.current instanceof HTMLTextAreaElement) {
                inputRef.current.style.height = 'auto'; inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
            }
        };
        const handleLocalBlur = () => { if (currentValue !== value) onSave(currentValue); disableEdit(sectionKey, 0, field); };
        const handleLocalKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !multiline) handleLocalBlur();
            else if (e.key === 'Escape') { setCurrentValue(value || ''); disableEdit(sectionKey, 0, field); }
        };

        return isCurrentlyEditing ? (
            multiline ? (
                <textarea ref={inputRef as React.RefObject<HTMLTextAreaElement>} value={currentValue} onChange={handleLocalChange} onBlur={handleLocalBlur} onKeyDown={handleLocalKeyDown} rows={rows} className="p-1 border border-dashed border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded text-inherit bg-transparent w-full resize-none leading-normal" />
            ) : (
                <input ref={inputRef as React.RefObject<HTMLInputElement>} type="text" value={currentValue} onChange={handleLocalChange} onBlur={handleLocalBlur} onKeyDown={handleLocalKeyDown} className="p-1 border border-dashed border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded text-inherit bg-transparent w-full leading-normal" />
            )
        ) : (
            <span onDoubleClick={() => enableEdit(sectionKey, 0, field)} className="hover:bg-gray-100 px-1 cursor-pointer min-h-[1em] block" title="Double-click to edit">
                 {value || <span className="text-gray-400 italic">{placeholder}</span>}
             </span>
        );
    };
    // --- End InlineEditSimple Component ---


    return (
        <div className="resume-preview bg-white print:shadow-none print:border-none print:p-0">
            {/* Toolbar is rendered outside this component in the page */}
            {/* Use a specific class for print targeting */}
            <div className="resume-container p-[15mm] mx-auto w-[210mm] min-h-[297mm] bg-white shadow-lg print:shadow-none print:p-[15mm] print:m-0 print:w-full">
                {/* Header */}
                <header className="flex justify-between items-start mb-[10mm] text-sm">
                    <div className="flex flex-col text-left">
                        {/* Use InlineEditSimple for user info */}
                        <h1 className="text-3xl font-bold mb-1">
                            <InlineEditSimple sectionKey="userInfo" field="firstName" value={model.userInfo.firstName} placeholder="First Name" onSave={(val) => handleSaveUserInfo('firstName', val)} />
                            {' '}
                            <InlineEditSimple sectionKey="userInfo" field="lastName" value={model.userInfo.lastName} placeholder="Last Name" onSave={(val) => handleSaveUserInfo('lastName', val)} />
                        </h1>
                        <div className="mb-1">
                            <InlineEditSimple sectionKey="userInfo" field="headLine" value={model.userInfo.headLine} placeholder="Your Headline (e.g., Software Engineer)" onSave={(val) => handleSaveUserInfo('headLine', val)} />
                        </div>
                        <p className="text-xs text-gray-600">
                            {model.userInfo.city || model.userInfo.country ? (
                                <>
                                    <InlineEditSimple sectionKey="userInfo" field="city" value={model.userInfo.city} placeholder="City" onSave={(val) => handleSaveUserInfo('city', val)} />
                                    {model.userInfo.city && model.userInfo.country && ', '}
                                    <InlineEditSimple sectionKey="userInfo" field="country" value={model.userInfo.country} placeholder="Country" onSave={(val) => handleSaveUserInfo('country', val)} />
                                </>
                            ) : (
                                <span onDoubleClick={() => enableEdit('userInfo', 0, 'city')} className="text-gray-400 italic cursor-pointer hover:bg-gray-100 px-1">City, Country</span>
                            )}
                        </p>
                    </div>
                    <div className="flex flex-col text-right text-xs space-y-0.5">
                        <p>
                            <InlineEditSimple sectionKey="userInfo" field="email" value={model.userInfo.email} placeholder="your.email@example.com" onSave={(val) => handleSaveUserInfo('email', val)} />
                        </p>
                        <p>
                            <InlineEditSimple sectionKey="userInfo" field="phoneNumber" value={model.userInfo.phoneNumber} placeholder="(123) 456-7890" onSave={(val) => handleSaveUserInfo('phoneNumber', val)} />
                        </p>
                        <p>
                            <InlineEditSimple sectionKey="userInfo" field="linkedInURL" value={model.userInfo.linkedInURL} placeholder="linkedin.com/in/..." onSave={(val) => handleSaveUserInfo('linkedInURL', val)} />
                        </p>
                        <p>
                            <InlineEditSimple sectionKey="userInfo" field="websiteOrOtherProfileURL" value={model.userInfo.websiteOrOtherProfileURL} placeholder="github.com/... or portfolio" onSave={(val) => handleSaveUserInfo('websiteOrOtherProfileURL', val)} />
                        </p>
                    </div>
                </header>

                {/* Summary Section */}
                {model.summary && (
                    <section className="resume-section mb-[8mm]">
                        <h2 className="resume-section-title">SUMMARY</h2>
                        <div className="text-sm leading-relaxed">
                            <InlineEditSimple
                                sectionKey="summary"
                                field="summary" // Use a consistent field name
                                value={model.summary}
                                placeholder="Double-click to add a professional summary"
                                onSave={handleSaveSummary}
                                multiline={true}
                                rows={3}
                            />
                        </div>
                    </section>
                )}

                {/* Education Section */}
                {model.education?.length > 0 && (
                    <section className="resume-section mb-[8mm]">
                        <h2 className="resume-section-title">EDUCATION</h2>
                        <ul className="space-y-3 list-none p-0">
                            {model.education.map((edu, index) => (
                                <li key={`edu-${index}`} className="flex text-sm">
                                    <div className="w-[30%] pr-4 text-xs text-gray-600">
                                        <div className="font-semibold text-sm text-black mb-0.5">
                                            <InlineEdit sectionKey="education" index={index} field="institutionName" value={edu.institutionName} placeholder="Institution Name" onSave={handleSave} />
                                        </div>
                                        <p>
                                            <InlineEdit sectionKey="education" index={index} field="city" value={edu.city} placeholder="City" onSave={handleSave} />
                                            {edu.city && edu.country && ', '}
                                            <InlineEdit sectionKey="education" index={index} field="country" value={edu.country} placeholder="Country" onSave={handleSave} />
                                        </p>
                                        <p className="italic mt-0.5">
                                            <InlineEdit sectionKey="education" index={index} field="fromDate" value={edu.fromDate} placeholder="Start Date" onSave={handleSave} />
                                            {edu.isPresent ? ' - Present' : (
                                                <>
                                                    {edu.fromDate && edu.toDate && ' - '}
                                                    <InlineEdit sectionKey="education" index={index} field="toDate" value={edu.toDate} placeholder="End Date" onSave={handleSave} />
                                                </>
                                            )}
                                            {/* Add isPresent editing if needed */}
                                        </p>
                                    </div>
                                    <div className="w-[70%]">
                                        <div className="font-bold text-base mb-0.5">
                                            <InlineEdit sectionKey="education" index={index} field="degree" value={edu.degree} placeholder="Degree" onSave={handleSave} />
                                            {edu.degree && edu.fieldOfStudy && ' in '}
                                            <InlineEdit sectionKey="education" index={index} field="fieldOfStudy" value={edu.fieldOfStudy} placeholder="Field of Study" onSave={handleSave} />
                                        </div>
                                        <div className="text-xs text-gray-700 prose prose-sm max-w-none">
                                            {/* Render description using InlineEdit */}
                                            <InlineEdit
                                                sectionKey="education"
                                                index={index}
                                                field="description"
                                                value={edu.description}
                                                placeholder="Double-click to add description..."
                                                onSave={handleSave}
                                                multiline={true}
                                                rows={3} // Adjust default rows
                                            />
                                            {/* Or use dangerouslySetInnerHTML if editing is too complex here */}
                                            {/* <div
                                                 className="list-disc pl-5 space-y-1" // Tailwind classes for basic list styling
                                                dangerouslySetInnerHTML={{ __html: formatDescriptionToHtmlList(edu.description) }}
                                                 onDoubleClick={() => enableEdit('education', index, 'description')} // Still allow double-click to maybe open a modal editor?
                                            /> */}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Work Experience Section */}
                {model.workExperience?.length > 0 && (
                    <section className="resume-section mb-[8mm]">
                        <h2 className="resume-section-title">WORK EXPERIENCE</h2>
                        <ul className="space-y-3 list-none p-0">
                            {model.workExperience.map((job, index) => (
                                <li key={`work-${index}`} className="flex text-sm">
                                    <div className="w-[30%] pr-4 text-xs text-gray-600">
                                        <div className="font-semibold text-sm text-black mb-0.5">
                                            <InlineEdit sectionKey="workExperience" index={index} field="companyName" value={job.companyName} placeholder="Company Name" onSave={handleSave} />
                                        </div>
                                        <p>
                                            <InlineEdit sectionKey="workExperience" index={index} field="city" value={job.city} placeholder="City" onSave={handleSave} />
                                            {job.city && job.country && ', '}
                                            <InlineEdit sectionKey="workExperience" index={index} field="country" value={job.country} placeholder="Country" onSave={handleSave} />
                                        </p>
                                        <p className="italic mt-0.5">
                                            <InlineEdit sectionKey="workExperience" index={index} field="fromDate" value={job.fromDate} placeholder="Start Date" onSave={handleSave} />
                                            {job.isPresent ? ' - Present' : (
                                                <>
                                                    {job.fromDate && job.toDate && ' - '}
                                                    <InlineEdit sectionKey="workExperience" index={index} field="toDate" value={job.toDate} placeholder="End Date" onSave={handleSave} />
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <div className="w-[70%]">
                                        <div className="font-bold text-base mb-0.5">
                                            <InlineEdit sectionKey="workExperience" index={index} field="jobTitle" value={job.jobTitle} placeholder="Job Title" onSave={handleSave} />
                                        </div>
                                        <div className="text-xs text-gray-700 prose prose-sm max-w-none">
                                            <InlineEdit sectionKey="workExperience" index={index} field="description" value={job.description} placeholder="Job description..." onSave={handleSave} multiline={true} rows={4} />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}


                {/* Skills Section */}
                {model.skills?.length > 0 && (
                    <section className="resume-section mb-[8mm]">
                        <h2 className="resume-section-title">SKILLS</h2>
                        <ul className="list-none p-0 flex flex-wrap gap-x-2 gap-y-1">
                            {model.skills.map((skill, index) => (
                                <li key={`skill-${index}`} className="text-sm inline-block">
                                    <InlineEdit
                                        sectionKey="skills"
                                        index={index}
                                        field="skill" // Use a generic field name for the skill itself
                                        value={skill}
                                        placeholder="Skill..."
                                        onSave={(section, idx, field, value) => handleSaveSkill(idx, value)} // Use specific skill save handler
                                    />
                                    {index < model.skills.length - 1 && <span className="text-gray-400">, </span>} {/* Add comma separator */}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Achievements Section */}
                {model.achievements?.length > 0 && (
                    <section className="resume-section mb-[8mm]">
                        <h2 className="resume-section-title">ACHIEVEMENTS</h2>
                        <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                            {/* Edit achievements as a single block */}
                            <InlineEditSimple
                                sectionKey="achievements"
                                field="achievements"
                                value={model.achievements.join('\n')} // Join array for editing
                                placeholder="Double-click to add achievements..."
                                onSave={handleSaveAchievements} // Use specific handler
                                multiline={true}
                                rows={4}
                            />
                            {/* Or render as list items if not editing */}
                            {/* <ul className="list-disc pl-5 space-y-1">
                                  {model.achievements.map((ach, index) => (
                                      <li key={`ach-${index}`}>{ach}</li>
                                  ))}
                              </ul> */}
                        </div>
                    </section>
                )}


                {/* Projects Section */}
                {model.project?.length > 0 && (
                    <section className="resume-section mb-[8mm]">
                        <h2 className="resume-section-title">PROJECTS</h2>
                        <ul className="space-y-3 list-none p-0">
                            {model.project.map((proj, index) => (
                                <li key={`proj-${index}`} className="flex text-sm">
                                    <div className="w-[30%] pr-4 text-xs text-gray-600">
                                        <div className="font-semibold text-sm text-black mb-0.5">
                                            <InlineEdit sectionKey="project" index={index} field="title" value={proj.title} placeholder="Project Title" onSave={handleSave} />
                                        </div>
                                        <p> {/* City/Country can be optional */}
                                            {(proj.city || proj.country) && (
                                                <>
                                                    <InlineEdit sectionKey="project" index={index} field="city" value={proj.city} placeholder="City" onSave={handleSave} />
                                                    {proj.city && proj.country && ', '}
                                                    <InlineEdit sectionKey="project" index={index} field="country" value={proj.country} placeholder="Country" onSave={handleSave} />
                                                </>
                                            )}
                                        </p>
                                        <p className="italic mt-0.5">
                                            <InlineEdit sectionKey="project" index={index} field="fromDate" value={proj.fromDate} placeholder="Start Date" onSave={handleSave} />
                                            {proj.isPresent ? ' - Present' : (
                                                <>
                                                    {proj.fromDate && proj.toDate && ' - '}
                                                    <InlineEdit sectionKey="project" index={index} field="toDate" value={proj.toDate} placeholder="End Date" onSave={handleSave} />
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <div className="w-[70%]">
                                        <div className="font-bold text-base mb-0.5">
                                            <InlineEdit sectionKey="project" index={index} field="projectRole" value={proj.projectRole} placeholder="Your Role" onSave={handleSave} />
                                        </div>
                                        <div className="text-xs text-gray-700 prose prose-sm max-w-none">
                                            <InlineEdit sectionKey="project" index={index} field="description" value={proj.description} placeholder="Project description..." onSave={handleSave} multiline={true} rows={4} />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Awards Section */}
                {model.award?.length > 0 && (
                    <section className="resume-section mb-[8mm]">
                        <h2 className="resume-section-title">AWARDS</h2>
                        <ul className="space-y-3 list-none p-0">
                            {model.award.map((aw, index) => (
                                <li key={`award-${index}`} className="flex text-sm">
                                    <div className="w-[30%] pr-4 text-xs text-gray-600">
                                        <p className="font-semibold text-sm text-black mb-0.5">
                                            <InlineEdit sectionKey="award" index={index} field="dateOfAward" value={aw.dateOfAward} placeholder="Date" onSave={handleSave} />
                                        </p>
                                        {aw.urlToAward && (
                                            <p>
                                                <a href={aw.urlToAward} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                                    {/* Make URL editable? */}
                                                    <InlineEdit sectionKey="award" index={index} field="urlToAward" value={aw.urlToAward} placeholder="Award URL" onSave={handleSave} />
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                    <div className="w-[70%]">
                                        <div className="font-bold text-base mb-0.5">
                                            <InlineEdit sectionKey="award" index={index} field="name" value={aw.name} placeholder="Award Name" onSave={handleSave} />
                                            {aw.name && aw.issuer && ' by '}
                                            <InlineEdit sectionKey="award" index={index} field="issuer" value={aw.issuer} placeholder="Issuer" onSave={handleSave} />
                                        </div>
                                        <div className="text-xs text-gray-700 prose prose-sm max-w-none">
                                            <InlineEdit sectionKey="award" index={index} field="description" value={aw.description} placeholder="Award description..." onSave={handleSave} multiline={true} rows={2} />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Certifications Section */}
                {model.certifications?.length > 0 && (
                    <section className="resume-section mb-[8mm]">
                        <h2 className="resume-section-title">CERTIFICATIONS</h2>
                        <ul className="space-y-3 list-none p-0">
                            {model.certifications.map((cert, index) => (
                                <li key={`cert-${index}`} className="flex text-sm">
                                    <div className="w-[30%] pr-4 text-xs text-gray-600">
                                        <p className="font-semibold text-sm text-black mb-0.5">
                                            <InlineEdit sectionKey="certifications" index={index} field="date" value={cert.date} placeholder="Date Issued" onSave={handleSave} />
                                            {cert.expiryDate && ' (Expires: '}
                                            {cert.expiryDate && <InlineEdit sectionKey="certifications" index={index} field="expiryDate" value={cert.expiryDate} placeholder="Expiry" onSave={handleSave} />}
                                            {cert.expiryDate && ')'}
                                        </p>
                                        {cert.url && (
                                            <p>
                                                <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                                    <InlineEdit sectionKey="certifications" index={index} field="url" value={cert.url} placeholder="Certificate URL" onSave={handleSave} />
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                    <div className="w-[70%]">
                                        <div className="font-bold text-base mb-0.5">
                                            <InlineEdit sectionKey="certifications" index={index} field="name" value={cert.name} placeholder="Certification Name" onSave={handleSave} />
                                            {cert.name && cert.issuer && ' by '}
                                            <InlineEdit sectionKey="certifications" index={index} field="issuer" value={cert.issuer} placeholder="Issuer" onSave={handleSave} />
                                        </div>
                                        <div className="text-xs text-gray-700 prose prose-sm max-w-none">
                                            <InlineEdit sectionKey="certifications" index={index} field="description" value={cert.description} placeholder="Certification description..." onSave={handleSave} multiline={true} rows={2} />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Publications Section */}
                {model.publications?.length > 0 && (
                    <section className="resume-section mb-[8mm]">
                        <h2 className="resume-section-title">PUBLICATIONS</h2>
                        <ul className="space-y-3 list-none p-0">
                            {model.publications.map((pub, index) => (
                                <li key={`pub-${index}`} className="flex text-sm">
                                    <div className="w-[30%] pr-4 text-xs text-gray-600">
                                        <p className="font-semibold text-sm text-black mb-0.5">
                                            <InlineEdit sectionKey="publications" index={index} field="date" value={pub.date} placeholder="Date" onSave={handleSave} />
                                        </p>
                                        {pub.url && (
                                            <p>
                                                <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                                    <InlineEdit sectionKey="publications" index={index} field="url" value={pub.url} placeholder="Publication URL" onSave={handleSave} />
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                    <div className="w-[70%]">
                                        <div className="font-bold text-base mb-0.5">
                                            <InlineEdit sectionKey="publications" index={index} field="name" value={pub.name} placeholder="Publication Title" onSave={handleSave} />
                                        </div>
                                        <div className="text-xs text-gray-700 italic">
                                            Publisher: <InlineEdit sectionKey="publications" index={index} field="publisher" value={pub.publisher} placeholder="Publisher" onSave={handleSave} />
                                        </div>
                                        {/* Add description if needed */}
                                        {/* <div className="text-xs text-gray-700 prose prose-sm max-w-none mt-1">
                                              <InlineEdit sectionKey="publications" index={index} field="description" value={pub.description} placeholder="Description..." onSave={handleSave} multiline={true} rows={1} />
                                          </div> */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Volunteering Section */}
                {model.volunteering?.length > 0 && (
                    <section className="resume-section mb-[8mm]">
                        <h2 className="resume-section-title">VOLUNTEERING</h2>
                        <ul className="space-y-3 list-none p-0">
                            {model.volunteering.map((vol, index) => (
                                <li key={`vol-${index}`} className="flex text-sm">
                                    <div className="w-[30%] pr-4 text-xs text-gray-600">
                                        <div className="font-semibold text-sm text-black mb-0.5">
                                            {/* Organization Name can be here or under title */}
                                            <InlineEdit sectionKey="volunteering" index={index} field="name" value={vol.name} placeholder="Organization Name" onSave={handleSave} />
                                        </div>
                                        <p>
                                            <InlineEdit sectionKey="volunteering" index={index} field="city" value={vol.city} placeholder="City" onSave={handleSave} />
                                            {vol.city && vol.country && ', '}
                                            <InlineEdit sectionKey="volunteering" index={index} field="country" value={vol.country} placeholder="Country" onSave={handleSave} />
                                        </p>
                                        <p className="italic mt-0.5">
                                            <InlineEdit sectionKey="volunteering" index={index} field="fromDate" value={vol.fromDate} placeholder="Start Date" onSave={handleSave} />
                                            {vol.isPresent ? ' - Present' : (
                                                <>
                                                    {vol.fromDate && vol.toDate && ' - '}
                                                    <InlineEdit sectionKey="volunteering" index={index} field="toDate" value={vol.toDate} placeholder="End Date" onSave={handleSave} />
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <div className="w-[70%]">
                                        <div className="font-bold text-base mb-0.5">
                                            <InlineEdit sectionKey="volunteering" index={index} field="role" value={vol.role} placeholder="Your Role" onSave={handleSave} />
                                            {/* Optional: Add 'at Organization' if name is not on left */}
                                            {/* {vol.role && vol.name && ' at '} */}
                                            {/* {vol.role && vol.name && <InlineEdit sectionKey="volunteering" index={index} field="name" value={vol.name} placeholder="Organization Name" onSave={handleSave} />} */}
                                        </div>
                                        <div className="text-xs text-gray-700 prose prose-sm max-w-none">
                                            <InlineEdit sectionKey="volunteering" index={index} field="description" value={vol.description} placeholder="Volunteering description..." onSave={handleSave} multiline={true} rows={3} />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* References Section */}
                {model.references?.length > 0 && (
                    <section className="resume-section mb-[8mm]">
                        <h2 className="resume-section-title">REFERENCES</h2>
                        <ul className="space-y-3 list-none p-0">
                            {model.references.map((ref, index) => (
                                <li key={`ref-${index}`} className="flex text-sm">
                                    <div className="w-[30%] pr-4 text-xs text-gray-600">
                                        <div className="font-semibold text-sm text-black mb-0.5">
                                            <InlineEdit sectionKey="references" index={index} field="company" value={ref.company} placeholder="Company (Optional)" onSave={handleSave} />
                                        </div>
                                        <p>
                                            <InlineEdit sectionKey="references" index={index} field="email" value={ref.email} placeholder="Email" onSave={handleSave} />
                                        </p>
                                        <p>
                                            <InlineEdit sectionKey="references" index={index} field="phoneNumber" value={ref.phoneNumber} placeholder="Phone" onSave={handleSave} />
                                        </p>
                                    </div>
                                    <div className="w-[70%]">
                                        <div className="font-bold text-base mb-0.5">
                                            <InlineEdit sectionKey="references" index={index} field="personName" value={ref.personName} placeholder="Reference Name" onSave={handleSave} />
                                            {ref.personName && ref.roleOfPerson && ', '}
                                            <InlineEdit sectionKey="references" index={index} field="roleOfPerson" value={ref.roleOfPerson} placeholder="Role" onSave={handleSave} />
                                        </div>
                                        <div className="text-xs text-gray-700 prose prose-sm max-w-none">
                                            <InlineEdit sectionKey="references" index={index} field="description" value={ref.description} placeholder="Reference details..." onSave={handleSave} multiline={true} rows={2} />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <p className="text-center text-xs text-gray-500 mt-2 italic">References available upon request.</p>
                    </section>
                )}

            </div>
        </div>
    );
};


// --- Internal CSS for Resume Section Title ---
const ResumeSectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="border-b-2 border-gray-700 text-gray-800 mb-2 pb-1 font-bold text-lg uppercase tracking-wide">
        {children}
    </h2>
);

// Append styles directly or use Tailwind's @layer components
const styles = `
.resume-section-title {
    border-bottom: 2px solid rgb(75, 57, 57);
    color: #333;
    margin-bottom: 8px; /* ~2mm */
    padding-bottom: 4px;
    font-size: 1.125rem; /* ~18px */
    line-height: 1.2;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
/* Add other print-specific or base styles from original CSS if needed */
`;

// Inject styles (less ideal than Tailwind/CSS Modules, but works)
if (typeof window !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

export default ResumePreview;