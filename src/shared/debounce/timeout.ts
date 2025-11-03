import { useCallback, useEffect, useRef } from "react";

const callback = useRef(fn);

useEffect(() => {
  callback.current = fn;
}, [fn]);

const set = useCallback(() => {
  ready.current = false;
  timeout.current && clearTimeout(timeout.current);

  timeout.current = setTimeout(() => {
    ready.current = true;
    callback.current();
  }, ms);
}, [ms]);

const clear = useCallback(() => {
  ready.current = null;
  timeout.current && clearTimeout(timeout.current);
}, []);

useEffect(() => {
  set();
  return clear;
}, [set, clear]);
