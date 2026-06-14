import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemeMode = 'light' | 'dark' | 'cyber' | 'system';
export type ResolvedTheme = 'light' | 'dark' | 'cyber';

const STORAGE_KEY = 'mini-hot-hub-theme';

const THEME_CYCLE: ThemeMode[] = ['light', 'dark', 'cyber'];

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  isDark: boolean;
  isCyber: boolean;
  setMode: (mode: ThemeMode) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
}

function applyThemeClasses(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.classList.toggle('cyber', resolved === 'cyber');
}

function readStoredTheme(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'cyber' || stored === 'system') {
    return stored;
  }
  return 'system';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => readStoredTheme());
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    typeof window !== 'undefined' ? resolveTheme(readStoredTheme()) : 'light',
  );

  useEffect(() => {
    const next = resolveTheme(mode);
    setResolved(next);
    applyThemeClasses(next);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'system') {
      return undefined;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const next = getSystemTheme();
      setResolved(next);
      applyThemeClasses(next);
    };

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
  }, []);

  const cycleTheme = useCallback(() => {
    setModeState((current) => {
      if (current === 'system') {
        return 'light';
      }
      const idx = THEME_CYCLE.indexOf(current as (typeof THEME_CYCLE)[number]);
      const nextIdx = idx === -1 ? 0 : (idx + 1) % THEME_CYCLE.length;
      return THEME_CYCLE[nextIdx];
    });
  }, []);

  const value = useMemo(
    () => ({
      mode,
      resolved,
      isDark: resolved === 'dark',
      isCyber: resolved === 'cyber',
      setMode,
      cycleTheme,
    }),
    [mode, resolved, setMode, cycleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
