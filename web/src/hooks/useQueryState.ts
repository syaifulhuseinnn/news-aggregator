import { useNavigate } from "@tanstack/react-router";

export function useQueryState<T extends Record<string, any>, K extends keyof T>(
  key: K,
  value: T[K] | undefined
): [
  T[K] | undefined,
  (v: T[K] | undefined, opts?: { replace?: boolean }) => void,
] {
  const navigate = useNavigate();
  const setValue = (v: T[K] | undefined, opts?: { replace?: boolean }) => {
    navigate({
      search: (prev: T) => {
        const next = { ...prev };
        if (v === undefined || v === ("" as any)) delete next[key];
        else next[key] = v;
        return next;
      },
      replace: opts?.replace,
    });
  };
  return [value, setValue];
}
