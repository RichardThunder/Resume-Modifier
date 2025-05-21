'use client';

import React, { useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Plus, X, Code2, ExternalLink } from 'lucide-react';
import EditableField from '../../fieldsEditable/EditableField';
import EditableFieldTextarea from '../../fieldsEditable/EditableFieldTextarea';

export const Theme2ProjectsSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { projects } = resumeData;
  
  const [projectItems, setProjectItems] = useState(
    Array.isArray(projects) ? [...projects] : []
  );
  
  useEffect(() => {
    if (onMenuAction) {
      onMenuAction({ addProject });
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(projects)) {
      setProjectItems([...projects]);
    } else {
      setProjectItems([]);
    }
  }, [projects]);
  
  const handleFieldChange = (index, field, value) => {
    const newItems = [...projectItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setProjectItems(newItems);
    updateResumeField(`projects[${index}].${field}`, value);
  };
  
  const addProject = () => {
    const newItems = [
      ...projectItems,
      {
        projectName: "",
        role: "",
        fromDate: "",
        toDate: "",
        description: "",
        link: ""
      }
    ];
    setProjectItems(newItems);
    updateResumeField('projects', newItems);
  };
  
  const removeProject = (index) => {
    const newItems = [...projectItems];
    newItems.splice(index, 1);
    setProjectItems(newItems);
    updateResumeField('projects', newItems);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto my-3 relative">
      {/* Section Title with Icon */}
      <div className="flex items-center mb-1">
        <Code2 className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-semibold text-indigo-800 font-serif">Projects</h2>
      </div>
      
      {/* Animated Divider */}
      <div className="relative mb-4">
        <hr className="border-indigo-300 border-dashed" />
        <div className="absolute -bottom-1 right-0 w-16 h-0.5 bg-gradient-to-l from-indigo-500 to-purple-500"></div>
      </div>
      
      {/* Project Items */}
      <div className="space-y-4">
        {projectItems.map((project, index) => (
          <div key={index} 
               className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50 
                         p-4 rounded-lg group transition-all duration-300 hover:shadow-lg 
                         hover:shadow-indigo-100 border border-transparent hover:border-indigo-200">
            {/* Delete Button */}
            <button 
              onClick={() => removeProject(index)}
              className="absolute right-2 top-2 text-indigo-400 hover:text-red-500 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Project Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              {/* Project Name and Role */}
              <div className="space-y-2 flex-grow">
                <div className="flex items-center space-x-2">
                  <EditableField 
                    index={index}
                    field="projectName"
                    placeholder="项目名称"
                    className="text-lg font-medium text-indigo-900"
                    value={projectItems}
                    onChange={handleFieldChange}
                  />
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" 
                       className="text-indigo-500 hover:text-indigo-700 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <EditableField 
                  index={index}
                  field="role"
                  placeholder="角色"
                  className="text-indigo-700"
                  value={projectItems}
                  onChange={handleFieldChange}
                />
              </div>
              
              {/* Project Duration */}
              <div className="flex items-center space-x-2 text-indigo-600 font-mono">
                <EditableField 
                  index={index}
                  field="fromDate"
                  placeholder="起始日期"
                  className="w-24 text-right"
                  value={projectItems}
                  onChange={handleFieldChange}
                />
                <span>–</span>
                <EditableField 
                  index={index}
                  field="toDate"
                  placeholder="结束日期"
                  className="w-24"
                  value={projectItems}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            
            {/* Project Link */}
            <div className="mb-2">
              <EditableField 
                index={index}
                field="link"
                placeholder="项目链接"
                className="text-indigo-500 italic"
                value={projectItems}
                onChange={handleFieldChange}
              />
            </div>
            
            {/* Project Description */}
            <div className="relative pl-4 before:content-[''] before:absolute before:left-0 
                           before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b 
                           before:from-indigo-300 before:to-purple-300">
              <EditableFieldTextarea
                index={index}
                field="description"
                placeholder="项目描述"
                className="w-full min-h-[100px] text-indigo-800 leading-relaxed"
                value={projectItems}
                onChange={handleFieldChange}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Button */}
      {!hideDefaultControls && (
        <button 
          onClick={addProject}
          className="flex items-center mt-4 px-6 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 
                   text-indigo-700 rounded-full hover:from-indigo-200 hover:to-purple-200 
                   transition-all duration-300 font-medium group"
        >
          <Plus className="w-5 h-5 mr-2 transform group-hover:rotate-180 transition-transform duration-300" />
          添加项目经历
        </button>
      )}
    </div>
  );
};

Theme2ProjectsSection.getMenuOptions = (component) => {
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

export default Theme2ProjectsSection;
