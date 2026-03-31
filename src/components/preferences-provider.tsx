import React, { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark' | undefined;

interface PreferencesContextType {
  theme: Theme;
  updateTheme: (newTheme: Theme) => void;
}

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export const PreferencesProvider = ({
  children,
  theme,
  updateTheme,
}: PreferencesContextType & { children: React.ReactNode }) => {
  return (
    <PreferencesContext.Provider value={{ theme, updateTheme }}>
      {children}
    </PreferencesContext.Provider>
  );
};
