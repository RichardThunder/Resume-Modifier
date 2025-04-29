'use client';

import React, { useState } from 'react';
import { ResumeProvider } from '../../../context/ResumeContext';
import ResumeBlockContainer from '../../../components/resumeEditor/ResumeBlockContainer';
import DataDisplay from '../../../components/DataDisplay';
import ResumeToolbar from '../../../components/resumeEditor/ResumeToolbar';
import { AVAILABLE_THEMES } from '../../../components/resumeEditor/themes/ThemeManager';

export default function ResumeEditorDemo() {
  const [currentTheme, setCurrentTheme] = useState('default');

  return (
    <div className="min-h-screen bg-gray-50 py-4 relative">
      <ResumeProvider>
        {/* 主要内容区域 */}
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8 text-center">Dragable Resume Editor</h1>
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">Tip: Hover your mouse over the sections to see the drag handles. Click and drag the handles to adjust the order of the sections.</p>
          </div>
          {/* 主题选择器 */}
          <div className="mb-6 flex justify-center">
            <div className="bg-white shadow-sm rounded-lg p-3 inline-flex items-center">
              <span className="mr-3 text-gray-700 font-medium">Theme Select:</span>
              <div className="flex space-x-2">
                {AVAILABLE_THEMES.map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setCurrentTheme(theme)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      currentTheme === theme
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {theme === 'default' ? 'Default' : `Theme ${theme.replace('theme', '')}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-6 relative">
            
            <div className="flex">
              {/* 左侧简历内容区域 - 添加resume-container类用于打印 */}
              <div className="flex-grow resume-container">
                <ResumeBlockContainer theme={currentTheme} />
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
            <p>current you are using theme：{currentTheme === 'default' ? 'DEFAULT' : `THEME ${currentTheme.replace('theme', '')}`}</p>
          </div>
        </div>
      </ResumeProvider>
    </div>
  );
}
