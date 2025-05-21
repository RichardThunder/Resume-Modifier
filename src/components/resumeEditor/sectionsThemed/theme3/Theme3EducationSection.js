'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Plus, X, GraduationCap } from 'lucide-react';
import EditableField from '../../fieldsEditable/EditableField';

export const Theme3EducationSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { education } = resumeData;
  
  const [educationItems, setEducationItems] = useState(
    Array.isArray(education) ? [...education] : []
  );
  
  useEffect(() => {
    if (onMenuAction) {
      onMenuAction({ addEducation });
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(education)) {
      setEducationItems([...education]);
    } else {
      setEducationItems([]);
    }
  }, [education]);
  
  const handleFieldChange = (index, field, value) => {
    const newItems = [...educationItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setEducationItems(newItems);
    updateResumeField(`education[${index}].${field}`, value);
  };
  
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
  
  const removeEducation = (index) => {
    const newItems = [...educationItems];
    newItems.splice(index, 1);
    setEducationItems(newItems);
    updateResumeField('education', newItems);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto my-3 relative">
      {/* Section Title with Icon */}
      <div className="flex items-center mb-1">
        <GraduationCap className="w-6 h-6 text-red-500 mr-2" />
        <h2 className="text-2xl font-playfair font-semibold text-red-500 italic">Education</h2>
      </div>
      
      {/* Animated Divider with Dark Red Glow */}
      <div className="relative mb-4">
        <hr className="border-red-800 border-dashed" />
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 
                      bg-gradient-to-r from-red-900 via-red-500 to-red-900
                      shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
      </div>
      
      {/* Education Items */}
      <div className="space-y-4">
        {educationItems.map((edu, index) => (
          <div key={index} 
               className="relative bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 
                         p-4 rounded-lg group transition-all duration-300 
                         hover:shadow-lg hover:shadow-red-900/50 
                         border border-red-800/30 hover:border-red-700
                         shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            {/* Delete Button */}
            <button 
              onClick={() => removeEducation(index)}
              className="absolute right-2 top-2 text-red-700 hover:text-red-500 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* University and Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start mb-2">
              {/* 学校名称 */}
              <div className="text-left md:col-span-2">
                <EditableField 
                  index={index} 
                  field="institutionName" 
                  placeholder="学校名称" 
                  className="inline-block font-medium text-lg text-red-300 font-playfair italic"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
                <div className="mt-1">
                  <EditableField 
                    index={index} 
                    field="city" 
                    placeholder="城市" 
                    className="inline-block text-red-600 italic font-playfair"
                    value={educationItems}
                    onChange={handleFieldChange}
                  />
                </div>
              </div>
              
              {/* 年份 */}
              <div className="text-right flex items-center space-x-1 justify-end text-red-400 font-mono">
                <EditableField 
                  index={index} 
                  field="fromDate" 
                  placeholder="起始年份" 
                  className="w-16 text-right"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
                <span>–</span>
                <EditableField 
                  index={index} 
                  field="toDate" 
                  placeholder="结束年份" 
                  className="w-16 text-right"
                  value={educationItems}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            
            {/* Degree and Field of Study */}
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableField 
                index={index} 
                field="fieldOfStudy" 
                placeholder="专业" 
                className="text-red-300 font-playfair italic"
                value={educationItems}
                onChange={handleFieldChange}
              />
              <EditableField 
                index={index} 
                field="degree" 
                placeholder="学位"
                className="text-red-300 font-playfair italic"
                value={educationItems}
                onChange={handleFieldChange}
              />
            </div>
            
            {/* Grade and Courses with Glowing Border */}
            <div className="mt-3 pl-4 relative before:content-[''] before:absolute before:left-0 
                           before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b 
                           before:from-red-900 before:via-red-500 before:to-red-900
                           before:shadow-[0_0_5px_rgba(220,38,38,0.3)]">
              <div className="space-y-2">
                <EditableField 
                  index={index} 
                  field="grade" 
                  placeholder="成绩"
                  value={educationItems}
                  onChange={handleFieldChange}
                  className="block text-red-400 font-playfair italic"
                />
                <EditableField 
                  index={index} 
                  field="courses" 
                  placeholder="主修课程"
                  value={educationItems}
                  onChange={handleFieldChange}
                  className="block text-red-200 font-playfair italic"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Button with Hover Effects */}
      {!hideDefaultControls && (
        <button 
          onClick={addEducation}
          className="flex items-center mx-auto mt-4 px-6 py-2 
                   bg-gradient-to-r from-red-900 to-gray-900 
                   text-red-400 rounded-full group
                   hover:from-red-800 hover:to-gray-800 
                   transition-all duration-300 font-medium 
                   border border-red-800/30 hover:border-red-700
                   hover:shadow-lg hover:shadow-red-900/30"
        >
          <Plus className="w-5 h-5 mr-2 transform group-hover:rotate-180 transition-transform duration-300" />
          添加教育经历
        </button>
      )}
    </div>
  );
};

Theme3EducationSection.getMenuOptions = (component) => {
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

export default Theme3EducationSection;
