import { useCallback, useEffect, useRef, useState } from 'react';

export function useScrollToBottom() {
  // for auto-scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollToBottom = useCallback(() => {
    const dom = scrollRef.current;
    if (dom) {
      requestAnimationFrame(() => dom.scrollTo(0, dom.scrollHeight));
    }
  }, []);

  // auto scroll
  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  });

  return {
    scrollRef,
    autoScroll,
    setAutoScroll,
    scrollToBottom,
  };
}
