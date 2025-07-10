import { useColorScheme } from 'nativewind';
import { createContext, ReactNode, useState } from 'react';

type Theme = 'light' | 'dark';
type Units = 'metric' | 'imperial';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  units: Units;
  toggleUnits: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  toggleTheme: () => {},
  units: 'metric',
  toggleUnits: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [units, setUnits] = useState<Units>('metric');

  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  const toggleUnits = () => {
    setUnits((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: toggleColorScheme, units, toggleUnits }}>
      {children}
    </ThemeContext.Provider>
  );
};