'use client';

import React from 'react';
import PersonInfoForm from './PersonInfoForm';
import SummaryForm from './SummaryForm';
import EducationForm from './EducationForm';
import WorkExperienceForm from './WorkExperienceForm';
import SkillsForm from './SkillsForm';
import AchievementsForm from './AchievementsForm';
import ProjectForm from './ProjectForm';
import AwardsForm from './AwardsForm';
import CertificationForm from './CertificationForm';
import PublicationsForm from './PublicationsForm';
import VolunteeringForm from './VolunteeringForm';
import ReferencesForm from './ReferencesForm';
import { useResumeStore } from '@/store/resumeStore';

const PersonalForm: React.FC = () => {
    // Get actions from Zustand store
    const resetModel = useResumeStore((state) => state.resetModel);
    const clearModel = useResumeStore((state) => state.clearModel);

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset the resume to the example data? All current changes will be lost.")) {
            resetModel();
        }
    };

    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear all resume data? This action cannot be undone.")) {
            clearModel();
        }
    };


    return (
        <div className="flex flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
            {/* Action Buttons */}
            <div className="w-full max-w-3xl flex justify-start space-x-4 mb-4">
                <button className="btn-custom" onClick={handleReset}>
                    Reset to Example
                </button>
                <button className="btn-custom bg-red-500 hover:bg-red-600" onClick={handleClear}>
                    Clear All
                </button>
            </div>

            {/* Form Sections - Render each section component */}
            {/* Wrap each form section in a container for consistent width/styling */}
            <div className="w-full max-w-3xl">
                <PersonInfoForm />
            </div>
            <div className="w-full max-w-3xl">
                <SummaryForm />
            </div>
            <div className="w-full max-w-3xl">
                <EducationForm />
            </div>
            <div className="w-full max-w-3xl">
                <WorkExperienceForm />
            </div>
            <div className="w-full max-w-3xl">
                <SkillsForm />
            </div>
            <div className="w-full max-w-3xl">
                <AchievementsForm />
            </div>
            <div className="w-full max-w-3xl">
                <ProjectForm />
            </div>
            <div className="w-full max-w-3xl">
                <AwardsForm />
            </div>
            <div className="w-full max-w-3xl">
                <CertificationForm />
            </div>
            <div className="w-full max-w-3xl">
                <PublicationsForm />
            </div>
            <div className="w-full max-w-3xl">
                <VolunteeringForm />
            </div>
            <div className="w-full max-w-3xl">
                <ReferencesForm />
            </div>

        </div>
    );
};

export default PersonalForm;