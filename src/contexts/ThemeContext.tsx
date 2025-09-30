import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Função para obter o tema inicial (executada antes do React montar)
const getInitialTheme = (): Theme => {
  // Verifica se estamos no navegador
  if (typeof window === 'undefined') return 'light';

  // Tenta obter o tema salvo no localStorage
  const savedTheme = localStorage.getItem('theme') as Theme;
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    return savedTheme;
  }

  // Se não há tema salvo, usa a preferência do sistema
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

// Aplica o tema imediatamente ao document (evita flash)
const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;

  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    // Aplica o tema quando o componente monta (garantia adicional)
    applyTheme(theme);
  }, []);

  useEffect(() => {
    // Aplica o tema sempre que ele mudar
    applyTheme(theme);

    // Salva no localStorage
    localStorage.setItem('theme', theme);

    // Atualiza o media query listener se necessário
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Só aplica a mudança automática se o usuário não tiver escolhido um tema manualmente
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        setTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
