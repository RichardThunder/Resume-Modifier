'use client';

import React from 'react';
import { useResume } from '@/context/ResumeContext';

export const BlockManagementModal = ({ isOpen, onClose }) => {
  const { resumeData, updateResumeField, setResumeData} = useResume();

  // Define available blocks
  const blocks = [
    { id: 'userInfo', label: '个人信息', field: 'userInfo' },
    { id: 'education', label: '教育经历', field: 'education' },
    { id: 'workExperience', label: '工作经历', field: 'workExperience' },
    { id: 'skills', label: '技能', field: 'skills' },
    { id: 'projects', label: '项目经历', field: 'projects' },
    { id: 'achievements', label: '成就', field: 'achievements' },
  ];

  // Check if a block is empty
  const isBlockEmpty = (field) => {
    const data = resumeData[field];
    if (Array.isArray(data)) {
      return data.length === 0;
    }
    return !data || Object.keys(data).length === 0;
  };

  // Handle adding an empty block
  const handleAddBlock = (field) => {
    const emptyBlocks = {
      userInfo: {
        firstName: "", lastName: "", headLine: "", phoneNumber: "",
        email: "", location: "", linkedInURL: "", websiteOrOtherProfileURL: "", githubURL: ""
      },
      education: [{
        institutionName: "", city: "", fieldOfStudy: "", degree: "",
        fromDate: "", toDate: "", grade: "", courses: ""
      }],
      workExperience: [{
        companyName: "", jobTitle: "", city: "", country: "",
        fromDate: "", toDate: "", isPresent: false, description: ""
      }],
      skills: [""],
      projects: [{
        title: "", description: "", fromDate: "", toDate: "", isPresent: false
      }],
      achievements: [{
        title: "", description: "", fromDate: "", toDate: "", isPresent: false
      }]
    };

    updateResumeField(field, emptyBlocks[field]);
  };

  // Handle removing a block
  const handleRemoveBlock = (field) => {
    // Create a new object without the specified field
    const { [field]: removed, ...restData } = resumeData;
    // Update the entire resume data and trigger localStorage save
    setResumeData(restData);
    // Save to localStorage
    try {
      localStorage.setItem('resumeData', JSON.stringify(restData));
    } catch (error) {
      console.error('保存简历数据时出错:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">管理简历模块</h2>
        <div className="space-y-4">
          {blocks.map(({ id, label, field }) => (
            <div key={id} className="flex items-center justify-between p-3 border rounded">
              <span className="font-medium">{label}</span>
              <div className="space-x-2">
                {isBlockEmpty(field) ? (
                  <button
                    onClick={() => handleAddBlock(field)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    添加
                  </button>
                ) : (
                  <button
                    onClick={() => handleRemoveBlock(field)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    删除
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
