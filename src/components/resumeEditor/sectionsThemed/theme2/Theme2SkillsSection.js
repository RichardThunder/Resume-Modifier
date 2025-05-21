'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Lightbulb } from 'lucide-react';

export const Theme2SkillsSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { skills } = resumeData;
  
  // 将技能数组转换为逗号分隔的字符串
  const [skillsText, setSkillsText] = useState(Array.isArray(skills) ? skills.join(', ') : '');
  // 添加一个标记，记录上次从 context 获取的 skills
  const lastSkillsRef = useRef(skills);

  // 添加 useEffect 同步 skills 数据变化到本地状态
  useEffect(() => {
    // 比较当前 skills 和上次的 skills 是否相同
    const currentSkillsStr = JSON.stringify(skills);
    const lastSkillsStr = JSON.stringify(lastSkillsRef.current);
    
    // 只有当 skills 发生"外部"变化时才更新文本
    if (currentSkillsStr !== lastSkillsStr) {
      setSkillsText(Array.isArray(skills) ? skills.join(', ') : '');
      lastSkillsRef.current = skills;
    }
  }, [skills]);
  
  // 处理技能文本变更
  const handleSkillsChange = (e) => {
    const newText = e.target.value;
    setSkillsText(newText);
    
    // 将文本转换回数组并更新上下文
    const skillsArray = newText
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
      
    updateResumeField('skills', skillsArray);
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
      
      {/* Skills Input with Theme2 Styling */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg 
                    transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100 
                    border border-transparent hover:border-indigo-200">
        <textarea
          value={skillsText}
          onChange={handleSkillsChange}
          placeholder="输入技能，用逗号分隔（例如：前端开发, React.js, TypeScript）"
          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 
                   min-h-[100px] resize-y text-indigo-800 placeholder-indigo-400"
        />
      </div>
    </div>
  );
};

export default Theme2SkillsSection;
