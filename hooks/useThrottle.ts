import { useState, useEffect, useCallback } from "react";

export function useThrottle<T, R>(callback: (value?: T) => R, delay = 100) {
  const [shouldInvoke, setShouldInvoke] = useState(true);

  useEffect(() => {
    const handler = setTimeout(() => {
      setShouldInvoke(true);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [delay]);

  const throttled = useCallback(
    async (value?: T) => {
      if (shouldInvoke) {
        setShouldInvoke(false);
        return callback(value);
      }
    },
    [callback, setShouldInvoke, shouldInvoke]
  );
  return { throttled, shouldInvoke };
}
