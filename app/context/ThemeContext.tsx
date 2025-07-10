import { useColorScheme } from 'nativewind';
import { createContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};