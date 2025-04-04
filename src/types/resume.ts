export interface UserInfo {
    email?: string;
    firstName?: string;
    headLine?: string;
    lastName?: string;
    linkedInURL?: string;
    phoneNumber?: string;
    websiteOrOtherProfileURL?: string;
    city?: string;
    country?: string;
}

export interface Education {
    city?: string;
    country?: string;
    degree?: string;
    description?: string;
    fieldOfStudy?: string;
    fromDate?: string;
    grade?: string;
    institutionName?: string;
    isPresent?: boolean;
    toDate?: string;
}

export interface WorkExperience {
    city?: string;
    companyName?: string;
    country?: string;
    description?: string;
    fromDate?: string;
    isPresent?: boolean;
    jobTitle?: string;
    toDate?: string;
}

export interface Project {
    city?: string;
    country?: string;
    description?: string;
    fromDate?: string;
    isPresent?: boolean;
    projectRole?: string;
    title?: string;
    toDate?: string;
}

export interface Award {
    name?: string;
    issuer?: string;
    urlToAward?: string;
    dateOfAward?: string;
    description?: string;
}

export interface Certification {
    name?: string;
    issuer?: string;
    date?: string;
    expiryDate?: string;
    url?: string;
    description?: string;
}

export interface Publication {
    name?: string;
    publisher?: string;
    url?: string;
    date?: string;
    description?: string; // Added description for consistency if needed
}

export interface Reference {
    company?: string;
    personName?: string;
    roleOfPerson?: string;
    email?: string;
    phoneNumber?: string;
    description?: string;
}

export interface Volunteering {
    name?: string;
    role?: string;
    city?: string;
    country?: string;
    fromDate?: string;
    toDate?: string;
    isPresent?: boolean; // Added isPresent for consistency
    description?: string;
}

export interface ResumeModel {
    achievements: string[]; // Or potentially string if it's a single text block
    award: Award[];
    certifications: Certification[];
    education: Education[];
    project: Project[];
    publications: Publication[];
    references: Reference[];
    skills: string[];
    summary: string;
    userInfo: UserInfo;
    volunteering: Volunteering[];
    workExperience: WorkExperience[];
}

export interface AnalysisItem {
    comment?: string;
    score?: number;
    // Specific fields for different types
    degree?: string; // education
    institutionName?: string; // education
    title?: string; // project
    companyName?: string; // workExperience
    jobTitle?: string; // workExperience
}

export interface Analysis {
    achievements?: AnalysisItem;
    education: AnalysisItem[];
    overallAnalysis?: AnalysisItem;
    project: AnalysisItem[];
    workExperience: AnalysisItem[];
    award: AnalysisItem[];
    certifications: AnalysisItem[];
    publications: AnalysisItem[];
    volunteering: AnalysisItem[];
    references: AnalysisItem[];
}

// Represents the structure used by ResumeSaver.js originally
export interface ResumeSaveData {
    [key: string]: any; // Allow any structure initially
    resumeData?: ResumeModel; // Be more specific if possible
}