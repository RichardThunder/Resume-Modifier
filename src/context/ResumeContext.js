'use client';

import React, { createContext, useContext, useState } from 'react';

// Initial resume data
const initialResumeData = {
  userInfo: {
    firstName: "张",
    lastName: "三",
    headLine: "资深前端工程师",
    phoneNumber: "188-8008-8888",
    email: "zhangsan@example.com",
    linkedInURL: "linkedin.com/in/zhangsan",
    websiteOrOtherProfileURL: "zhangsan.dev",
    location: "北京, 中国",
    githubURL: "github.com/zhangsan"
  },
  education: [
    {
      universityName: "北京大学",
      universityLocation: "北京, 中国",
      universityMajor: "计算机科学与技术",
      degree: "本科学士",
      fromDate: "2018",
      toDate: "2022",
      gpa: "3.8/4.0",
      courses: "数据结构、算法设计、操作系统、计算机网络"
    }
  ],
  workExperience: [
    {
      companyName: "腾讯",
      jobTitle: "前端工程师",
      city: "深圳",
      country: "中国",
      fromDate: "2023-01",
      toDate: "",
      isPresent: true,
      description: "优化前端性能，页面加载速度提升30%"
    }
  ],
  skills: [
    "前端开发",
    "React.js",
    "TypeScript",
    "Node.js",
    "Express.js",
    "数据库设计",
    "版本控制"
  ],
  projects: [
    {
      title: "项目名称",
      description: "项目描述",
      fromDate: "2023-01",
      toDate: "2023-12",
      isPresent: true
    }
  ],
  achievements: [
    {
      title: "成就名称",
      description: "成就描述",
      fromDate: "2023-01",
      toDate: "2023-12",
      isPresent: true
    }
  ]
};

// Create context
const ResumeContext = createContext();

// Provider component
export function ResumeProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  
  // 在初始化状态时就检查本地存储
  const getInitialData = () => {
    if (typeof window !== 'undefined') {  // 确保在浏览器环境中
      try {
        const storedData = localStorage.getItem('resumeData');
        if (storedData) {
          return JSON.parse(storedData);
        }
      } catch (error) {
        console.error('加载初始简历数据时出错:', error);
      }
    }
    return initialResumeData;  // 如果没有存储数据或出错，返回默认数据
  };

  const [resumeData, setResumeData] = useState(getInitialData);

  // 在组件挂载后设置加载完成
  React.useEffect(() => {
    setIsLoading(false);
    
    // 只在本地存储中没有数据时，保存默认模板
    if (typeof window !== 'undefined' && !localStorage.getItem('resumeData')) {
      saveToLocalStorage(initialResumeData);
    }
  }, []);

  // Function to update a specific field in resumeData
  const updateResumeField = (path, value) => {
    setResumeData(prevData => {
      // Clone the previous data
      const newData = JSON.parse(JSON.stringify(prevData));
      
      // Handle dot notation path (e.g., 'userInfo.headLine')
      const keys = path.split('.');
      let current = newData;
      
      // Navigate to the nested object
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key.includes('[') && key.includes(']')) {
          // Handle array access (e.g., 'education[0]')
          const arrayKey = key.substring(0, key.indexOf('['));
          const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')));
          current = current[arrayKey][index];
        } else {
          current = current[key];
        }
      }
      
      // Set the value at the final key
      const lastKey = keys[keys.length - 1];
      if (lastKey.includes('[') && lastKey.includes(']')) {
        const arrayKey = lastKey.substring(0, lastKey.indexOf('['));
        const index = parseInt(lastKey.substring(lastKey.indexOf('[') + 1, lastKey.indexOf(']')));
        current[arrayKey][index] = value;
      } else {
        current[lastKey] = value;
      }
      
      // 自动保存到 localStorage
      setTimeout(() => saveToLocalStorage(newData), 0);
      
      return newData;
    });
  };

  // 添加保存到 localStorage 的函数
  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem('resumeData', JSON.stringify(data));
      console.log('简历数据已保存到本地存储');
    } catch (error) {
      console.error('保存简历数据时出错:', error);
    }
  };

  // 添加从 localStorage 加载数据的函数
  const loadFromLocalStorage = () => {
    try {
      const storedData = localStorage.getItem('resumeData');
      if (storedData) {
        setResumeData(JSON.parse(storedData));
        console.log('从本地存储加载了简历数据');
        return true;
      }
      console.log('本地存储中没有简历数据，使用默认模板');
      return false;
    } catch (error) {
      console.error('加载简历数据时出错:', error);
      return false;
    }
  };
  
  // 添加清空本地存储的函数
  const clearLocalStorage = () => {
    try {
      localStorage.removeItem('resumeData');
      // 重置为初始模板数据
      setResumeData(initialResumeData);
      console.log('已清空本地存储的简历数据并重置为默认模板');
    } catch (error) {
      console.error('清空本地存储时出错:', error);
    }
  };

  // 在组件初始化时尝试加载数据
  React.useEffect(() => {
    // 只在本地存储中没有数据时，保存默认模板
    if (typeof window !== 'undefined' && !localStorage.getItem('resumeData')) {
      saveToLocalStorage(initialResumeData);
      console.log('已将默认模板保存到本地存储');
    }
    // 移除这行，避免重复设置状态
    // console.log(resumeData);
  }, []);

  // Simplified update function for common cases
  const updateTextContent = (blockId, plainText) => {
    switch (blockId) {
      case 'user-headline':
        updateResumeField('userInfo.headLine', plainText);
        break;
      case 'user-firstname':
        updateResumeField('userInfo.firstName', plainText);
        break;
      case 'user-lastname':
        updateResumeField('userInfo.lastName', plainText);
        break;
      case 'user-email':
        // Extract just the email if it contains other content
        const emailMatch = plainText.match(/[\w.-]+@[\w.-]+\.\w+/);
        if (emailMatch) {
          updateResumeField('userInfo.email', emailMatch[0]);
        } else {
          updateResumeField('userInfo.email', plainText);
        }
        break;
      case 'user-phone':
        // Extract phone number if it contains other content
        const phoneMatch = plainText.match(/\d[\d\s-]{7,}/);
        if (phoneMatch) {
          updateResumeField('userInfo.phoneNumber', phoneMatch[0]);
        } else {
          updateResumeField('userInfo.phoneNumber', plainText);
        }
        break;
      // Add more cases as needed for other blocks
      default:
        console.log(`No mapping defined for block ID: ${blockId}`);
        break;
    }
  };

  return (
    <ResumeContext.Provider value={{ 
      resumeData, 
      updateResumeField, 
      updateTextContent, 
      setResumeData,
      saveToLocalStorage: () => saveToLocalStorage(resumeData),
      loadFromLocalStorage,
      clearLocalStorage,  
      isLoading
    }}>
      {!isLoading && children}
    </ResumeContext.Provider>
  );
}

// Custom hook to use the resume context
export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
