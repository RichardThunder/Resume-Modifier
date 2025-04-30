'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { getThemeComponent } from '../sectionsThemed/ThemeManager';

export const SortableEducationBlock = ({ id, theme = 'theme2' }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get the theme-specific EducationSection component
  const ThemeEducationSection = getThemeComponent('EducationSection', theme);

  // Setup sortable functionality with dnd-kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  // Apply drag styles
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`relative bg-white rounded-md mb-4 hover:shadow-md transition-shadow duration-200 ${isDragging ? 'z-10' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle */}
      <div 
        className={`absolute left-0 top-8 -ml-6 transition-opacity duration-200 cursor-grab ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>
      
      {/* Block Content - Use the theme-specific component */}
      <ThemeEducationSection 
        hideDefaultControls={false}
      />
    </div>
  );
};

export default SortableEducationBlock;
