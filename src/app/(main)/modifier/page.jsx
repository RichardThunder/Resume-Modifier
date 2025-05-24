'use client';

import React, { useEffect, useState } from 'react';
import { ResumeProvider } from '../../../context/ResumeContext';
import ResumeBlockContainer from '../../../components/resumeEditor/ResumeBlockContainer';
import DataDisplay from '../../../components/DataDisplay';
import ResumeToolbar from '../../../components/resumeEditor/ResumeToolbar';
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';
import { tipOptions, tipSteps } from '@/hooks/tips'; 

export default function ResumeEditorDemo() {
  const [introEnabled, setIntroEnabled] = useState(false);

  useEffect(() => {
    // 检查用户是否是第一次访问此页面
    const hasVisitedBefore = localStorage.getItem('hasVisitedResumePage');


    if (!hasVisitedBefore) {

      // 启用引导
      setIntroEnabled(true);
      console.log('introEnabled:', introEnabled);
      // 标记用户已访问
      localStorage.setItem('hasVisitedResumePage', 'true');
    }
  }, [introEnabled, setIntroEnabled]);

  const onIntroExit = () => {
    setIntroEnabled(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 relative">
      <ResumeProvider>
        {/* 主要内容区域 */}
        <div className="container mx-auto px-4">
          <div className="bg-white shadow-lg rounded-lg p-6 relative">
            <div className="flex">
              {/* 左侧简历内容区域 - 添加resume-container类用于打印 */}
              <div className="flex-grow resume-container">
                <ResumeBlockContainer />
              </div>
              {/* 右侧工具栏 */}
              <ResumeToolbar setIntroEnabled={setIntroEnabled} />
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
        <Steps
          enabled={introEnabled}
          steps={tipSteps}
          initialStep={0}
          onExit={onIntroExit}
          options={tipOptions}
        />
      </ResumeProvider>
    </div>
  );
}


