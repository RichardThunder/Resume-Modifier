'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Plus, X, Wand2 } from 'lucide-react';
import feedbackService from '@/lib/services/feedbackService';
import EditableField from '../../fieldsEditable/EditableField';
import EditableFieldTextarea from '../../fieldsEditable/EditableFieldTextarea';
import * as Popover from '@radix-ui/react-popover';

export const AchievementsSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { achievements } = resumeData;
  // 控制菜单显示
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  // State for achievement items
  const [achievementItems, setAchievementItems] = useState([...achievements]);
  
  // Provide context menu options for the parent component
  useEffect(() => {
    if (onMenuAction) {
      onMenuAction({ 
        addAchievement 
      });
    }
  }, []);
  
  // Handle changes to fields
  const handleFieldChange = (index, field, value) => {
    const newItems = [...achievementItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    
    setAchievementItems(newItems);
    
    // Update in context
    updateResumeField('achievements', newItems);
  };
  
  // Add a new achievement entry
  const addAchievement = () => {
    const newItems = [
      ...achievementItems,
      {
        title: "",
        description: "",
        fromDate: "",
        toDate: ""
      }
    ];
    setAchievementItems(newItems);
    updateResumeField('achievements', newItems);
  };
  
  // Remove an achievement entry
  const removeAchievement = (index) => {
    const newItems = [...achievementItems];
    newItems.splice(index, 1);
    setAchievementItems(newItems);
    updateResumeField('achievements', newItems);
  };
  
  // AI优化成就描述
  const optimizeDescription = async (index) => {
    const section_type = 'achievements';
    const sectionData = achievementItems[index];
    const result = await feedbackService.sendFeedback(sectionData, section_type, '', resumeData, index);
    console.log('AI优化结果:', result);
    if (result.success && result.content) {
      handleFieldChange(index, 'description', result.content);
    } else {
      alert(result.error || 'AI优化失败');
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto my-1 relative">
      {/* Section Title */}
      <h2 className="text-2xl font-bold mb-0.5">Achievements</h2>
      
      {/* Divider Line */}
      <hr className="border-gray-300 mb-1" />
      
      {/* Achievement Items */}
      <div className="space-y-1">
        {achievementItems.map((achievement, index) => (
          <div key={index} className="relative bg-white hover:bg-gray-50 p-1 rounded-md group">
            <button 
              onClick={() => removeAchievement(index)} 
              className="absolute right-2 top-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Achievement Title and Date Row - 三列均分布局 */}
            <div className="grid grid-cols-3 gap-1 items-center mb-0.5">
              {/* 成就名称 - 左侧 */}
              <div className="text-left">
                <EditableField 
                  index={index} 
                  field="title" 
                  placeholder="Achievement Title" 
                  className="inline-block font-medium"
                  value={achievementItems}
                  onChange={handleFieldChange}
                />
              </div>
              
              {/* 空白中间列，保持布局 */}
              <div className="text-center">
                {/* 可以根据需要添加其他字段 */}
              </div>
              
              {/* 日期 - 右侧 */}
              <div className="text-right flex items-center justify-end space-x-1">
                <EditableField 
                  index={index} 
                  field="fromDate" 
                  placeholder="Start Date" 
                  className="inline-block w-20 text-center"
                  value={achievementItems}
                  onChange={handleFieldChange}
                />
                <span>–</span>
                <EditableField 
                  index={index} 
                  field="toDate" 
                  placeholder="End Date" 
                  className="inline-block w-20 text-center"
                  value={achievementItems}
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
                  placeholder="Achievement description (certificates, awards, honors, etc.)"
                  className="w-full"
                  value={achievementItems}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
          
            
            {/* Add Achievement Button */}
            <button 
              onClick={addAchievement} 
              className="absolute right-2 bottom-2 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Add Achievement Button */}
      {!hideDefaultControls && achievementItems.length === 0 && (
        <button 
          onClick={addAchievement}
          className="flex items-center mt-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Achievement
        </button>
      )}
    </div>
  );
};

// 附加菜单选项到组件，使其可以从组件外部访问
AchievementsSection.getMenuOptions = (component) => {
  if (!component) return [];
  
  const { addAchievement } = component;
  
  return [
    {
      icon: <Plus className="w-4 h-4" />,
      label: '添加成就经历',
      action: addAchievement
    }
  ];
};

export default AchievementsSection;
