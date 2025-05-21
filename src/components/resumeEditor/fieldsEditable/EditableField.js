'use client';

import React, { useRef, useEffect } from 'react';

/**
 * 通用的可编辑输入字段组件
 * 可用于单个对象的字段编辑或数组中对象的字段编辑
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.field - 字段名称
 * @param {number} [props.index] - 如果是数组，则为数组索引
 * @param {string} props.placeholder - 占位符文本
 * @param {string} [props.className] - 额外的CSS类名
 * @param {Object|Array} props.value - 当前值(对象或数组)
 * @param {Function} props.onChange - 值变化时的回调函数
 * @param {Function} [props.onBlur] - 失去焦点时的回调函数
 * @param {string} [props.type='text'] - 输入类型
 * @returns {JSX.Element} EditableField组件
 */
const EditableField = ({ 
  field, 
  index, 
  placeholder, 
  className = '', 
  value, 
  onChange, 
  onBlur,
  type = 'text' 
}) => {
  // 使用 ref 维持输入框引用
  const inputRef = useRef(null);
  // 使用 ref 维持隐藏的测量元素引用
  const measureRef = useRef(null);

  // 处理值变化
  const handleChange = (e) => {
    const newValue = e.target.value;
    // 根据是否有索引决定回调参数
    if (index !== undefined) {
      onChange(index, field, newValue);
    } else {
      onChange(field, newValue);
    }
    
    // 调整宽度
    adjustWidth();
  };
  
  // 处理失去焦点
  const handleBlur = () => {
    if (onBlur) {
      if (index !== undefined) {
        onBlur(index, field);
      } else {
        onBlur(field);
      }
    }
  };
  
  // 获取当前值
  const getCurrentValue = () => {
    if (index !== undefined) {
      // 数组中的对象
      return value[index]?.[field] || '';
    } else {
      // 直接对象
      return value[field] || '';
    }
  };
  
  // 自动调整宽度的函数
  const adjustWidth = () => {
    if (inputRef.current && measureRef.current) {
      const currentValue = getCurrentValue();
      // 设置测量元素的文本内容
      measureRef.current.textContent = currentValue || placeholder;
      
      // 复制输入框的样式到测量元素，确保字体大小和加粗样式一致
      const inputStyles = window.getComputedStyle(inputRef.current);
      measureRef.current.style.fontSize = inputStyles.fontSize;
      measureRef.current.style.fontWeight = inputStyles.fontWeight;
      measureRef.current.style.fontFamily = inputStyles.fontFamily;
      measureRef.current.style.letterSpacing = inputStyles.letterSpacing;
      measureRef.current.style.textTransform = inputStyles.textTransform;
      
      // 获取测量元素的宽度并添加一些额外空间
      const width = measureRef.current.offsetWidth + 10;
      // 设置最小宽度
      const minWidth = placeholder ? measureRef.current.offsetWidth + 10 : 20;
      // 设置输入框宽度
      inputRef.current.style.width = `${Math.max(width, minWidth)}px`;
    }
  };
  
  // 组件挂载和值变化时调整宽度
  useEffect(() => {
    adjustWidth();
     // 添加窗口大小变化监听器
    window.addEventListener('resize', adjustWidth);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', adjustWidth);
    };
  }, [value, placeholder]);

  const currentValue = getCurrentValue();
  const isEmpty = !currentValue;

  return (
    <>
      {/* 隐藏的测量元素 */}
      <span ref={measureRef} style={{ visibility: 'hidden', position: 'absolute', whiteSpace: 'pre' }} />
      
      <input
        ref={inputRef}
        type={type}
        value={currentValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`editable-field ${className} ${isEmpty ? 'empty-field' : ''}`}
        style={{
          padding: 0,
          border: 'none',
          outline: 'none',
          background: 'transparent',
        }}
      />
    </>
  );
};

export default EditableField;
