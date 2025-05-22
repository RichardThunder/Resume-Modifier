'use client'
import { useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { CloudCog } from 'lucide-react';

const usePrint = () => {
  const [isPrinting, setIsPrinting] = useState(false);
  const { resumeData } = useResume();

  // 添加打印样式，隐藏非简历内容
  const addPrintStyles = () => {
    const style = document.createElement('style');
    style.id = 'print-styles';
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }

        .resume-block-container, .resume-block-container * {
          visibility: visible;
        }
        .resume-block-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: auto;
          margin: 0 !important;
          padding: 0 !important;
          transform: none !important;
          box-shadow: none !important;
        }
        /* 让所有字体都小一号 */
        .resume-block-container * {
          font-size: 0.9em !important;
          margin-top: 0 !important;
          padding-top: 0 !important;
        }
        /* 隐藏textarea的拖拽标识 */
        .resume-block-container textarea {
          resize: none !important;
          overflow: hidden !important;
        }

        @page {
          size: A4;

        }


        .resume-block-container {
          position: fixed;
          left: 5%;
          top: 2%;
          width: 90%;
          height: 90%;
          margin: 0 auto !important;
          transform: none !important;
          box-shadow: none !important;
        }
      }
    `;
    /*
            
    .resume - block - container - parent {
      margin: 0!important;
      padding: 0!important;
    } */
    document.head.appendChild(style);
  };

  // 添加导出覆盖层，防止焦点和交互
  const addExportOverlay = () => {
    const overlay = document.createElement('div');
    overlay.id = 'export-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: wait;
    `;

    // 添加旋转加载图标
    const spinner = document.createElement('div');
    spinner.style.cssText = `
      border: 5px solid #f3f3f3;
      border-top: 5px solid #3498db;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 2s linear infinite;
    `;

    // 添加旋转动画
    const styleAnimation = document.createElement('style');
    styleAnimation.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    styleAnimation.setAttribute('data-overlay-animation', 'true');
    document.head.appendChild(styleAnimation);

    // 添加文字
    const text = document.createElement('div');
    text.innerText = '正在生成 PDF，请稍候...';
    text.style.cssText = `
      margin-top: 20px;
      font-size: 18px;
      font-weight: bold;
      color: #333;
    `;

    overlay.appendChild(spinner);
    overlay.appendChild(text);
    document.body.appendChild(overlay);
  };

  // 移除导出覆盖层
  const removeExportOverlay = () => {
    const overlay = document.getElementById('export-overlay');
    if (overlay) {
      document.body.removeChild(overlay);
    }

    const styleAnimation = document.head.querySelector('style[data-overlay-animation]');
    if (styleAnimation) {
      document.head.removeChild(styleAnimation);
    }
  };

  // 移除打印样式
  const removePrintStyles = () => {
    const style = document.getElementById('print-styles');
    if (style) {
      document.head.removeChild(style);
    }
  };

  const exportToPDF = () => {
    setIsPrinting(true);

    // 添加打印样式和覆盖层
    addPrintStyles();
    addExportOverlay();

    setTimeout(() => {
      // 保存当前页面上所有元素的可见性状态
      const elementsToHide = Array.from(document.body.querySelectorAll('*:not(.resume-block-container):not(.resume-block-container *)'));
      const visibilityStates = elementsToHide.map(el => ({ element: el, visibility: el.style.visibility }));

      // 隐藏不需要打印的元素
      elementsToHide.forEach(el => el.style.visibility = 'hidden');

      // 打印
      window.print();

      // 恢复元素的可见性
      setTimeout(() => {
        visibilityStates.forEach(item => {
          item.element.style.visibility = item.visibility || '';
        });

        // 移除样式并重置状态
        removePrintStyles();
        removeExportOverlay();
        setIsPrinting(false);
      }, 1000);
    }, 300);
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      removePrintStyles();
      removeExportOverlay();
    };
  }, []);

  return { exportToPDF, isPrinting };
};

export default usePrint;