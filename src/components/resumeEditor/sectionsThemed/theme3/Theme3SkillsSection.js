'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Flame } from 'lucide-react';

export const Theme3SkillsSection = ({ hideDefaultControls = false, onMenuAction }) => {
  const { resumeData, updateResumeField } = useResume();
  const { skills } = resumeData;
  
  // 将技能数组转换为逗号分隔的字符串
  const [skillsText, setSkillsText] = useState(Array.isArray(skills) ? skills.join(', ') : '');
  // 添加一个标记，记录上次从 context 获取的 skills
  const lastSkillsRef = useRef(skills);

  // 添加 useEffect 同步 skills 数据变化到本地状态
  useEffect(() => {
    const currentSkillsStr = JSON.stringify(skills);
    const lastSkillsStr = JSON.stringify(lastSkillsRef.current);
    
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
  
  return (
    <div className="w-full max-w-4xl mx-auto my-3 relative">
      {/* Section Title with Icon */}
      <div className="flex items-center mb-1">
        <Flame className="w-6 h-6 text-red-500 mr-2" />
        <h2 className="text-2xl font-playfair font-semibold text-red-500 italic">Skills</h2>
      </div>
      
      {/* Animated Divider with Dark Red Glow */}
      <div className="relative mb-4">
        <hr className="border-red-800 border-dashed" />
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 
                      bg-gradient-to-r from-red-900 via-red-500 to-red-900
                      shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
      </div>
      
      {/* Skills Input with Dark Theme Styling */}
      <div className="bg-gradient-to-br from-gray-900 to-red-900 p-4 rounded-lg 
                    transition-all duration-300 hover:shadow-lg hover:shadow-red-900/50
                    border border-red-800/30 hover:border-red-700
                    shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        <textarea
          value={skillsText}
          onChange={handleSkillsChange}
          placeholder="输入技能，用逗号分隔（例如：前端开发, React.js, TypeScript）"
          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 
                   min-h-[100px] resize-y text-red-100 placeholder-red-700/50
                   selection:bg-red-900 selection:text-red-100
                   font-playfair italic"
        />
      </div>
    </div>
  );
};

export default Theme3SkillsSection;
