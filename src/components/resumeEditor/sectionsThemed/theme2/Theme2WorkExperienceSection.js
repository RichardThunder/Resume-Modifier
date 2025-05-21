'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Plus, X, Briefcase } from 'lucide-react';
import EditableField from '../../fieldsEditable/EditableField';
import EditableFieldTextarea from '../../fieldsEditable/EditableFieldTextarea';

export const Theme2WorkExperienceSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { workExperience } = resumeData;
  
  const [experienceItems, setExperienceItems] = useState(
    Array.isArray(workExperience) ? [...workExperience] : []
  );
  
  useEffect(() => {
    if (onMenuAction) {
      onMenuAction({ addExperience });
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(workExperience)) {
      setExperienceItems([...workExperience]);
    } else {
      setExperienceItems([]);
    }
  }, [workExperience]);
  
  const handleFieldChange = (index, field, value) => {
    const newItems = [...experienceItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setExperienceItems(newItems);
    updateResumeField(`workExperience[${index}].${field}`, value);
  };
  
  const addExperience = () => {
    const newItems = [
      ...experienceItems,
      {
        companyName: "",
        position: "",
        location: "",
        fromDate: "",
        toDate: "",
        description: ""
      }
    ];
    setExperienceItems(newItems);
    updateResumeField('workExperience', newItems);
  };
  
  const removeExperience = (index) => {
    const newItems = [...experienceItems];
    newItems.splice(index, 1);
    setExperienceItems(newItems);
    updateResumeField('workExperience', newItems);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto my-3 relative">
      {/* Section Title with Icon */}
      <div className="flex items-center mb-1">
        <Briefcase className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-semibold text-indigo-800 font-serif">Work Experience</h2>
      </div>
      
      {/* Fancy Divider */}
      <div className="relative mb-4">
        <hr className="border-indigo-300 border-dashed" />
        <div className="absolute -bottom-1 left-0 w-16 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
      </div>
      
      {/* Experience Items */}
      <div className="space-y-4">
        {experienceItems.map((exp, index) => (
          <div key={index} 
               className="relative bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg group 
                         transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100 
                         border border-transparent hover:border-indigo-200">
            {/* Delete Button */}
            <button 
              onClick={() => removeExperience(index)}
              className="absolute right-2 top-2 text-indigo-400 hover:text-red-500 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Company and Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start mb-2">
              <div className="space-y-1">
                <EditableField 
                  index={index}
                  field="companyName"
                  placeholder="公司名称"
                  className="block font-medium text-lg text-indigo-900"
                  value={experienceItems}
                  onChange={handleFieldChange}
                />
                <EditableField 
                  index={index}
                  field="position"
                  placeholder="职位"
                  className="block text-indigo-700"
                  value={experienceItems}
                  onChange={handleFieldChange}
                />
              </div>
              
              {/* Date and Location */}
              <div className="text-right space-y-1">
                <div className="flex items-center justify-end space-x-2 text-indigo-600">
                  <EditableField 
                    index={index}
                    field="fromDate"
                    placeholder="起始日期"
                    className="w-24 text-right font-mono"
                    value={experienceItems}
                    onChange={handleFieldChange}
                  />
                  <span>–</span>
                  <EditableField 
                    index={index}
                    field="toDate"
                    placeholder="结束日期"
                    className="w-24 text-right font-mono"
                    value={experienceItems}
                    onChange={handleFieldChange}
                  />
                </div>
                <EditableField 
                  index={index}
                  field="location"
                  placeholder="地点"
                  className="text-indigo-500 italic"
                  value={experienceItems}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            
            {/* Description */}
            <div className="mt-2 pl-4 border-l-2 border-indigo-200">
              <EditableFieldTextarea
                index={index}
                field="description"
                placeholder="工作描述"
                className="w-full min-h-[100px] text-indigo-800 leading-relaxed"
                value={experienceItems}
                onChange={handleFieldChange}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Button */}
      {!hideDefaultControls && (
        <button 
          onClick={addExperience}
          className="flex items-center mt-4 px-6 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 
                   text-indigo-700 rounded-full hover:from-indigo-200 hover:to-purple-200 
                   transition-all duration-300 font-medium group"
        >
          <Plus className="w-5 h-5 mr-2 transform group-hover:rotate-180 transition-transform duration-300" />
          添加工作经历
        </button>
      )}
    </div>
  );
};

Theme2WorkExperienceSection.getMenuOptions = (component) => {
  if (!component) return [];
  
  const { addExperience } = component;
  
  return [
    {
      icon: <Plus className="w-4 h-4" />,
      label: '添加工作经历',
      action: addExperience
    }
  ];
};

export default Theme2WorkExperienceSection;
