import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { cloneDeep } from 'lodash-es';
import { ResumeModel, Analysis, UserInfo, Education, WorkExperience, Project, Award, Certification, Publication, Reference, Volunteering } from '@/types/resume';
import { textToHtml } from '@/lib/methods'; // Assuming textToHtml is needed

// --- Default Empty State ---
export const modelClear: ResumeModel = {
    achievements: [],
    award: [],
    certifications: [],
    education: [],
    project: [],
    publications: [],
    references: [],
    skills: [],
    summary: "",
    userInfo: {
        firstName: '',
        lastName: '',
    },
    volunteering: [],
    workExperience: []
};

// --- Example State (potentially fetch this or load from storage) ---
export const modelExample: ResumeModel = {
    // ... (copy the full modelExample structure from src/model.js)
    // Make sure all description fields match the type (string)
    achievements: [
        'Successfully led a team of 5 developers to deliver a critical project 2 weeks ahead of schedule.',
        'Reduced application latency by 40% through performance optimization techniques.',
        'Received the "Innovation Award" for developing a novel solution to a complex problem.',
        'Mentored junior developers, improving their skills and contributing to team growth.',
    ],
    award: [
        {
            name: 'Employee of the Month',
            issuer: 'Acme Corp',
            urlToAward: 'https://www.example.com/award1',
            dateOfAward: '2023-05-15',
            description: 'Recognized for outstanding contributions to the team and exceeding performance goals.',
        },
        {
            name: 'Innovation Award',
            issuer: 'Tech Solutions Inc.',
            urlToAward: 'https://www.example.com/award2',
            dateOfAward: '2024-01-20',
            description: 'Awarded for developing a novel solution that significantly improved efficiency and reduced costs.',
        },
    ],
    certifications: [
        {
            name: 'Certified Scrum Master (CSM)',
            issuer: 'Scrum Alliance',
            date: '2022-08-01',
            expiryDate: '2024-08-01',
            url: 'https://www.example.com/csm',
            description: 'Demonstrates proficiency in Scrum principles and practices.',
        },
        {
            name: 'AWS Certified Cloud Practitioner',
            issuer: 'Amazon Web Services (AWS)',
            date: '2023-03-10',
            expiryDate: '2026-03-10',
            url: 'https://www.example.com/aws-ccp',
            description: 'Validates foundational knowledge of AWS Cloud concepts and services.',
        },
    ],
    education: [
        {
            city: 'Tucson',
            country: 'Arizona',
            degree: 'M.S.',
            description: 'Specialized in data mining and machine learning. Conducted research on recommendation systems.',
            fieldOfStudy: 'Computer Science',
            fromDate: '2011-08-01',
            grade: '3.8/4.0',
            institutionName: 'UNIVERSITY OF ARIZONA',
            isPresent: false,
            toDate: '2012-05-01'
        },
        {
            city: 'Tucson',
            country: 'Arizona',
            degree: 'B.S.B.A.',
            description: 'Focused on database management and business intelligence.',
            fieldOfStudy: 'Management Information Systems',
            fromDate: '2007-08-01',
            grade: '3.5/4.0',
            institutionName: 'UNIVERSITY OF ARIZONA',
            isPresent: false,
            toDate: '2011-05-01'
        },
        {
            city: 'Online',
            country: 'Coursera',
            degree: 'Machine Learning Specialization',
            description: 'Completed a specialization in Machine Learning, covering topics such as supervised learning, unsupervised learning, and deep learning.',
            fieldOfStudy: 'Machine Learning',
            fromDate: '2023-01-01',
            grade: 'N/A',
            institutionName: 'Coursera',
            isPresent: false,
            toDate: '2023-06-01'
        }
    ],
    project: [
        {
            city: '',
            country: '',
            description: `• Collaborative coding platform with a linux terminal, code editor, file browser, chat window, and video collection.
    • Connected users using Socket.io to chat and see immediate changes to collaborators’ code editor and terminal.
    • Used Docker to emulate a UNIX environment in browser with drag and drop file upload and file download.
    • Created an API for Docker container control and NodeJS / ExpressJS server with a MySQL DB for user data.
    • Incorporated YouTube API for seamless programming alongside educational videos.
    • Built front-end using ReactJS and uses states to control permissions.`,
            fromDate: '2023-07-01',
            isPresent: false,
            projectRole: 'Software Engineer',
            title: 'PicoShell',
            toDate: '2023-12-01'
        },
        {
            city: '',
            country: '',
            description: `• Photo diary and photo organizer that uses photo-recognition APIs to tag and caption photos.
    • Expanded and refined functionality of React Native codebase.
    • Implemented search, geo-tags, and content sort using ExponentJS to improve UX.
    • Configured continuous integration using CircleCI and Heroku to streamline build, test, and deployment.
    • Rapidly prototyped and deployed mobile app using Exponent XDE.`,
            fromDate: '2022-01-01',
            isPresent: false,
            projectRole: 'Front-End Engineer / DevOps',
            title: 'TagMe',
            toDate: '2022-06-01'
        },
        {
            city: '',
            country: '',
            description: `• Spotify playlist generator based on time of day and weather forecast of any given roadtrip route.
    • Integrated OAuth authentication with Spotify using PassportJS.
    • Generated Spotify playlists tailored to user’s roadtrip route using Google Maps and Accuweather forecast.`,
            fromDate: '2021-05-01',
            isPresent: false,
            projectRole: 'Software Engineer',
            title: 'Roadtrip Mood Music Generator',
            toDate: '2021-08-01'
        },
        {
            city: '',
            country: '',
            description: `• Developed a web application for managing and tracking personal finances.
    • Implemented user authentication, transaction categorization, and reporting features.
    • Utilized React, Node.js, Express, and MongoDB for full-stack development.`,
            fromDate: '2020-09-01',
            isPresent: false,
            projectRole: 'Full-Stack Developer',
            title: 'Personal Finance Tracker',
            toDate: '2020-12-01'
        }
    ],
    publications: [
        {
            name: 'A Novel Approach to Recommendation Systems',
            publisher: 'Journal of Machine Learning Research',
            url: 'https://www.example.com/publication1',
            date: '2012-01-01'
        },
        {
            name: 'Improving User Experience in Mobile Applications',
            publisher: 'International Conference on Human-Computer Interaction',
            url: 'https://www.example.com/publication2',
            date: '2022-05-01'
        },
    ],
    references: [
        {
            company: 'Acme Corp',
            personName: 'Jane Doe',
            roleOfPerson: 'Team Lead',
            email: 'jane.doe@example.com',
            phoneNumber: '(555) 123-4567',
            description: 'Jane was my team lead and provided excellent guidance and support. She is a highly skilled and dedicated professional.',
        },
        {
            company: 'Tech Solutions Inc.',
            personName: 'John Smith',
            roleOfPerson: 'Project Manager',
            email: 'john.smith@example.com',
            phoneNumber: '(555) 987-6543',
            description: 'John was my project manager and consistently delivered projects on time and within budget. He is a strong leader and communicator.',
        },
    ],
    skills: ["ReactJS", "AngularJS 1.x", "ExpressJS", "NodeJS", "jQuery", "HTML/CSS",
        "React Native", "ExponentJS",
        " Spring", "Maven",
        "MongoDB", "SQL", "JavaScript", "TypeScript", "Docker", "Kubernetes", "CI/CD", "Git", "Agile Methodologies", "Scrum", "RESTful APIs"],
    summary: `An analytical and results‐driven software engineer with experience in application development, scripting and coding, automation, web application design, product testing and deployment, UI testing, and requirements gathering. Proven aptitude for implementing innovative solutions to streamline and automate processes, enhance efficiency, improve customer satisfaction, and achieve financial savings.`,
    userInfo: {
        email: 'sampleresume@gmail.com',
        firstName: 'First',
        headLine: 'Software Engineer | Full-Stack Developer | Cloud Enthusiast',
        lastName: 'Last',
        linkedInURL: 'linkedin.com/in/sampleresume',
        phoneNumber: '(480) 123‐5689',
        websiteOrOtherProfileURL: 'https://www.example.com',
        city: 'chongqing',
        country: 'China'
    },
    volunteering: [
        {
            name: 'Code for Good',
            role: 'Volunteer Developer',
            city: 'San Francisco',
            country: 'USA',
            fromDate: '2019-01-01',
            toDate: '2019-06-01',
            description: 'Developed a web application for a non-profit organization to help them manage their volunteer database.',
        },
        {
            name: 'Habitat for Humanity',
            role: 'Construction Volunteer',
            city: 'Phoenix',
            country: 'USA',
            fromDate: '2018-09-01',
            toDate: '2018-12-01',
            description: 'Assisted with the construction of affordable housing for low-income families.',
        },
        {
            name: 'Local Food Bank',
            role: 'Food Sorter',
            city: 'Phoenix',
            country: 'USA',
            fromDate: '2017-05-01',
            toDate: '2017-08-01',
            description: 'Sorted and organized food donations to ensure efficient distribution to those in need.',
        }
    ],
    workExperience: [
        {
            city: 'Bentonville',
            companyName: 'WALMART, INC.',
            country: 'Arkansas',
            description: `• Architected financial services hotline app for 8 countries in Central and South America.
          • Implemented benefits hotline app rollout every year for US and Canada serving 1.4 million employees.
    • Optimized manual application tuning process with Java to fetch and process data, making process 20x faster.
    • Connected user-facing web applications with SQL DBs using Spring REST web services.
    • Integrated agent monitoring system, improving call center efficiency by 30%. [Employee of the Month - Dec 2012]`,
            fromDate: '2011-06-01',
            isPresent: false,
            jobTitle: 'Programmer Analyst, Call Center Engineering Team',
            toDate: '2016-05-01'
        },
        {
            city: 'San Francisco',
            companyName: 'Google',
            country: 'California',
            description: `• Developed and maintained key features for Google's search engine.
    • Collaborated with a team of engineers to improve search relevance and performance.
    • Utilized Java, Python, and C++ for backend development.
    • Implemented unit tests and integration tests to ensure code quality.`,
            fromDate: '2016-06-01',
            isPresent: true,
            jobTitle: 'Software Engineer',
            toDate: ''
        }
    ]
};

