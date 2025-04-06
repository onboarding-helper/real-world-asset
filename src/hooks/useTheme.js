import { useEffect } from 'react';

const useTheme = (theme) => {
  useEffect(() => {
    document.documentElement.classList.add(theme);

    return () => {
      document.documentElement.classList.remove(theme);
    };
  }, [theme]);
};

export default useTheme;