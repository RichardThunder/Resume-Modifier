/*
 * @Author: Richard yuetingpei888@gmail.com
 * @Date: 2025-02-26 18:28:48
 * @LastEditors: Richard yuetingpei888@gmail.com
 * @LastEditTime: 2025-02-27 07:23:34
 * @FilePath: /Resume-Modifier/src/utils/ResumeSaver.js
 * @Description: 
 * 
 */
let ResumeData = {};
const ResumeSaver = {

    loadResume: () => {
        const tmpData = localStorage.getItem("resumeData");
        if (tmpData) {
            ResumeData = JSON.parse(tmpData);
        } else {
            ResumeData = {};
        }
    },
    saveResume: (data) => {
        ResumeData = data;
        localStorage.setItem("resumeData", JSON.stringify(ResumeData));
    },
    getResumeData: () => {
        return ResumeData
    },
    setResumeData: (data) => {
        ResumeData = data;
    },
    isStorageEmpty: () => {
        return Object.keys(ResumeData).length === 0;
    },
    clearLocalStorage: () => {
        localStorage.removeItem("resumeData");
    }
};

export default ResumeSaver;