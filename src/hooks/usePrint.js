import { useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';

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
        .resume-container, .resume-container * {
          visibility: visible;
        }
        .resume-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
        /* 让所有字体都小一号 */
        .resume-container * {
          font-size: 0.9em !important;
        }
        /* 隐藏textarea的拖拽标识 */
        .resume-container textarea {
          resize: none !important;
          overflow: hidden !important;
        }

        @page {
          size: A4;
          margin: 0;
        }
      }
    `;
    document.head.appendChild(style);
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
    
    // 添加打印样式
    addPrintStyles();
    
    setTimeout(() => {
      window.print();
      
      // 打印对话框关闭后移除样式并重置状态
      setTimeout(() => {
        removePrintStyles();
        setIsPrinting(false);
      }, 1000);
    }, 300);
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      removePrintStyles();
    };
  }, []);

  return { exportToPDF, isPrinting };
};

export default usePrint;