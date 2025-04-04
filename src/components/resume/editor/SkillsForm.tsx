'use client';

import React, { useState, useRef } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import DraggableItem from './DraggableItem'; // Assuming DraggableItem is available

const SkillsForm: React.FC = () => {
    const { skills, addSkill, deleteSkill, reorderSkills, updateSkill } = useResumeStore(state => ({
        skills: state.model.skills,
        addSkill: state.addSkill,
        deleteSkill: state.deleteSkill,
        reorderSkills: state.reorderSkills,
        updateSkill: state.updateSkill, // Make sure updateSkill action exists in store
    }));

    const [newSkill, setNewSkill] = useState('');
    const [showDragHint, setShowDragHint] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);


    const handleAddSkill = () => {
        if (newSkill.trim() === '') return;
        addSkill(newSkill);
        setNewSkill(''); // Clear input after adding
        setShowDragHint(true);
        setTimeout(() => setShowDragHint(false), 3000);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddSkill();
        }
    };

    const handleDeleteSkill = (index: number, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent potential drag start or other parent events
        deleteSkill(index);
    };

    const onDragEnd = (startIndex: number, endIndex: number) => {
        if (startIndex === endIndex) return;
        reorderSkills(startIndex, endIndex);
    };

    // --- Inline Editing Logic ---
    const handleDoubleClick = (index: number, currentSkill: string) => {
        setEditingIndex(index);
        setEditingValue(currentSkill);
        // Focus the input after state updates
        requestAnimationFrame(() => {
            const inputElement = document.getElementById(`skill-edit-${index}`) as HTMLInputElement;
            inputElement?.focus();
            inputElement?.select();
        });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditingValue(e.target.value);
    };

    const handleEditBlur = (index: number) => {
        if (editingValue.trim() && editingValue.trim() !== skills[index]) {
            updateSkill(index, editingValue.trim());
        } else if (!editingValue.trim()) {
            // If edited to empty, delete the skill? Or revert? Let's delete.
            deleteSkill(index);
        }
        setEditingIndex(null); // Exit editing mode
    };

    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Enter') {
            handleEditBlur(index); // Save on Enter
        } else if (e.key === 'Escape') {
            setEditingIndex(null); // Cancel on Escape
            setEditingValue(''); // Reset editing value
        }
    };
    // --- End Inline Editing Logic ---


    return (
        <div className="mb-6 mx-auto w-full">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">🛠️ Skills</h2>
                {/* Add button removed, using input field instead */}
            </div>

            {showDragHint && <div className="alert alert-success p-2 text-sm mb-3"><strong>Drag & drop</strong> skills to reorder. <strong>Double-click</strong> to edit.</div>}

            <div className="card border shadow-sm">
                <div className="card-body p-3">
                    {/* Skills List - Using flex-wrap for chips */}
                    <div className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
                        {skills.length === 0 && !newSkill && (
                            <p className="text-gray-400 text-sm italic w-full">Enter your skills below.</p>
                        )}
                        {skills.map((skill, index) => (
                            <DraggableItem key={`${skill}-${index}`} id={index.toString()} index={index} onDragEnd={onDragEnd}>
                                {(isDragging) => (
                                    <div
                                        className={`skill-item rounded-full px-3 py-1 text-sm font-medium transition-all duration-150 ease-in-out flex items-center space-x-1.5 ${
                                            isDragging ? 'opacity-50 shadow-lg scale-105 bg-blue-200' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                        }`}
                                        onDoubleClick={() => handleDoubleClick(index, skill)}
                                        title="Drag to reorder, double-click to edit"
                                    >
                                        {editingIndex === index ? (
                                            <input
                                                type="text"
                                                id={`skill-edit-${index}`}
                                                value={editingValue}
                                                onChange={handleEditChange}
                                                onBlur={() => handleEditBlur(index)}
                                                onKeyDown={(e) => handleEditKeyDown(e, index)}
                                                className="p-0 m-0 bg-transparent border-none outline-none focus:ring-0 text-blue-800 text-sm font-medium"
                                                style={{ width: `${Math.max(editingValue.length, 5)}ch` }} // Basic dynamic width
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="truncate">{skill}</span>
                                        )}

                                        <button
                                            onClick={(e) => handleDeleteSkill(index, e)}
                                            className="p-0.5 rounded-full text-blue-500 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-1 focus:ring-red-300"
                                            aria-label="Remove skill"
                                            title="Remove skill"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </DraggableItem>
                        ))}
                    </div>

                    {/* Add Skill Input */}
                    <div className="flex items-center space-x-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter a skill and press Enter"
                            className="form-control form-control-sm flex-grow"
                        />
                        <button onClick={handleAddSkill} className="btn-custom btn-sm flex-shrink-0">Add</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillsForm;
