import { useColorScheme } from 'nativewind';
import { createContext, ReactNode, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type Units = 'metric' | 'imperial';

interface ThemeContextProps {
  theme: {
    name: Theme;
    backgroundColor: string;
  };
  toggleTheme: () => void;
  units: Units;
  toggleUnits: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: {
    name: 'light',
    backgroundColor: '#ffffff',
  },
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

  useEffect(() => {
    if (colorScheme === 'light') {
      toggleColorScheme();
    }
  }, []);

  const theme = {
    name: (colorScheme === 'dark' ? 'dark' : 'light') as Theme,
    backgroundColor: colorScheme === 'dark' ? '#1a202c' : '#ffffff',
  };

  const toggleUnits = () => {
    setUnits((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: toggleColorScheme, units, toggleUnits }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