// --- Analysis Empty State ---
const analysisClear: Analysis = {
    education: [],
    project: [],
    workExperience: [],
    award: [],
    certifications: [],
    publications: [],
    volunteering: [],
    references: [],
};

// --- Zustand Store Definition ---

interface ResumeState {
    model: ResumeModel;
    analysis: Analysis;
    fileName: string;
    history: ResumeModel[];
    future: ResumeModel[];
    isInitialized: boolean; // Flag to track if initial load is done
    setInitialized: (status: boolean) => void;
    setModel: (newModel: ResumeModel) => void;
    updateField: <K extends keyof ResumeModel>(field: K, value: ResumeModel[K]) => void;
    updateNestedField: <K extends keyof ResumeModel, NK extends keyof ResumeModel[K]>(
        field: K,
        index: number,
        nestedKey: NK,
        value: any // Consider refining 'any' type if possible
    ) => void;
    updateUserInfoField: <K extends keyof UserInfo>(field: K, value: UserInfo[K]) => void;

    // Specific array actions
    addEducation: () => void;
    deleteEducation: (index: number) => void;
    reorderEducation: (startIndex: number, endIndex: number) => void;
    updateEducation: (index: number, updatedData: Partial<Education>) => void;

    addWorkExperience: () => void;
    deleteWorkExperience: (index: number) => void;
    reorderWorkExperience: (startIndex: number, endIndex: number) => void;
    updateWorkExperience: (index: number, updatedData: Partial<WorkExperience>) => void;

