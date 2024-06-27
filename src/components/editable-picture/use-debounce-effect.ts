import { useEffect, DependencyList } from 'react';

export function useDebounceEffect(fn: (...deps: any) => void, waitTime: number, deps?: DependencyList) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.call(undefined, ...(deps || []));
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, [deps, fn, waitTime]);
}
