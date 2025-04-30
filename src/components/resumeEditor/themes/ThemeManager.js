'use client';

import React from 'react';
// Import default theme components
import { 
  UserBasicInfoSection,
  EducationSection,
  AchievementsSection,
  ProjectsSection,
  SkillsSection,
  WorkExperienceSection
} from './defaultTheme';

// Import Theme2 components
import { Theme2UserBasicInfoSection, Theme2EducationSection } from './theme2';

// Mapping of component types to their theme-specific implementations
const THEME_COMPONENTS = {
  // Default theme (theme1)
  'default': {
    UserBasicInfoSection: UserBasicInfoSection,
    EducationSection: EducationSection,
    AchievementsSection: AchievementsSection,
    ProjectsSection: ProjectsSection,
    SkillsSection: SkillsSection,
    WorkExperienceSection: WorkExperienceSection
  },
  // Theme2
  'theme2': {
    UserBasicInfoSection: Theme2UserBasicInfoSection,
    EducationSection: Theme2EducationSection,
    // Fallbacks to default theme will be handled by getThemeComponent
    AchievementsSection: AchievementsSection,
    ProjectsSection: ProjectsSection,
    SkillsSection: SkillsSection,
    WorkExperienceSection: WorkExperienceSection
  }
  // Additional themes can be added here
};

/**
 * Get a specific component for the current theme
 * 
 * @param {string} componentName - The name of the component to get
 * @param {string} themeName - The name of the theme to use
 * @returns {React.Component} The theme-specific component
 */
export const getThemeComponent = (componentName, themeName = 'default') => {
  // If the theme doesn't exist, fall back to the default theme
  const theme = THEME_COMPONENTS[themeName] || THEME_COMPONENTS.default;
  
  // If the component doesn't exist in the theme, fall back to the default theme's component
  return theme[componentName] || THEME_COMPONENTS.default[componentName];
};

/**
 * Higher-order component that provides a theme-specific component
 * 
 * @param {string} componentName - The name of the component to use
 * @param {string} themeName - The theme to use
 * @returns {React.Component} A wrapped component that uses the theme-specific implementation
 */
export const withTheme = (componentName, themeName = 'default') => {
  // Get the appropriate component for the theme
  const ThemeComponent = getThemeComponent(componentName, themeName);
  
  // Return a component that passes through all props
  return (props) => <ThemeComponent {...props} />;
};

// Export available themes for selection
export const AVAILABLE_THEMES = Object.keys(THEME_COMPONENTS);

export default {
  getThemeComponent,
  withTheme,
  AVAILABLE_THEMES
};
