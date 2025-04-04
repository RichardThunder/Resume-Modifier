import { useState, useCallback } from 'react';
import { useResumeStore } from '@/store/resumeStore'; // Import Zustand store

export default function usePrint() {
    const [isPrinting, setIsPrinting] = useState(false);
    // Get fileName directly from the Zustand store
    const fileName = useResumeStore((state) => state.fileName);

    const exportToPDF = useCallback(() => {
        if (typeof window === 'undefined') return; // Ensure runs only in browser

        const originalTitle = document.title;
        document.title = fileName || 'resume.pdf'; // Use fileName from store
        setIsPrinting(true);

        // Create and append the print-specific styles
        const style = document.createElement('style');
        style.id = 'print-style';
        style.innerHTML = `
            @media print {
                body * { visibility: hidden; }
                @page { margin: 15mm; /* Standard A4 margin */ } /* Adjust margin as needed */

                .resume-preview-container, .resume-preview-container * { /* Target the container */
                    visibility: visible;
                }
                .resume-preview-container {
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important; /* Reset padding if needed */
                    box-shadow: none !important;
                    border: none !important;
                    background-color: white !important; /* Ensure white background */
                }
                 /* Hide elements outside the preview */
                 .app-header, .editor-panel-container, .toggle-button, .toolbar-container {
                     display: none !important;
                 }

                 /* Ensure preview content flows correctly */
                 .resume-container { /* Inner container within ResumePreview */
                     box-shadow: none !important;
                     margin: 0 !important;
                     padding: 0 !important; /* Adjust if ResumePreview adds padding */
                     width: 100% !important; /* Take full width within the print area */
                     border: none !important;
                 }
                 /* Prevent page breaks inside sections where possible */
                 .resume-section {
                      page-break-inside: avoid;
                 }
                 ul, li {
                     page-break-inside: avoid;
                 }
                 h1, h2, p {
                      page-break-after: avoid;
                 }
            }
        `;
        document.head.appendChild(style);

        // Use setTimeout to allow styles to apply before printing
        setTimeout(() => {
            window.print();

            // Cleanup after print dialog closes (or is cancelled)
            document.title = originalTitle;
            const printStyleElement = document.getElementById('print-style');
            if (printStyleElement) {
                document.head.removeChild(printStyleElement);
            }
            setIsPrinting(false);
        }, 100); // Small delay

    }, [fileName]); // Dependency array includes fileName

    return {
        exportToPDF,
        isPrinting
        // No need to return fileName, use it from the store directly where needed
    };
}