'use client';

import React from 'react';
import { ResumeProvider } from '../../../context/ResumeContext';
import ResumeBlockContainer from '../../../components/resumeEditor/ResumeBlockContainer';
import DataDisplay from '../../../components/DataDisplay';
import ResumeToolbar from '../../../components/resume/preview/ResumeToolbar';

export default function ResumeEditorDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-4 relative">
      <ResumeProvider>
        {/* 主要内容区域 */}
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8 text-center">Dragable Resume Editor</h1>
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">Tip: Hover your mouse over the sections to see the drag handles. Click and drag the handles to adjust the order of the sections.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 relative">
            {/* 使用flex布局将ResumeBlockContainer和ResumeToolbar并排显示 */}
            <div className="flex">
              {/* 左侧简历内容区域 - 添加resume-container类用于打印 */}
              <div className="flex-grow resume-container">
                <ResumeBlockContainer />
              </div>
              
              {/* 右侧工具栏 */}
              <ResumeToolbar />
             
            </div>
          </div>
          
          {/* 显示当前 resumeData JSON 内容 */}
          <div className="mt-8 bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Current Resume Data: </h3>
              <DataDisplay />
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>This demo shows the drag-and-drop sortable resume module with user information and education sections</p>
          </div>
        </div>
      </ResumeProvider>
    </div>
  );
}
