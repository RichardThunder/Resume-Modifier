'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Plus, X, Wand2, Delete } from 'lucide-react';
import feedbackService from '@/lib/services/feedbackService';
import EditableField from '../../fieldsEditable/EditableField';
import EditableFieldTextarea from '../../fieldsEditable/EditableFieldTextarea';
import * as Popover from '@radix-ui/react-popover';

export const EducationSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { education } = resumeData;
  
  // State for education items
  const [educationItems, setEducationItems] = useState(Array.isArray(education) ? [...education] : []);
  
  // 控制菜单显示
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
   
  // Provide context menu options for the parent component
  useEffect(() => {
    if (onMenuAction) {
      onMenuAction({ 
        addEducation 
      });
    }
  }, []);
  useEffect(() => {
    if (Array.isArray(education)) {
      setEducationItems([...education]);
    }else {
      setEducationItems([]);
    }
  }, [education]);
  
  // Handle changes to fields
  const handleFieldChange = (index, field, value) => {
    const newItems = [...educationItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setEducationItems(newItems);
    
    // Update in context
    updateResumeField(`education[${index}].${field}`, value);
  };
  
  // Add a new education entry
  const addEducation = () => {
    const newItems = [
      ...educationItems,
      {
        institutionName: "",
        city: "",
        fieldOfStudy: "",
        degree: "",
        fromDate: "",
        toDate: "",
        grade: "",
        courses: ""
      }
    ];
    setEducationItems(newItems);
    updateResumeField('education', newItems);
  };
  
  // Remove an education entry
  const removeEducation = (index) => {
    const newItems = [...educationItems];
    newItems.splice(index, 1);
    setEducationItems(newItems);
    updateResumeField('education', newItems);
  };
  
  // AI优化教育描述
  const optimizeDescription = async (index) => {
    const section_type = 'education';
    const sectionData = educationItems[index];
    const result = await feedbackService.sendFeedback(sectionData, section_type, '', resumeData, index);
    console.log('AI优化结果:', result);
    if (result.success && result.content) {
      handleFieldChange(index, 'description', result.content); // 假设优化内容写入courses字段，可根据实际字段调整
    } else {
      alert(result.error || 'AI优化失败');
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto my-1 relative">
      {/* Section Title */}
      <h2 className="text-2xl font-bold mb-0.5">Education</h2>
      {/* Divider Line */}
      <hr className="border-gray-300 mb-1" />
      {/* Education Items */}
      <div className="space-y-1">
        {educationItems.map((edu, index) => (
          <div key={index} className="relative bg-white hover:bg-gray-50 p-1 rounded-md group">
            <button 
              onClick={() => removeEducation(index)} 
              className="absolute right-2 top-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* University and Date Row */}
            <div className="grid grid-cols-3 gap-1 items-center mb-0.5">
              {/* School Name - Left */}
              <div className="text-left">
                <EditableField 
                  index={index} 
                  field="institutionName" 
                  placeholder="School Name" 
                  className="inline-block"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
              </div>
              {/* Major - Center */}
              <div className="text-center">
                <EditableField 
                  index={index} 
                  field="fieldOfStudy" 
                  placeholder="Major" 
                  className="inline-block text-center"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
              </div>
              {/* Year - Right */}
              <div className="text-right flex items-center justify-end space-x-1">
                <EditableField 
                  index={index} 
                  field="fromDate" 
                  placeholder="Start Year" 
                  className="inline-block w-16 text-center"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
                <span>–</span>
                <EditableField 
                  index={index} 
                  field="toDate" 
                  placeholder="End Year" 
                  className="inline-block w-16 text-center"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            {/* Bullet Points */}
            <ul className="list-disc pl-5 space-y-0">
              {/* grade if available */}
              <li className="p-0 m-0">
                  <EditableField 
                    index={index} 
                    field="grade" 
                    placeholder="Grade"
                    value={educationItems}
                    onChange={handleFieldChange}
                  />
              </li>
              {/* Degree if available */}
              <li className="p-0 m-0">
                <EditableField 
                  index={index} 
                  field="degree" 
                  placeholder="Degree"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
              </li>
              {/* Courses if available */}
              <li className="p-0 m-0">
                  <EditableField 
                    index={index} 
                    field="courses" 
                    placeholder="Courses"
                    value={educationItems}
                    onChange={handleFieldChange}
                    className="w-full"
                  />
              </li>
            </ul>
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
                  placeholder="Education description (courses, GPA, projects etc.)"
                  className="w-full"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
              </div>
            </div>

            {/* Add Education Button */}
            <button 
              onClick={addEducation} 
              className="absolute right-2 bottom-2 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      {/* Add Education Button */}
      {!hideDefaultControls && educationItems.length === 0 && (
        <button 
          onClick={addEducation}
          className="flex items-center mt-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Education
        </button>
      )}
    </div>
  );
};

// 附加菜单选项到组件，使其可以从组件外部访问
EducationSection.getMenuOptions = (component) => {
  if (!component) return [];
  
  const { addEducation } = component;
  
  return [
    {
      icon: <Plus className="w-4 h-4" />,
      label: '添加教育经历',
      action: addEducation
    }
  ];
};

export default EducationSection;