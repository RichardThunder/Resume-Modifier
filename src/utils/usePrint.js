import { ref } from 'vue';
import { fileName } from '../model.js'; // 确保路径正确

export default function usePrint() {
    const isPrinting = ref(false); // 添加一个 ref 来跟踪打印状态

    const exportToPDF = () => {

        // upload

        const tmpTitle = document.title;
        document.title = fileName.value;
        isPrinting.value = true; // 设置打印状态为 true

        // 动态添加样式表
        const style = document.createElement('style');
        style.id = 'print-style'; // 给 style 标签添加一个 ID，方便移除
        style.innerHTML = `
      @media print {
        /* 打印时隐藏不需要的元素 */
        body * {
          visibility: hidden;
        }
        @page {
            margin: 20px;
        }
        .resume-preview, .resume-preview * {
          visibility: visible;
        }

        .resume-preview {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%; /* 确保占据整个页面 */
          box-shadow: none;
          align-items: flex-start; /* 顶部对齐 */
          padding: 0; /* 移除内边距 */
          margin: 0; /* 移除外边距 */
        }

        .toolbar {
          display: none !important; /* 隐藏工具栏 */
        }

        .resume-header {
          display: flex !important;
          justify-content: space-between;
          padding: 10px 0 0 0;
          margin-bottom: 5mm;
        }

        .resume-container {
          box-shadow: none;
          padding: 15mm;
          margin: 0;
        }

        /* 隐藏全局的 header 和 footer */
        header, footer {
          display: none !important;
        }
      }
    `;
        document.head.appendChild(style);

        window.print();

        // 打印完成后移除样式表并恢复标题
        document.title = tmpTitle;
        document.head.removeChild(style);
        isPrinting.value = false; // 重置打印状态
    };

    return {
        exportToPDF,
        fileName,
        isPrinting // 导出打印状态
    };
}