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
        localStorage.setItem("resumeData", JSON.stringify(data));
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