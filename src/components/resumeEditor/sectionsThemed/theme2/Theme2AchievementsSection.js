'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Plus, X, Trophy, Medal } from 'lucide-react';
import EditableField from '../../fieldsEditable/EditableField';
import EditableFieldTextarea from '../../fieldsEditable/EditableFieldTextarea';

export const Theme2AchievementsSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { achievements } = resumeData;
  
  const [achievementItems, setAchievementItems] = useState(
    Array.isArray(achievements) ? [...achievements] : []
  );
  
  useEffect(() => {
    if (onMenuAction) {
      onMenuAction({ addAchievement });
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(achievements)) {
      setAchievementItems([...achievements]);
    } else {
      setAchievementItems([]);
    }
  }, [achievements]);
  
  const handleFieldChange = (index, field, value) => {
    const newItems = [...achievementItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setAchievementItems(newItems);
    updateResumeField(`achievements[${index}].${field}`, value);
  };
  
  const addAchievement = () => {
    const newItems = [
      ...achievementItems,
      {
        title: "",
        date: "",
        description: ""
      }
    ];
    setAchievementItems(newItems);
    updateResumeField('achievements', newItems);
  };
  
  const removeAchievement = (index) => {
    const newItems = [...achievementItems];
    newItems.splice(index, 1);
    setAchievementItems(newItems);
    updateResumeField('achievements', newItems);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto my-3 relative">
      {/* Section Title with Icon */}
      <div className="flex items-center mb-1">
        <Trophy className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-semibold text-indigo-800 font-serif">Achievements</h2>
      </div>
      
      {/* Animated Divider with Multiple Dots */}
      <div className="relative mb-4">
        <hr className="border-indigo-300 border-dashed" />
        <div className="absolute -bottom-1 left-0 right-0 flex justify-between">
          <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
          <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
        </div>
      </div>
      
      {/* Achievement Items */}
      <div className="space-y-4">
        {achievementItems.map((achievement, index) => (
          <div key={index} 
               className="relative bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 
                         p-4 rounded-lg group transition-all duration-300 hover:shadow-lg 
                         hover:shadow-indigo-100 border border-transparent hover:border-indigo-200">
            {/* Delete Button */}
            <button 
              onClick={() => removeAchievement(index)}
              className="absolute right-2 top-2 text-indigo-400 hover:text-red-500 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Achievement Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center space-x-3">
                <Medal className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <EditableField 
                  index={index}
                  field="title"
                  placeholder="成就标题"
                  className="text-lg font-medium text-indigo-900"
                  value={achievementItems}
                  onChange={handleFieldChange}
                />
              </div>
              
              <EditableField 
                index={index}
                field="date"
                placeholder="获得日期"
                className="text-indigo-600 font-mono"
                value={achievementItems}
                onChange={handleFieldChange}
              />
            </div>
            
            {/* Achievement Description with Decorative Border */}
            <div className="relative pl-8 before:content-[''] before:absolute before:left-0 
                           before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b 
                           before:from-indigo-300 before:via-purple-300 before:to-indigo-300">
              <EditableFieldTextarea
                index={index}
                field="description"
                placeholder="成就描述"
                className="w-full min-h-[60px] text-indigo-800 leading-relaxed"
                value={achievementItems}
                onChange={handleFieldChange}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Button */}
      {!hideDefaultControls && (
        <button 
          onClick={addAchievement}
          className="flex items-center mx-auto mt-4 px-6 py-2 bg-gradient-to-r 
                   from-indigo-100 to-purple-100 text-indigo-700 rounded-full 
                   hover:from-indigo-200 hover:to-purple-200 transition-all 
                   duration-300 font-medium group"
        >
          <Plus className="w-5 h-5 mr-2 transform group-hover:rotate-180 transition-transform duration-300" />
          添加成就
        </button>
      )}
    </div>
  );
};

Theme2AchievementsSection.getMenuOptions = (component) => {
  if (!component) return [];
  
  const { addAchievement } = component;
  
  return [
    {
      icon: <Plus className="w-4 h-4" />,
      label: '添加成就',
      action: addAchievement
    }
  ];
};

export default Theme2AchievementsSection;