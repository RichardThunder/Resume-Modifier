'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Plus, X, Lightbulb, Star } from 'lucide-react';
import EditableField from '../../fieldsEditable/EditableField';

export const Theme2SkillsSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { skills } = resumeData;
  
  const [skillItems, setSkillItems] = useState(
    Array.isArray(skills) ? [...skills] : []
  );
  
  useEffect(() => {
    if (onMenuAction) {
      onMenuAction({ addSkill });
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(skills)) {
      setSkillItems([...skills]);
    } else {
      setSkillItems([]);
    }
  }, [skills]);
  
  const handleFieldChange = (index, field, value) => {
    const newItems = [...skillItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setSkillItems(newItems);
    updateResumeField(`skills[${index}].${field}`, value);
  };
  
  const addSkill = () => {
    const newItems = [
      ...skillItems,
      {
        category: "",
        skills: ""
      }
    ];
    setSkillItems(newItems);
    updateResumeField('skills', newItems);
  };
  
  const removeSkill = (index) => {
    const newItems = [...skillItems];
    newItems.splice(index, 1);
    setSkillItems(newItems);
    updateResumeField('skills', newItems);
  };

  // 生成随机的渐变背景色
  const getRandomGradient = (index) => {
    const gradients = [
      'from-indigo-50 to-purple-50',
      'from-purple-50 to-indigo-50',
      'from-indigo-50 to-blue-50',
      'from-blue-50 to-indigo-50'
    ];
    return gradients[index % gradients.length];
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto my-3 relative">
      {/* Section Title with Icon */}
      <div className="flex items-center mb-1">
        <Lightbulb className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-semibold text-indigo-800 font-serif">Skills</h2>
      </div>
      
      {/* Animated Divider */}
      <div className="relative mb-4">
        <hr className="border-indigo-300 border-dashed" />
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
      </div>
      
      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillItems.map((skill, index) => (
          <div key={index} 
               className={`relative bg-gradient-to-br ${getRandomGradient(index)} p-4 rounded-lg
                         group transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100 
                         border border-transparent hover:border-indigo-200`}>
            {/* Delete Button */}
            <button 
              onClick={() => removeSkill(index)}
              className="absolute right-2 top-2 text-indigo-400 hover:text-red-500 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Skill Category */}
            <div className="flex items-center mb-3">
              <Star className="w-4 h-4 text-indigo-500 mr-2" />
              <EditableField 
                index={index}
                field="category"
                placeholder="技能类别"
                className="font-medium text-lg text-indigo-900"
                value={skillItems}
                onChange={handleFieldChange}
              />
            </div>
            
            {/* Skills List */}
            <div className="pl-6">
              <EditableField 
                index={index}
                field="skills"
                placeholder="技能列表"
                className="text-indigo-700 leading-relaxed"
                value={skillItems}
                onChange={handleFieldChange}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Button */}
      {!hideDefaultControls && (
        <button 
          onClick={addSkill}
          className="flex items-center mx-auto mt-4 px-6 py-2 bg-gradient-to-r 
                   from-indigo-100 to-purple-100 text-indigo-700 rounded-full 
                   hover:from-indigo-200 hover:to-purple-200 transition-all 
                   duration-300 font-medium group"
        >
          <Plus className="w-5 h-5 mr-2 transform group-hover:rotate-180 transition-transform duration-300" />
          添加技能类别
        </button>
      )}
    </div>
  );
};

Theme2SkillsSection.getMenuOptions = (component) => {
  if (!component) return [];
  
  const { addSkill } = component;
  
  return [
    {
      icon: <Plus className="w-4 h-4" />,
      label: '添加技能类别',
      action: addSkill
    }
  ];
};

export default Theme2SkillsSection;
