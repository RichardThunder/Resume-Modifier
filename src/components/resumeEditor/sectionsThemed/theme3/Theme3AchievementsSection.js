'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Plus, X, Trophy, Medal } from 'lucide-react';
import EditableField from '../../fieldsEditable/EditableField';
import EditableFieldTextarea from '../../fieldsEditable/EditableFieldTextarea';

export const Theme3AchievementsSection = ({ hideDefaultControls = false, onMenuAction }) => {
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
        <Trophy className="w-6 h-6 text-red-500 mr-2" />
        <h2 className="text-2xl font-playfair font-semibold text-red-500 italic">Achievements</h2>
      </div>
      
      {/* Animated Divider with Multiple Glowing Dots */}
      <div className="relative mb-4">
        <hr className="border-red-800 border-dashed" />
        <div className="absolute -bottom-1 left-0 right-0 flex justify-between">
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.6)]"></div>
          <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)]"></div>
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.6)]"></div>
        </div>
      </div>
      
      {/* Achievement Items */}
      <div className="space-y-4">
        {achievementItems.map((achievement, index) => (
          <div key={index} 
               className="relative bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 
                         p-4 rounded-lg group transition-all duration-300 
                         hover:shadow-lg hover:shadow-red-900/50 
                         border border-red-800/30 hover:border-red-700
                         shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            {/* Delete Button */}
            <button 
              onClick={() => removeAchievement(index)}
              className="absolute right-2 top-2 text-red-700 hover:text-red-500 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Achievement Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center space-x-3">
                <Medal className="w-5 h-5 text-red-500 flex-shrink-0" />
                <EditableField 
                  index={index}
                  field="title"
                  placeholder="成就标题"
                  className="text-lg font-medium text-red-300 font-playfair italic"
                  value={achievementItems}
                  onChange={handleFieldChange}
                />
              </div>
              
              <EditableField 
                index={index}
                field="date"
                placeholder="获得日期"
                className="text-red-400 font-mono"
                value={achievementItems}
                onChange={handleFieldChange}
              />
            </div>
            
            {/* Achievement Description with Glowing Border */}
            <div className="relative pl-8 before:content-[''] before:absolute before:left-0 
                           before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b 
                           before:from-red-900 before:via-red-500 before:to-red-900
                           before:shadow-[0_0_5px_rgba(220,38,38,0.3)]">
              <EditableFieldTextarea
                index={index}
                field="description"
                placeholder="成就描述"
                className="w-full min-h-[60px] text-red-200 leading-relaxed bg-transparent font-playfair italic"
                value={achievementItems}
                onChange={handleFieldChange}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Button with Hover Effects */}
      {!hideDefaultControls && (
        <button 
          onClick={addAchievement}
          className="flex items-center mx-auto mt-4 px-6 py-2 
                   bg-gradient-to-r from-red-900 to-gray-900 
                   text-red-400 rounded-full group
                   hover:from-red-800 hover:to-gray-800 
                   transition-all duration-300 font-medium 
                   border border-red-800/30 hover:border-red-700
                   hover:shadow-lg hover:shadow-red-900/30"
        >
          <Plus className="w-5 h-5 mr-2 transform group-hover:rotate-180 transition-transform duration-300" />
          添加成就
        </button>
      )}
    </div>
  );
};

Theme3AchievementsSection.getMenuOptions = (component) => {
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

export default Theme3AchievementsSection;
