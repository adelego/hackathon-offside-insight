import { useEffect } from "react";
import { useAsyncFn } from "./useAsyncFn";

export function useAsync(fn, deps = []) {
  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true,
  });

  useEffect(() => {
    callback();
  }, [callback]);

  return state;
}
