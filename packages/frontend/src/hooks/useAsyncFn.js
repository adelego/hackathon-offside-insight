import { useCallback, useRef, useState } from "react";
import useMountedState from "./useMountedState";

export function useAsyncFn(fn, deps, initialState = { loading: false }) {
  const lastCallId = useRef(0);
  const isMounted = useMountedState();
  const [state, set] = useState(initialState);

  const callback = useCallback((...args) => {
    const callId = ++lastCallId.current;

    if (!state.loading) {
      set((prevState) => ({ ...prevState, loading: true }));
    }

    return fn(...args).then(
      (value) => {
        isMounted() &&
          callId === lastCallId.current &&
          set({ value, loading: false });

        return value;
      },
      (error) => {
        isMounted() &&
          callId === lastCallId.current &&
          set({ error, loading: false });

        return error;
      }
    );
  }, deps);

  return [state, callback];
}
