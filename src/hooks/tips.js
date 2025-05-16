import 'intro.js/introjs.css';

export const tipSteps =
    [
        {
            element: '.resume-block-container',
            intro: 'This is resume editing area, click to edit and drag to reorder.',
            position: 'top'
        },

        {
            element: '.toolbar-container',  // 需要在ResumeToolbar组件上添加此类名
            intro: 'This is the toolbar that you can use to format and manage your resume.',
            position: 'left'
        },
        {
            element: '.theme-switcher',
            intro: 'Change the theme of your resume here.',
            position: 'left'
        },
        {
            element: '.filename-edit',
            intro: 'Change the filename of your resume here.',
            position: 'left'
        },
        {
            element: '.undo-redo-container',
            intro: 'Undo or redo your actions here.',
            position: 'left'
        },
        {
            element: '.resume-uploader',
            intro: 'Upload an existing resume and edit it here.',
            position: 'left'
        },
        {
            element: '.job-description-analysis',
            intro: 'Paste your job description here and we will analyze it for you.(Need Login)',
            position: 'left'
        },
        {
            element: '.reset-resume',
            intro: 'Reset your resume to default.',
            position: 'left'
        },
        {
            element: '.save-resume-btn',
            intro: 'Save your resume.(Need login)',
            position: 'left'
        },
        {
            element: '.export-resume-btn',
            intro: 'Export your resume to PDF.(Need Login)',
            position: 'left'
        },
        {
            element: '.sign-in-btn',
            intro: 'Sign in to enjoy more features.',
            position: 'left',

        }
    ]

export const tipOptions = {
    doneLabel: 'Done',
    nextLabel: 'Next',
    prevLabel: 'Prev',
    skipLabel: '✖️',
    hidePrev: false,
    hideNext: false,
    exitOnOverlayClick: false,
    keyboardNavigation: true,
    showButtons: true,
    scrollToElement: true,
    tooltipClass: 'customTooltip',
    highlightClass: 'customHighlight',
    disableInteraction: true,
    dontShowAgain: false,   
    
}
export const hasVisitedBefore = () => {
    return localStorage.getItem('hasVisitedResumePage');
};

