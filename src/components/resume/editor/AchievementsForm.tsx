'use client';

import React, { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { scoreToColors } from '@/lib/methods'; // Adjusted path

// --- Reusable Helper Components (assuming they are defined elsewhere or copy them here) ---
interface ProgressCircleProps { score: number | undefined; size?: number; width?: number; }
const ProgressCircle: React.FC<ProgressCircleProps> = ({ score = 0, size = 30, width = 4 }) => { /* ... implementation ... */
    const radius = (size - width) / 2; const circumference = 2 * Math.PI * radius; const offset = circumference - (score / 100) * circumference; const color = scoreToColors(score);
    return (<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90"><circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth={width} fill="transparent" /><circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={width} fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.3s ease' }} /><text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-xs font-semibold fill-current text-black rotate-90 origin-center">{score}</text></svg>);
};
interface TooltipProps { text: string | undefined; children: React.ReactNode; }
const Tooltip: React.FC<TooltipProps> = ({ text, children }) => { /* ... implementation ... */
    if (!text) return <>{children}</>;
    return (<div className="relative group inline-block">{children}<div className={`absolute bottom-full left-1/2 z-20 mb-2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap max-w-xs pointer-events-none`}>{text}<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div></div></div>);
};
// --- End Helper Components ---

const AchievementsForm: React.FC = () => {
    const { achievements, updateAchievements, analysis } = useResumeStore((state) => ({
        // Assuming achievements is stored as an array of strings in the store
        achievements: state.model.achievements || [], // Default to empty array
        updateAchievements: state.updateAchievements,
        analysis: state.analysis.achievements,
    }));

    // Local state to manage the textarea content as a single string
    const [achievementsText, setAchievementsText] = useState(achievements.join('\n• ')); // Join array for textarea
    const [isVisible, setIsVisible] = useState(true); // Start visible

    // Sync local state if store changes from outside (e.g., undo/redo, load)
    React.useEffect(() => {
        // Add leading bullet point only if there are items
        const initialText = achievements.length > 0 ? `• ${achievements.join('\n• ')}` : '';
        setAchievementsText(initialText);
    }, [achievements]);


    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAchievementsText(e.target.value);
        // Convert textarea string back to array for the store
        // Split by newline, remove leading bullet points/spaces, filter empty
        const achievementsArray = e.target.value
            .split('\n')
            .map(line => line.trim().replace(/^•\s*/, '').trim())
            .filter(line => line.length > 0);
        updateAchievements(achievementsArray); // Update store
    };


    const toggleShow = () => setIsVisible(!isVisible);

    // In this version, 'Add' and 'Delete' operate on the whole section
    const handleClearAchievements = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent toggle
        if (window.confirm("Are you sure you want to clear all achievements?")) {
            setAchievementsText(''); // Clear local text
            updateAchievements([]); // Clear store array
        }
    };

    const score = analysis?.score;
    const comment = analysis?.comment;


    return (
        <div className="mb-6 mx-auto w-full">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">🏆 Achievements</h2>
                {/* Removed Add button, using textarea */}
            </div>

            {/* Use a simple container, no card needed if toggle is on header */}
            <div className="border rounded-md shadow-sm overflow-hidden">
                <div
                    className="flex justify-between items-center p-2 cursor-pointer bg-gray-50 hover:bg-gray-100"
                    onClick={toggleShow}
                    aria-expanded={isVisible}
                >
                    <span className="font-medium text-gray-700">Your Achievements</span>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                        {score !== undefined && (
                            <Tooltip text={comment}>
                                <ProgressCircle score={score} size={24} width={3} /> {/* Smaller circle */}
                            </Tooltip>
                        )}
                        {/* Optional: Add a clear button */}
                        <button
                            onClick={handleClearAchievements}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Clear All Achievements"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        </button>
                        <span className={`transform transition-transform duration-300 ${isVisible ? 'rotate-180' : ''}`}>▼</span>
                    </div>
                </div>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isVisible ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-3">
                         <textarea
                             id="achievements"
                             value={achievementsText}
                             onChange={handleChange}
                             placeholder="List your key achievements. Start each point on a new line, optionally using '*' or '-' (bullets '•' will be added automatically in preview)."
                             rows={5}
                             className="form-control form-control-sm w-full min-h-[120px]"
                         />
                        <p className="text-xs text-gray-500 mt-1">Enter each achievement on a new line.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AchievementsForm;