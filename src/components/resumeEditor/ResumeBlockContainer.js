'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';

import SortableUserInfoBlock from './SortableUserInfoBlock';
import SortableEducationBlock from './SortableEducationBlock';
import SortableWorkExperienceBlock from './SortableWorkExperienceBlock';
import SortableProjectsBlock from './SortableProjectsBlock';
import SortableAchievementsBlock from './SortableAchievementsBlock';
import SortableSkillsBlock from './SortableSkillsBlock';
import { useResume } from '../../context/ResumeContext';

/**
 * ResumeBlockContainer - 可拖拽简历块的容器组件
 * 
 * 该组件负责:
 * 1. 提供简历各部分的拖拽功能
 * 2. 管理简历块的排序顺序
 */
export const ResumeBlockContainer = () => {
  // 定义初始的简历块ID和类型
  const initialBlocks = [
    { id: 'user-info-block', type: 'user-info' },
    { id: 'education-block', type: 'education' },
    { id: 'work-experience-block', type: 'work-experience' },
    { id: 'skills-block', type: 'skills' },
    { id: 'projects-block', type: 'projects' },
    { id: 'achievements-block', type: 'achievements' }
  ];
  
  // 管理块的顺序
  const [blocks, setBlocks] = useState(initialBlocks);
  
  // 设置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 需要移动5px才激活拖动
      },
    }),
    useSensor(KeyboardSensor)
  );
  
  // 处理拖拽结束事件
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    setBlocks(currentBlocks => {
      const oldIndex = currentBlocks.findIndex(block => block.id === active.id);
      const newIndex = currentBlocks.findIndex(block => block.id === over.id);
      
      // 获取新的块顺序
      const newBlocks = arrayMove(currentBlocks, oldIndex, newIndex);
      
      // 更新 ResumeContext 中数据的顺序
      updateResumeDataOrder(newBlocks);
      
      return newBlocks;
    });
  };
  
  // 更新 ResumeContext 中数据的顺序
  const updateResumeDataOrder = (newBlocks) => {
    const { resumeData, setResumeData, saveToLocalStorage } = useResume();
    
    // 创建按新顺序排列的数据对象
    const reorderedData = {};
    
    // 遍历新的块顺序，按顺序构建新的数据对象
    newBlocks.forEach(block => {
      const dataKey = block.type === 'user-info' ? 'userInfo' :
                     block.type === 'work-experience' ? 'workExperience' : block.type;
      
      // 将原数据复制到新对象中，保持相同的顺序
      if (resumeData[dataKey]) {
        reorderedData[dataKey] = resumeData[dataKey];
      }
    });
    
    // 更新 ResumeContext 数据
    setResumeData(reorderedData);
    
    // 保存到本地存储
    setTimeout(() => saveToLocalStorage(), 0);
  };
  
  // 渲染特定类型的块
  const renderBlock = (block) => {
    switch (block.type) {
      case 'user-info':
        return <SortableUserInfoBlock key={block.id} id={block.id} />;
      case 'education':
        return <SortableEducationBlock key={block.id} id={block.id} />;
      case 'work-experience':
        return <SortableWorkExperienceBlock key={block.id} id={block.id} />;
      case 'skills':
        return <SortableSkillsBlock key={block.id} id={block.id} />;
      case 'projects':
        return <SortableProjectsBlock key={block.id} id={block.id} />;
      case 'achievements':
        return <SortableAchievementsBlock key={block.id} id={block.id} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="resume-block-container max-w-4xl mx-auto pl-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map(block => block.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map(block => renderBlock(block))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ResumeBlockContainer;
