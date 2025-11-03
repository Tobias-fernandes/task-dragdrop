import { useEffect } from "react";

export default function useDebounce(
  fn: () => void,
  ms: number = 0,
  deps: DependencyList = []
): [() => boolean | null, () => void, () => void] {
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);

  useEffect(() => {
    reset();
  }, [reset, ...deps]);

  return [isReady, cancel, reset];
}
