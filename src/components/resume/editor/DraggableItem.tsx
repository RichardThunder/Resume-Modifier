'use client'; // This component uses client-side state and event handlers

import React, { useState, useRef, DragEvent } from 'react';

interface DraggableItemProps {
    /** Unique identifier for the item (can be index as string or a real ID) */
    id: string;
    /** The current index of the item in the list */
    index: number;
    /** Children can be a render prop receiving the dragging state */
    children: (isDragging: boolean) => React.ReactNode;
    /** Callback function when a drag operation ends, providing start and end indices */
    onDragEnd: (startIndex: number, endIndex: number) => void;
    /** Optional: Class name to apply when an item is being dragged over this item */
    dragOverClassName?: string;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
                                                         id,
                                                         index,
                                                         children,
                                                         onDragEnd,
                                                         dragOverClassName = 'border-blue-400 border-2 shadow-inner', // Default visual cue
                                                     }) => {
    const [isDragging, setIsDragging] = useState(false);
    // Ref to track drag enter/leave events more reliably, especially with nested elements
    const dragCounter = useRef(0);
    const itemRef = useRef<HTMLDivElement>(null); // Ref for the draggable element

    const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
        // Store the index of the item being dragged
        e.dataTransfer.setData('text/plain', index.toString());
        // Optional: Add a class to the body or a parent to indicate a drag is in progress
        document.body.classList.add('dragging');
        // Set a subtle drag image if needed (otherwise browser default)
        // e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
    };

    const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
        setIsDragging(false);
        dragCounter.current = 0; // Reset counter
        document.body.classList.remove('dragging'); // Clean up body class
        // Remove visual cues if they weren't removed by dragLeave/drop
        itemRef.current?.classList.remove(...(dragOverClassName.split(' ')));
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Necessary to allow the drop event
        e.dataTransfer.dropEffect = 'move';
        // Optionally add hover effects here if not handled by dragEnter
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false); // Ensure dragging state is reset
        dragCounter.current = 0; // Reset counter
        itemRef.current?.classList.remove(...(dragOverClassName.split(' '))); // Remove visual cue
        document.body.classList.remove('dragging'); // Clean up body class

        const startIndexStr = e.dataTransfer.getData('text/plain');
        if (startIndexStr) {
            const startIndex = parseInt(startIndexStr, 10);
            const endIndex = index; // The index of the item being dropped onto
            // Prevent dropping onto itself and ensure index is valid
            if (!isNaN(startIndex) && startIndex !== endIndex) {
                onDragEnd(startIndex, endIndex); // Notify parent component
            }
        }
    };

    // Add visual cue when dragging over THIS item
    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        dragCounter.current++;
        // Apply visual cue only when entering the element itself
        if (itemRef.current && dragCounter.current === 1) {
            // Check if we are dragging over a *different* item
            const draggedIndexStr = e.dataTransfer.getData('text/plain'); // May not always work reliably here
            // A better check might involve comparing the ID if available globally or just applying the style
            itemRef.current.classList.add(...(dragOverClassName.split(' ')));
        }
    };

    // Remove visual cue when leaving THIS item
    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        dragCounter.current--;
        // Remove visual cue only when the counter reaches 0 (truly leaving the element)
        if (itemRef.current && dragCounter.current === 0) {
            itemRef.current.classList.remove(...(dragOverClassName.split(' ')));
        }
    };

    return (
        <div
            ref={itemRef}
            draggable // Make the div draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            // Apply dynamic classes based on isDragging state
            className={`${isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'} transition-opacity duration-150`}
            data-index={index} // Store index for potential debugging or complex drop logic
        >
            {/* Render children, passing down the dragging state */}
            {children(isDragging)}
        </div>
    );
};

export default DraggableItem;