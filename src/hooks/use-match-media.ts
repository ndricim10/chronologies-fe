import { useEffect, useMemo, useState } from 'react';

export const useMatchMedia = () => {
  const mediaQuery = useMemo(() => '(max-width:768px)', []);

  const [isMatching, setIsMatching] = useState(true);

  useEffect(() => {
    const watcher = window.matchMedia(mediaQuery);
    setIsMatching(watcher.matches);
    const listener = (matches: MediaQueryListEvent) => {
      setIsMatching(matches.matches);
    };
    if (watcher.addEventListener) {
      watcher.addEventListener('change', listener);
    } else {
      watcher.addListener(listener);
    }
    return () => {
      if (watcher.removeEventListener) {
        return watcher.removeEventListener('change', listener);
      } else {
        return watcher.removeListener(listener);
      }
    };
  }, [mediaQuery]);

  return isMatching;
};
