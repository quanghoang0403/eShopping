import { useCallback, useEffect } from "react";
export const TIME_DELAY = 300;
const useDebounce = (effect = () => {}, dependencies, delay = TIME_DELAY) => {
  const callback = useCallback(effect, dependencies);
  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
};
export default useDebounce;