    addProject: () => void;
    deleteProject: (index: number) => void;
    reorderProject: (startIndex: number, endIndex: number) => void;
    updateProject: (index: number, updatedData: Partial<Project>) => void;

    addAward: () => void;
    deleteAward: (index: number) => void;
    reorderAward: (startIndex: number, endIndex: number) => void;
    updateAward: (index: number, updatedData: Partial<Award>) => void;

    addCertification: () => void;
    deleteCertification: (index: number) => void;
    reorderCertification: (startIndex: number, endIndex: number) => void;
    updateCertification: (index: number, updatedData: Partial<Certification>) => void;

    addPublication: () => void;
    deletePublication: (index: number) => void;
    reorderPublication: (startIndex: number, endIndex: number) => void;
    updatePublication: (index: number, updatedData: Partial<Publication>) => void;

    addReference: () => void;
    deleteReference: (index: number) => void;
    reorderReference: (startIndex: number, endIndex: number) => void;
    updateReference: (index: number, updatedData: Partial<Reference>) => void;

    addVolunteering: () => void;
    deleteVolunteering: (index: number) => void;
    reorderVolunteering: (startIndex: number, endIndex: number) => void;
    updateVolunteering: (index: number, updatedData: Partial<Volunteering>) => void;

    addSkill: (skill: string) => void;
    deleteSkill: (index: number) => void;
    reorderSkills: (startIndex: number, endIndex: number) => void;
    updateSkill: (index: number, newSkill: string) => void; // Added update skill

