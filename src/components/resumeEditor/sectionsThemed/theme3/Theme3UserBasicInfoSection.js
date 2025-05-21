'use client';

import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { User, Mail, Phone, MapPin, Globe, Github, Linkedin } from 'lucide-react';
import EditableField from '../../fieldsEditable/EditableField';

export const Theme3UserBasicInfoSection = () => {
  const { resumeData, updateResumeField } = useResume();
  const { userInfo } = resumeData;
  
  const handleFieldChange = (field, value) => {
    updateResumeField(`userInfo.${field}`, value);
  };

  // 图标和链接信息的配置
  const socialLinks = [
    {
      icon: <Github className="w-4 h-4" />,
      field: 'githubURL',
      placeholder: 'GitHub'
    },
    {
      icon: <Linkedin className="w-4 h-4" />,
      field: 'linkedInURL',
      placeholder: 'LinkedIn'
    },
    {
      icon: <Globe className="w-4 h-4" />,
      field: 'websiteOrOtherProfileURL',
      placeholder: '个人网站'
    }
  ];
  
  return (
    <div className="w-full max-w-4xl mx-auto relative">
      {/* 主要信息区块 */}
      <div className="bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 
                    p-6 rounded-lg border border-red-800/30 hover:border-red-700
                    shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]
                    transition-all duration-300 hover:shadow-lg hover:shadow-red-900/50">
        {/* 姓名部分 */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <EditableField
                field="firstName"
                placeholder="名"
                className="text-3xl font-bold text-red-300"
                value={userInfo}
                onChange={handleFieldChange}
              />
              <EditableField
                field="lastName"
                placeholder="姓"
                className="text-3xl font-bold text-red-300"
                value={userInfo}
                onChange={handleFieldChange}
              />
            </div>
            <EditableField
              field="headLine"
              placeholder="职位头衔"
              className="text-lg text-red-400 mt-2"
              value={userInfo}
              onChange={handleFieldChange}
            />
          </div>
        </div>

        {/* 联系信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {/* 邮箱 */}
            <div className="flex items-center space-x-2 group">
              <Mail className="w-4 h-4 text-red-600 group-hover:text-red-500 transition-colors" />
              <EditableField
                field="email"
                placeholder="邮箱地址"
                className="text-red-200 hover:text-red-100 transition-colors"
                value={userInfo}
                onChange={handleFieldChange}
              />
            </div>
            
            {/* 电话 */}
            <div className="flex items-center space-x-2 group">
              <Phone className="w-4 h-4 text-red-600 group-hover:text-red-500 transition-colors" />
              <EditableField
                field="phoneNumber"
                placeholder="电话号码"
                className="text-red-200 hover:text-red-100 transition-colors"
                value={userInfo}
                onChange={handleFieldChange}
              />
            </div>
            
            {/* 地址 */}
            <div className="flex items-center space-x-2 group">
              <MapPin className="w-4 h-4 text-red-600 group-hover:text-red-500 transition-colors" />
              <EditableField
                field="location"
                placeholder="所在地"
                className="text-red-200 hover:text-red-100 transition-colors"
                value={userInfo}
                onChange={handleFieldChange}
              />
            </div>
          </div>

          {/* 社交链接 */}
          <div className="space-y-2">
            {socialLinks.map(({ icon, field, placeholder }) => (
              <div key={field} className="flex items-center space-x-2 group">
                <span className="text-red-600 group-hover:text-red-500 transition-colors">
                  {icon}
                </span>
                <EditableField
                  field={field}
                  placeholder={placeholder}
                  className="text-red-200 hover:text-red-100 transition-colors"
                  value={userInfo}
                  onChange={handleFieldChange}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative Bottom Border with Glow */}
      <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r 
                    from-transparent via-red-500 to-transparent 
                    shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
    </div>
  );
};

export default Theme3UserBasicInfoSection;
