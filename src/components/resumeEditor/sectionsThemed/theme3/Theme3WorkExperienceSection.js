'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Plus, X, Briefcase } from 'lucide-react';
import EditableField from '../../fieldsEditable/EditableField';
import EditableFieldTextarea from '../../fieldsEditable/EditableFieldTextarea';

export const Theme3WorkExperienceSection = ({ hideDefaultControls = false, onMenuAction }) => {
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
        <Briefcase className="w-6 h-6 text-red-500 mr-2" />
        <h2 className="text-2xl font-semibold text-red-500 font-serif">Work Experience</h2>
      </div>
      
      {/* Animated Divider with Dark Red Glow */}
      <div className="relative mb-4">
        <hr className="border-red-800 border-dashed" />
        <div className="absolute -bottom-1 left-0 w-16 h-0.5 
                      bg-gradient-to-r from-red-900 via-red-500 to-red-900
                      shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
      </div>
      
      {/* Experience Items */}
      <div className="space-y-4">
        {experienceItems.map((exp, index) => (
          <div key={index} 
               className="relative bg-gradient-to-br from-gray-900 to-red-900 p-4 rounded-lg
                         group transition-all duration-300 hover:shadow-lg hover:shadow-red-900/50 
                         border border-red-800/30 hover:border-red-700">
            {/* Delete Button */}
            <button 
              onClick={() => removeExperience(index)}
              className="absolute right-2 top-2 text-red-700 hover:text-red-500 
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
                  className="block font-medium text-lg text-red-300"
                  value={experienceItems}
                  onChange={handleFieldChange}
                />
                <EditableField 
                  index={index}
                  field="position"
                  placeholder="职位"
                  className="block text-red-400"
                  value={experienceItems}
                  onChange={handleFieldChange}
                />
              </div>
              
              {/* Date and Location */}
              <div className="text-right space-y-1">
                <div className="flex items-center justify-end space-x-2 text-red-400">
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
                  className="text-red-600 italic"
                  value={experienceItems}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            
            {/* Description with Glowing Border */}
            <div className="relative pl-4 mt-2 before:content-[''] before:absolute before:left-0 
                           before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b 
                           before:from-red-900 before:via-red-500 before:to-red-900
                           before:shadow-[0_0_5px_rgba(220,38,38,0.3)]">
              <EditableFieldTextarea
                index={index}
                field="description"
                placeholder="工作描述"
                className="w-full min-h-[100px] text-red-200 leading-relaxed bg-transparent"
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
          className="flex items-center mx-auto mt-4 px-6 py-2 bg-gradient-to-r 
                   from-red-900 to-gray-900 text-red-400 rounded-full 
                   hover:from-red-800 hover:to-gray-800 transition-all duration-300 
                   font-medium group border border-red-800/30 hover:border-red-700
                   hover:shadow-lg hover:shadow-red-900/30"
        >
          <Plus className="w-5 h-5 mr-2 transform group-hover:rotate-180 transition-transform duration-300" />
          添加工作经历
        </button>
      )}
    </div>
  );
};

Theme3WorkExperienceSection.getMenuOptions = (component) => {
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

export default Theme3WorkExperienceSection;