    // Achievements specific actions
    updateAchievements: (achievements: string[]) => void; // Assuming achievements is an array
    // Or if it's a single string block:
    // updateAchievementsString: (achievements: string) => void;
    addAchievement: (achievement: string) => void; // If adding individual strings
    deleteAchievement: (index: number) => void; // If deleting individual strings

    updateSummary: (summary: string) => void;

    // Analysis and Filename
    setAnalysis: (newAnalysis: Analysis) => void;
    setFileName: (name: string) => void;

    // History
    undo: () => void;
    redo: () => void;
    _updateHistory: (newModel: ResumeModel) => void; // Internal helper

    // Reset/Clear
    clearModel: () => void;
    resetModel: () => void;

    // Load from Local Storage
    loadFromLocalStorage: () => void;
    saveToLocalStorage: () => void;
    clearLocalStorage: () => void;
}

const LOCAL_STORAGE_KEY = 'resumeData';

export const useResumeStore = create<ResumeState>()(
    immer((set, get) => ({
        model: cloneDeep(modelClear), // Start with a clear model
        analysis: cloneDeep(analysisClear),
        fileName: 'resume.pdf',
        history: [],
        future: [],
        isInitialized: false,

        setInitialized: (status) => set({ isInitialized: status }),

        // --- Generic Setters ---
        setModel: (newModel) => {
            set((state) => {
                state._updateHistory(state.model); // Save current state before replacing
                state.model = cloneDeep(newModel); // Ensure deep copy
                state.future = []; // Clear future stack on new set
            });
            get().saveToLocalStorage();
        },
        setAnalysis: (newAnalysis) => set({ analysis: newAnalysis }),
        setFileName: (name) => set({ fileName: name }),

        // --- Update Methods ---
        updateField: (field, value) => {
            set((state) => {
                state._updateHistory(state.model);
                state.model[field] = value;
                state.future = [];
            });
            get().saveToLocalStorage();
        },

        updateNestedField: (field, index, nestedKey, value) => {
            set((state) => {
                // Type assertion to ensure the field is an array
                const arrayField = state.model[field] as any[];
                if (arrayField && Array.isArray(arrayField) && arrayField[index]) {
                    state._updateHistory(state.model);
                    // @ts-ignore // Use ts-ignore carefully if typing becomes too complex
                    arrayField[index][nestedKey] = value;
                    state.future = [];
                } else {
                    console.warn(`Cannot update nested field: ${String(field)}[${index}].${String(nestedKey)}`);
                }
            });
            get().saveToLocalStorage();
        },

        updateUserInfoField: (field, value) => {
            set((state) => {
                state._updateHistory(state.model);
                state.model.userInfo[field] = value;
                state.future = [];
            });
            get().saveToLocalStorage();
        },

        // --- Specific Array Actions ---
        // Example for Education: Repeat this pattern for others
        addEducation: () => {
            set((state) => {
                state._updateHistory(state.model);
                state.model.education.push({}); // Add empty object
                state.future = [];
            });
            get().saveToLocalStorage();
        },
        deleteEducation: (index) => {
            set((state) => {
                if (index >= 0 && index < state.model.education.length) {
                    state._updateHistory(state.model);
                    state.model.education.splice(index, 1);
                    state.future = [];
                }
            });
            get().saveToLocalStorage();
        },
        reorderEducation: (startIndex, endIndex) => {
            set((state) => {
                const result = Array.from(state.model.education);
                const [removed] = result.splice(startIndex, 1);
                result.splice(endIndex, 0, removed);
                state._updateHistory(state.model);
                state.model.education = result;
                state.future = [];
            });
            get().saveToLocalStorage();
        },
        updateEducation: (index, updatedData) => {
            set((state) => {
                if (state.model.education[index]) {
                    state._updateHistory(state.model);
                    Object.assign(state.model.education[index], updatedData);
                    state.future = [];
                }
            });
            get().saveToLocalStorage();
        },

        // --- Work Experience ---
        addWorkExperience: () => set(state => {
            state._updateHistory(state.model);
            state.model.workExperience.push({});
            state.future = [];
            get().saveToLocalStorage();
        }),
        deleteWorkExperience: (index) => set(state => {
            if (index >= 0 && index < state.model.workExperience.length) {
                state._updateHistory(state.model);
                state.model.workExperience.splice(index, 1);
                state.future = [];
                get().saveToLocalStorage();
            }
        }),
        reorderWorkExperience: (startIndex, endIndex) => set(state => {
            const result = Array.from(state.model.workExperience);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            state._updateHistory(state.model);
            state.model.workExperience = result;
            state.future = [];
            get().saveToLocalStorage();
        }),
        updateWorkExperience: (index, updatedData) => set(state => {
            if (state.model.workExperience[index]) {
                state._updateHistory(state.model);
                Object.assign(state.model.workExperience[index], updatedData);
                state.future = [];
                get().saveToLocalStorage();
            }
        }),

        // --- Project ---
        addProject: () => set(state => {
            state._updateHistory(state.model);
            state.model.project.push({});
            state.future = [];
            get().saveToLocalStorage();
        }),
        deleteProject: (index) => set(state => {
            if (index >= 0 && index < state.model.project.length) {
                state._updateHistory(state.model);
                state.model.project.splice(index, 1);
                state.future = [];
                get().saveToLocalStorage();
            }
        }),
        reorderProject: (startIndex, endIndex) => set(state => {
            const result = Array.from(state.model.project);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            state._updateHistory(state.model);
            state.model.project = result;
            state.future = [];
            get().saveToLocalStorage();
        }),
        updateProject: (index, updatedData) => set(state => {
            if (state.model.project[index]) {
                state._updateHistory(state.model);
                Object.assign(state.model.project[index], updatedData);
                state.future = [];
                get().saveToLocalStorage();
            }
        }),

        // --- Award ---
        addAward: () => set(state => {
            state._updateHistory(state.model);
            state.model.award.push({});
            state.future = [];
            get().saveToLocalStorage();
        }),
        deleteAward: (index) => set(state => {
            if (index >= 0 && index < state.model.award.length) {
                state._updateHistory(state.model);
                state.model.award.splice(index, 1);
                state.future = [];
                get().saveToLocalStorage();
            }
        }),
        reorderAward: (startIndex, endIndex) => set(state => {
            const result = Array.from(state.model.award);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            state._updateHistory(state.model);
            state.model.award = result;
            state.future = [];
            get().saveToLocalStorage();
        }),
        updateAward: (index, updatedData) => set(state => {
            if (state.model.award[index]) {
                state._updateHistory(state.model);
                Object.assign(state.model.award[index], updatedData);
                state.future = [];
                get().saveToLocalStorage();
            }
        }),

        // --- Certification ---
        addCertification: () => set(state => {
            state._updateHistory(state.model);
            state.model.certifications.push({});
            state.future = [];
            get().saveToLocalStorage();
        }),
        deleteCertification: (index) => set(state => {
            if (index >= 0 && index < state.model.certifications.length) {
                state._updateHistory(state.model);
                state.model.certifications.splice(index, 1);
                state.future = [];
                get().saveToLocalStorage();
            }
        }),
        reorderCertification: (startIndex, endIndex) => set(state => {
            const result = Array.from(state.model.certifications);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            state._updateHistory(state.model);
            state.model.certifications = result;
            state.future = [];
            get().saveToLocalStorage();
        }),
        updateCertification: (index, updatedData) => set(state => {
            if (state.model.certifications[index]) {
                state._updateHistory(state.model);
                Object.assign(state.model.certifications[index], updatedData);
                state.future = [];
                get().saveToLocalStorage();
            }
        }),

        // --- Publication ---
        addPublication: () => set(state => {
            state._updateHistory(state.model);
            state.model.publications.push({});
            state.future = [];
            get().saveToLocalStorage();
        }),
        deletePublication: (index) => set(state => {
            if (index >= 0 && index < state.model.publications.length) {
                state._updateHistory(state.model);
                state.model.publications.splice(index, 1);
                state.future = [];
                get().saveToLocalStorage();
            }
        }),
        reorderPublication: (startIndex, endIndex) => set(state => {
            const result = Array.from(state.model.publications);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            state._updateHistory(state.model);
            state.model.publications = result;
            state.future = [];
            get().saveToLocalStorage();
        }),
        updatePublication: (index, updatedData) => set(state => {
            if (state.model.publications[index]) {
                state._updateHistory(state.model);
                Object.assign(state.model.publications[index], updatedData);
                state.future = [];
                get().saveToLocalStorage();
            }
        }),

        // --- Reference ---
        addReference: () => set(state => {
            state._updateHistory(state.model);
            state.model.references.push({});
            state.future = [];
            get().saveToLocalStorage();
        }),
        deleteReference: (index) => set(state => {
            if (index >= 0 && index < state.model.references.length) {
                state._updateHistory(state.model);
                state.model.references.splice(index, 1);
                state.future = [];
                get().saveToLocalStorage();
            }
        }),
        reorderReference: (startIndex, endIndex) => set(state => {
            const result = Array.from(state.model.references);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            state._updateHistory(state.model);
            state.model.references = result;
            state.future = [];
            get().saveToLocalStorage();
        }),
        updateReference: (index, updatedData) => set(state => {
            if (state.model.references[index]) {
                state._updateHistory(state.model);
                Object.assign(state.model.references[index], updatedData);
                state.future = [];
                get().saveToLocalStorage();
            }
        }),


        // --- Volunteering ---
        addVolunteering: () => set(state => {
            state._updateHistory(state.model);
            state.model.volunteering.push({});
            state.future = [];
            get().saveToLocalStorage();
        }),
        deleteVolunteering: (index) => set(state => {
            if (index >= 0 && index < state.model.volunteering.length) {
                state._updateHistory(state.model);
                state.model.volunteering.splice(index, 1);
                state.future = [];
                get().saveToLocalStorage();
            }
        }),
        reorderVolunteering: (startIndex, endIndex) => set(state => {
            const result = Array.from(state.model.volunteering);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            state._updateHistory(state.model);
            state.model.volunteering = result;
            state.future = [];
            get().saveToLocalStorage();
        }),
        updateVolunteering: (index, updatedData) => set(state => {
            if (state.model.volunteering[index]) {
                state._updateHistory(state.model);
                Object.assign(state.model.volunteering[index], updatedData);
                state.future = [];
                get().saveToLocalStorage();
            }
        }),

        // --- Skills ---
        addSkill: (skill) => set(state => {
            if (skill.trim()) {
                state._updateHistory(state.model);
                state.model.skills.push(skill.trim());
                state.future = [];
                get().saveToLocalStorage();
            }
        }),
        deleteSkill: (index) => set(state => {
            if (index >= 0 && index < state.model.skills.length) {
                state._updateHistory(state.model);
                state.model.skills.splice(index, 1);
                state.future = [];
                get().saveToLocalStorage();
            }
        }),
        reorderSkills: (startIndex, endIndex) => set(state => {
            const result = Array.from(state.model.skills);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            state._updateHistory(state.model);
            state.model.skills = result;
            state.future = [];
            get().saveToLocalStorage();
        }),
        updateSkill: (index, newSkill) => set(state => {
            if (state.model.skills[index] !== undefined && newSkill.trim()) {
                state._updateHistory(state.model);
                state.model.skills[index] = newSkill.trim();
                state.future = [];
                get().saveToLocalStorage();
            }
        }),

        // --- Achievements ---
        updateAchievements: (achievements) => set(state => {
            state._updateHistory(state.model);
            state.model.achievements = achievements;
            state.future = [];
            get().saveToLocalStorage();
        }),
        // Assuming achievements is an array of strings
        addAchievement: (achievement) => set(state => {
            if (achievement.trim()) {
                state._updateHistory(state.model);
                state.model.achievements.push(achievement.trim());
                state.future = [];
                get().saveToLocalStorage();
            }
        }),
        deleteAchievement: (index) => set(state => {
            if (index >= 0 && index < state.model.achievements.length) {
                state._updateHistory(state.model);
                state.model.achievements.splice(index, 1);
                state.future = [];
                get().saveToLocalStorage();
            }
        }),
        // deleteAchievements: () => set(state => { // Added to match Vue version's deleteAchieve
        //      state._updateHistory(state.model);
        //      state.model.achievements = []; // Or set to a default empty state if it's a string
        //      state.future = [];
        //      get().saveToLocalStorage();
        // }),

        // --- Summary ---
        updateSummary: (summary) => set(state => {
            state._updateHistory(state.model);
            state.model.summary = summary;
            state.future = [];
            get().saveToLocalStorage();
        }),


        // --- History Management ---
        _updateHistory: (currentModel) => {
            set((state) => {
                // Limit history size if needed
                // if (state.history.length > MAX_HISTORY) {
                //   state.history.shift();
                // }
                state.history.push(cloneDeep(currentModel));
            });
        },
        undo: () => {
            set((state) => {
                if (state.history.length > 0) {
                    const previousState = state.history.pop();
                    if (previousState) {
                        state.future.push(cloneDeep(state.model)); // Save current state to future
                        state.model = previousState; // Restore previous state
                    }
                }
            });
            get().saveToLocalStorage(); // Save after undo
        },
        redo: () => {
            set((state) => {
                if (state.future.length > 0) {
                    const nextState = state.future.pop();
                    if (nextState) {
                        state.history.push(cloneDeep(state.model)); // Save current state to history
                        state.model = nextState; // Restore next state
                    }
                }
            });
            get().saveToLocalStorage(); // Save after redo
        },

        // --- Reset / Clear ---
        clearModel: () => {
            set((state) => {
                state._updateHistory(state.model);
                state.model = cloneDeep(modelClear);
                state.future = [];
            });
            get().saveToLocalStorage(); // Save after clear
        },
        resetModel: () => {
            set((state) => {
                state._updateHistory(state.model);
                state.model = cloneDeep(modelExample); // Reset to example data
                state.future = [];
            });
            get().saveToLocalStorage(); // Save after reset
        },

        // --- Local Storage ---
        loadFromLocalStorage: () => {
            if (typeof window !== 'undefined') {
                const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
                if (storedData) {
                    try {
                        const parsedData = JSON.parse(storedData);
                        // Basic validation: check if it looks like our model structure
                        if (parsedData && typeof parsedData === 'object' && parsedData.userInfo) {
                            set((state) => {
                                state.model = { ...cloneDeep(modelClear), ...parsedData }; // Merge with clear model to ensure all keys exist
                                state.history = []; // Reset history on load
                                state.future = [];
                            });
                        } else {
                            console.warn("Stored data format is invalid, using default.");
                            set({ model: cloneDeep(modelExample), history: [], future: [] }); // Fallback to example or clear
                        }
                    } catch (e) {
                        console.error("Failed to parse stored resume data:", e);
                        set({ model: cloneDeep(modelExample), history: [], future: [] }); // Fallback on error
                    }
                } else {
                    // No data in local storage, load example data
                    set({ model: cloneDeep(modelExample), history: [], future: [] });
                    console.log("No data in local storage, loading example data.");
                }
                set({ isInitialized: true }); // Mark as initialized
            }
        },
        saveToLocalStorage: () => {
            if (typeof window !== 'undefined') {
                try {
                    const currentState = get().model;
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentState));
                } catch (e) {
                    console.error("Failed to save resume data to local storage:", e);
                }
            }
        },
        clearLocalStorage: () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                set({ model: cloneDeep(modelClear), history: [], future: [] }); // Also clear the store state
            }
        },
    }))
);

// Initialize store from localStorage on client-side load
if (typeof window !== 'undefined') {
    // Check if already initialized to prevent multiple loads during HMR
    if (!useResumeStore.getState().isInitialized) {
        useResumeStore.getState().loadFromLocalStorage();
    }
}