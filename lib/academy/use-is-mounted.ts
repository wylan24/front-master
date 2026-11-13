import { useEffect, useRef } from "react";

/**
 * Lets the step-by-step animations stop cleanly when the learner
 * navigates away mid-animation.
 */
export function useIsMounted() {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
}
