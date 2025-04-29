'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Plus, X } from 'lucide-react';
import EditableField from './filedUsedBySection/EditableField';
import EditableFieldTextarea from './filedUsedBySection/EditableFieldTextarea';
export const WorkExperienceSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { workExperience } = resumeData;
  
  // State for work experience items
  const [workItems, setWorkItems] = useState(Array.isArray(workExperience) ? [...workExperience] : []);
  
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
                  placeholder="公司名称" 
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
                  placeholder="职位" 
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
                  placeholder="起始日期" 
                  className="inline-block w-20 text-center"
                  value={workItems}
                  onChange={handleFieldChange}
                />
                <span>–</span>
                <EditableField 
                  index={index} 
                  field="toDate" 
                  placeholder="结束日期" 
                  className="inline-block w-20 text-center"
                  value={workItems}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            
            {/* Description */}
            <div className="mt-0.5">
              <EditableFieldTextarea 
                index={index} 
                field="description" 
                placeholder="工作描述（成就、职责等）" 
                className="w-full"
                value={workItems}
                onChange={handleFieldChange}
              />
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
