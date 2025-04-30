'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Plus, X } from 'lucide-react';
import EditableField from '../../sectionsUsedByBlock/filedUsedBySection/EditableField';

export const Theme2EducationSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { education } = resumeData;
  
  // State for education items
  const [educationItems, setEducationItems] = useState(Array.isArray(education) ? [...education] : []);
  
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
    } else {
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
  
  return (
    <div className="w-full max-w-4xl mx-auto my-3 relative">
      {/* Section Title - Theme2 uses left-aligned styling */}
      <h2 className="text-2xl font-semibold mb-1 text-indigo-800 font-serif">Education</h2>
      
      {/* Divider Line - Theme2 uses dashed border */}
      <hr className="border-indigo-300 border-dashed mb-2" />
      
      {/* Education Items */}
      <div className="space-y-2">
        {educationItems.map((edu, index) => (
          <div key={index} className="relative bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg group transition-colors duration-200 shadow-sm">
            <button 
              onClick={() => removeEducation(index)} 
              className="absolute right-2 top-2 text-indigo-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* University and Date Row - Theme2 uses different grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start mb-1">
              {/* 学校名称 - Theme2 uses left-aligned styling */}
              <div className="text-left">
                <EditableField 
                  index={index} 
                  field="institutionName" 
                  placeholder="学校名称" 
                  className="inline-block font-medium text-indigo-900"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
              </div>
              
              {/* 专业 - Theme2 uses left-aligned styling */}
              <div className="text-left">
                <EditableField 
                  index={index} 
                  field="fieldOfStudy" 
                  placeholder="专业" 
                  className="inline-block text-left font-light text-indigo-800"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
              </div>
              
              {/* 年份 - Theme2 uses left-aligned styling */}
              <div className="text-left flex items-center space-x-1">
                <EditableField 
                  index={index} 
                  field="fromDate" 
                  placeholder="起始年份" 
                  className="inline-block w-16 text-left font-mono text-indigo-700"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
                <span className="text-indigo-500">–</span>
                <EditableField 
                  index={index} 
                  field="toDate" 
                  placeholder="结束年份" 
                  className="inline-block w-16 text-left font-mono text-indigo-700"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            
            {/* Bullet Points with Theme2 styling */}
            <ul className="list-square pl-5 space-y-1 text-indigo-700">
              {/* grade if available */}
              <li className="p-0 m-0">
                <EditableField 
                  index={index} 
                  field="grade" 
                  placeholder="grade"
                  value={educationItems}
                  onChange={handleFieldChange}
                  className="font-light"
                />
              </li>
              
              {/* Degree if available */}
              <li className="p-0 m-0">
                <EditableField 
                  index={index} 
                  field="degree" 
                  placeholder="学位"
                  value={educationItems}
                  onChange={handleFieldChange}
                  className="font-light"
                />
              </li>
              
              {/* Courses if available */}
              <li className="p-0 m-0">
                <EditableField 
                  index={index} 
                  field="courses" 
                  placeholder="课程"
                  value={educationItems}
                  onChange={handleFieldChange}
                  className="w-full font-light"
                />
              </li>
            </ul>
            
            {/* Add Education Button - Theme2 styling */}
            <button 
              onClick={addEducation} 
              className="absolute right-2 bottom-2 text-indigo-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Add Education Button - Theme2 styling */}
      {!hideDefaultControls && educationItems.length === 0 && (
        <button 
          onClick={addEducation}
          className="flex items-center mt-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors duration-200 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          添加教育经历
        </button>
      )}
    </div>
  );
};

// 附加菜单选项到组件，使其可以从组件外部访问
Theme2EducationSection.getMenuOptions = (component) => {
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

export default Theme2EducationSection;
