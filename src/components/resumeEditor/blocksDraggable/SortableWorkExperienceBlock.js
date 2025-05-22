'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Sparkles } from 'lucide-react';
import { getThemeComponent } from '../sectionsThemed/ThemeManager';
import * as Popover from '@radix-ui/react-popover';

export const SortableWorkExperienceBlock = ({ id, theme = 'theme2' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Get the theme-specific WorkExperienceSection component
  const ThemeWorkExperienceSection = getThemeComponent('WorkExperienceSection', theme);

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

  // 菜单选项
  const menuOptions = [
    {
      icon: <Sparkles className="w-4 h-4 text-yellow-500" />,
      label: 'AI 优化',
      action: () => {
        // 这里添加 AI 优化的逻辑
        console.log('AI 优化工作经验', id);
      }
    },
    {
      icon: <Edit className="w-4 h-4 text-blue-500" />,
      label: '编辑',
      action: () => {
        console.log('编辑工作经验', id);
      }
    }
  ];

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`relative bg-white rounded-md mb-4 hover:shadow-md transition-shadow duration-200 ${isDragging ? 'z-10' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 编辑按钮与下拉菜单 */}
      <Popover.Root open={showMenu} onOpenChange={setShowMenu}>
        <Popover.Trigger asChild>
          <button
            className={`absolute left-0 bottom-2 -ml-6 transition-opacity duration-200 z-20 bg-white border border-gray-200 rounded-full p-1 shadow-sm cursor-pointer ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(true);
            }}
            aria-label="编辑"
          >
            <Edit className="w-5 h-5 text-blue-500" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="bg-white rounded-lg shadow-lg p-2 w-48 flex flex-col gap-1 z-50"
            sideOffset={5}
          >
            <div className="mb-1 text-xs text-gray-500 font-medium px-2">操作选项</div>
            {menuOptions.map((option, index) => (
              <button
                key={index}
                className="flex items-center gap-2 px-2 py-1 rounded text-left hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  option.action();
                }}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* 拖拽手柄 */}
      <div 
        className={`absolute left-0 top-8 -ml-6 transition-opacity duration-200 cursor-grab ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>
      
      {/* Block Content */}
      <ThemeWorkExperienceSection 
        hideDefaultControls={false}
      />
    </div>
  );
};

export default SortableWorkExperienceBlock;
