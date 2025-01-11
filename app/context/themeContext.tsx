import { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
    theme: string;
    setTheme: (theme: string) => void;
}

interface ThemeProviderProps {
    children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<string>('androidstudio');

    const value: ThemeContextType = {
        setTheme,
        theme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}