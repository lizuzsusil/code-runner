import { createContext, useContext, useState, ReactNode } from 'react';

interface SelectionContextType {
    selectedValue: string;
    setSelectedValue: (value: string) => void;
}

interface SelectionProviderProps {
    children: ReactNode;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: SelectionProviderProps) {
    const [selectedValue, setSelectedValue] = useState<string>('python');

    const value: SelectionContextType = {
        selectedValue,
        setSelectedValue,
    };

    return (
        <SelectionContext.Provider value={value}>
            {children}
        </SelectionContext.Provider>
    );
}

export function useSelection(): SelectionContextType {
    const context = useContext(SelectionContext);
    if (context === undefined) {
        throw new Error('useSelection must be used within a SelectionProvider');
    }
    return context;
}