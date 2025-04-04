import React, { useState, useEffect, useRef, ChangeEvent, FocusEvent } from 'react';

interface DoubleClickEditableProps {
    initialValue: string | undefined;
    placeholder?: string;
    onSave: (newValue: string) => void;
    inputType?: 'input' | 'textarea'; // Specify input type
    inputClassName?: string; // Allow passing custom classes for the input/textarea
    displayClassName?: string; // Allow passing custom classes for the display span
    rows?: number; // For textarea
}

const DoubleClickEditable: React.FC<DoubleClickEditableProps> = ({
                                                                     initialValue = '',
                                                                     placeholder = 'Click to edit',
                                                                     onSave,
                                                                     inputType = 'input',
                                                                     inputClassName = '', // Default empty
                                                                     displayClassName = '', // Default empty
                                                                     rows = 1,
                                                                 }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    // Update internal state if initialValue prop changes from outside
    useEffect(() => {
        setCurrentValue(initialValue);
    }, [initialValue]);

    // Focus input when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            // Select text in input for easier editing
            if (inputType === 'input') {
                (inputRef.current as HTMLInputElement).select();
            } else {
                // For textarea, place cursor at the end
                const textarea = inputRef.current as HTMLTextAreaElement;
                textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
            }
        }
    }, [isEditing, inputType]);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCurrentValue(e.target.value);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // Check if the blur was caused by clicking outside the component
        // This check might be complex, for simplicity we save on blur
        saveEdit();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && inputType === 'input') {
            // Save on Enter for single-line input
            saveEdit();
        } else if (e.key === 'Enter' && e.shiftKey && inputType === 'textarea') {
            // Allow Shift+Enter for newlines in textarea, do nothing special here
        } else if (e.key === 'Enter' && !e.shiftKey && inputType === 'textarea') {
            // Save on Enter (without Shift) for textarea
            // e.preventDefault(); // Prevent default newline insertion
            // saveEdit(); // Decide if Enter should save textarea or just add newline
        } else if (e.key === 'Escape') {
            // Cancel edit on Escape
            cancelEdit();
        }
    };


    const saveEdit = () => {
        setIsEditing(false);
        // Only call onSave if the value actually changed
        if (currentValue !== initialValue) {
            onSave(currentValue.trim()); // Trim value before saving
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setCurrentValue(initialValue); // Revert to original value
    };

    // Common input props
    const commonInputProps = {
        ref: inputRef as any, // Type assertion needed due to union type ref
        value: currentValue,
        onChange: handleChange,
        onBlur: handleBlur,
        onKeyDown: handleKeyDown,
        className: `p-1 border border-dashed border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded text-inherit bg-transparent ${inputClassName}`, // Basic styling + custom class
    };

    return (
        <div className="inline-block min-w-[50px] cursor-pointer w-full"> {/* Allow full width */}
            {isEditing ? (
                inputType === 'textarea' ? (
                    <textarea
                        {...commonInputProps}
                        rows={rows}
                        style={{ width: '100%', resize: 'none', lineHeight: 'inherit' }} // Ensure textarea takes width and looks right
                    />
                ) : (
                    <input
                        type="text"
                        {...commonInputProps}
                        style={{ width: '100%', lineHeight: 'inherit' }} // Ensure input takes width
                    />
                )
            ) : (
                <span
                    onDoubleClick={handleDoubleClick}
                    className={`hover:bg-gray-100 px-1 ${displayClassName}`} // Basic hover + custom class
                    title="Double-click to edit" // Tooltip hint
                >
                    {currentValue || <span className="text-gray-400 italic">{placeholder}</span>}
                </span>
            )}
        </div>
    );
};

export default DoubleClickEditable;