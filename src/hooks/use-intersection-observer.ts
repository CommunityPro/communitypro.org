import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  once?: boolean;
}

export function useIntersectionObserver<T extends Element = Element>(options: UseIntersectionObserverOptions = {}) {
  const { once = false, threshold = 0, root = null, rootMargin = "0px" } = options;
  const ref = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([e]) => {
        setEntry(e);
        if (once && e.isIntersecting) observer.disconnect();
      },
      { threshold, root, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, root, rootMargin]);

  return { ref, entry, isIntersecting: entry?.isIntersecting ?? false };
}
