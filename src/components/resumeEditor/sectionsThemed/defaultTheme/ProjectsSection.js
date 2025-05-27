'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Plus, X, Wand2 } from 'lucide-react';
import feedbackService from '@/lib/services/feedbackService';
import EditableField from '../../fieldsEditable/EditableField';
import EditableFieldTextarea from '../../fieldsEditable/EditableFieldTextarea';
import * as Popover from '@radix-ui/react-popover';
import { useFloating, offset, shift, flip, arrow, autoUpdate, useHover, useFocus, useDismiss, useRole, useInteractions } from '@floating-ui/react-dom-interactions';


export const ProjectsSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { projects } = resumeData;
  
  // State for projects items
  const [projectItems, setProjectItems] = useState(Array.isArray(projects) ? [...projects] : []);
  // 控制菜单显示
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  
  // Provide context menu options for the parent component
  useEffect(() => {
    if (onMenuAction) {
      onMenuAction({ 
        addProject 
      });
    }
  }, []);
  useEffect(()=> {
    if (Array.isArray(projects)) {
      setProjectItems([...projects]);
    } else {
      setProjectItems([]);
    }
  }, [projects]);
  
  // Handle changes to fields
  const handleFieldChange = (index, field, value) => {
    const newItems = [...projectItems];
    
    
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    
    setProjectItems(newItems);
    
    // Update in context
    updateResumeField('projects', newItems);
  };
  
  // Add a new project entry
  const addProject = () => {
    const newItems = [
      ...projectItems,
      {
        title: "",
        description: "",
        fromDate: "",
        toDate: "",
        isPresent: false
      }
    ];
    setProjectItems(newItems);
    updateResumeField('projects', newItems);
  };
  
  // Remove a project entry
  const removeProject = (index) => {
    const newItems = [...projectItems];
    newItems.splice(index, 1);
    setProjectItems(newItems);
    updateResumeField('projects', newItems);
  };
  
  // AI优化项目描述
  const optimizeDescription = async (index) => {
    const section_type = 'projects';
    const sectionData = projectItems[index];
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
      <h2 className="text-2xl font-bold mb-0.5">Projects</h2>
      {/* Divider Line */}
      <hr className="border-gray-300 mb-1" />
      {/* Project Items */}
      <div className="space-y-1">
        {projectItems.map((project, index) => (
          <div key={index} className="relative bg-white hover:bg-gray-50 p-1 rounded-md group">
            <button 
              onClick={() => removeProject(index)} 
              className="absolute right-2 top-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
            {/* Project Title and Date Row - 3 columns layout */}
            <div className="grid grid-cols-3 gap-1 items-center mb-0.5">
              {/* Project Name - Left */}
              <div className="text-left">
                <EditableField 
                  index={index} 
                  field="title" 
                  placeholder="Project Name" 
                  className="inline-block font-medium"
                  value={projectItems}
                  onChange={handleFieldChange}
                />
              </div>
              {/* Empty center column for layout */}
              <div className="text-center">
                {/* Add other fields if needed, e.g. tech stack */}
              </div>
              {/* Date - Right */}
              <div className="text-right flex items-center justify-end space-x-1">
                <EditableField 
                  index={index} 
                  field="fromDate" 
                  placeholder="Start Date" 
                  className="inline-block text-center"
                  value={projectItems}
                  onChange={handleFieldChange}
                />
                <span>–</span>
                <EditableField 
                  index={index} 
                  field="toDate" 
                  placeholder="End Date" 
                  className="inline-block text-center"
                  value={projectItems}
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
                  placeholder="Project description (responsibilities, technologies, achievements, etc.)"
                  className="w-full min-h-[60px] whitespace-normal break-words overflow-wrap-anywhere"
                  value={projectItems}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            {/* Add Project Button */}
            <button 
              onClick={addProject}
              className="absolute right-2 bottom-2 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      {/* Add Project Button */}
      {!hideDefaultControls && projectItems.length === 0 && (
        <button 
          onClick={addProject}
          className="flex items-center mt-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </button>
      )}
    </div>
  );
};

// 附加菜单选项到组件，使其可以从组件外部访问
ProjectsSection.getMenuOptions = (component) => {
  if (!component) return [];
  
  const { addProject } = component;
  
  return [
    {
      icon: <Plus className="w-4 h-4" />,
      label: '添加项目经历',
      action: addProject
    }
  ];
};

export default ProjectsSection;
