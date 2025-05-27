'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Plus, X, Sparkles, Wand2 } from 'lucide-react';
import EditableField from '../../fieldsEditable/EditableField';
import EditableFieldTextarea from '../../fieldsEditable/EditableFieldTextarea';
import * as Popover from '@radix-ui/react-popover';
import { useFloating, offset, shift, flip, arrow, autoUpdate, useHover, useFocus, useDismiss, useRole, useInteractions } from '@floating-ui/react-dom-interactions';
import feedbackService from '@/lib/services/feedbackService';

export const WorkExperienceSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { workExperience } = resumeData;
  
  // State for work experience items
  const [workItems, setWorkItems] = useState(Array.isArray(workExperience) ? [...workExperience] : []);
  // 当前悬浮工具框显示的工作经历索引
  const [activeIndex, setActiveIndex] = useState(null);
  // 控制菜单显示
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  // 悬浮工具框的引用
  const arrowRef = useRef(null);
  
  // Provide context menu options for the parent component
  useEffect(() => {
    if (onMenuAction) {
      onMenuAction({ 
        addWorkExperience 
      });
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(workExperience)) {
      setWorkItems([...workExperience]);
    } else {
      setWorkItems([]);
    }
  }, [workExperience]);

  // Handle changes to fields
  const handleFieldChange = (index, field, value) => {
    const newItems = [...workItems];
    
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    
    setWorkItems(newItems);
    
    // Update in context
    updateResumeField('workExperience', newItems);
  };
  
  // Add a new work experience entry
  const addWorkExperience = () => {
    const newItems = [
      ...workItems,
      {
        companyName: "",
        jobTitle: "",
        city: "",
        country: "",
        fromDate: "",
        toDate: "",
        isPresent: false,
        description: ""
      }
    ];
    setWorkItems(newItems);
    updateResumeField('workExperience', newItems);
  };
  
  // Remove a work experience entry
  const removeWorkExperience = (index) => {
    const newItems = [...workItems];
    newItems.splice(index, 1);
    setWorkItems(newItems);
    updateResumeField('workExperience', newItems);
  };

  // AI优化工作描述
  const optimizeDescription = async (index) => {
    const section_type = 'workExperience';
    const sectionData = workItems[index];
    console.log('获取sectionData', sectionData, index);
    // 传递整个简历数据，index
    const result = await feedbackService.sendFeedback(sectionData, section_type, '', resumeData, index);
    console.log('AI优化结果:', result);
    if (result.success && result.content) {
      // 只更新当前条目的 description 字段
      handleFieldChange(index, 'description', result.content);
    } else {
      alert(result.error || 'AI优化失败');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-1 relative">
      {/* Section Title */}
      <h2 className="text-2xl font-bold mb-0.5">Work Experience</h2>
      
      {/* Divider Line */}
      <hr className="border-gray-300 mb-1" />
      
      {/* Work Experience Items */}
      <div className="space-y-1">
        {workItems.map((work, index) => (
          <div key={index} className="relative bg-white hover:bg-gray-50 p-1 rounded-md group">
            <button 
              onClick={() => removeWorkExperience(index)} 
              className="absolute right-2 top-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Company and Date Row - 三列均分布局 */}
            <div className="grid grid-cols-3 gap-1 items-center mb-0.5">
              {/* 公司名称 - 左侧 */}
              <div className="text-left">
                <EditableField 
                  index={index} 
                  field="companyName" 
                  placeholder="Company Name" 
                  className="inline-block font-medium"
                  value={workItems}
                  onChange={handleFieldChange}
                />
              </div>
              
              {/* 职位名称 - 居中 */}
              <div className="text-center">
                <EditableField 
                  index={index} 
                  field="jobTitle" 
                  placeholder="Job Title" 
                  className="inline-block text-center"
                  value={workItems}
                  onChange={handleFieldChange}
                />
              </div>
              
              {/* 日期 - 右侧 */}
              <div className="text-right flex items-center justify-end space-x-1">
                <EditableField 
                  index={index} 
                  field="fromDate" 
                  placeholder="Start Date" 
                  className="inline-block w-20 text-center"
                  value={workItems}
                  onChange={handleFieldChange}
                />
                <span>–</span>
                <EditableField 
                  index={index} 
                  field="toDate" 
                  placeholder="End Date" 
                  className="inline-block w-20 text-center"
                  value={workItems}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            
            {/* Description with Edit Button and Menu */}
            <div className="mt-0.5 relative group/desc">
              <div className="relative">
                {/* Edit Button */}
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/desc:opacity-100 transition-opacity">
                  <Popover.Root open={openPopoverIndex === index} onOpenChange={(open) => setOpenPopoverIndex(open ? index : null)}>
                    <Popover.Trigger asChild>
                      <button className="p-1 hover:bg-gray-100 rounded-md text-gray-500 hover:text-blue-500">
                        <Wand2 className="w-4 h-4" />
                      </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content className="bg-white rounded-lg shadow-lg p-2 z-50" sideOffset={5}>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => {
                              optimizeDescription(index);
                              setOpenPopoverIndex(null);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-blue-50 text-blue-600 whitespace-nowrap"
                          >
                            <Wand2 className="w-4 h-4" />
                            <span>AI Rewrite</span>
                          </button>
                        </div>
                        <Popover.Arrow className="fill-white" />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </div>

                <EditableFieldTextarea
                  index={index}
                  field="description"
                  placeholder="Work description (achievements, responsibilities, etc.)"
                  className="w-full"
                  value={workItems}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            
            {/* Add Experience Button */}
            <button 
              onClick={addWorkExperience} 
              className="absolute right-2 bottom-2 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Add Work Experience Button */}
      {!hideDefaultControls && workItems.length === 0 && (
        <button 
          onClick={addWorkExperience}
          className="flex items-center mt-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-2" /> 添加工作经历
        </button>
      )}
    </div>
  );
};

// 附加菜单选项到组件，使其可以从组件外部访问
WorkExperienceSection.getMenuOptions = (component) => {
  if (!component) return [];
  
  const { addWorkExperience } = component;
  
  return [
    {
      icon: <Plus className="w-4 h-4" />,
      label: '添加工作经历',
      action: addWorkExperience
    }
  ];
};

export default WorkExperienceSection;
