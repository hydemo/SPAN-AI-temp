import { useRef } from 'react';

import {
  MAX_SIDEBAR_WIDTH,
  DEFAULT_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
} from '@/constant';

export const useDragSidebar = () => {
  const limit = (x: number) =>
    Math.max(Math.min(MAX_SIDEBAR_WIDTH, x), MIN_SIDEBAR_WIDTH);
  const startX = useRef(0);
  const startDragWidth = useRef(DEFAULT_SIDEBAR_WIDTH);
  const lastUpdateTime = useRef(Date.now());

  const handleMouseMove = useRef((e: MouseEvent) => {
    if (Date.now() < lastUpdateTime.current + 50) {
      return;
    }
    lastUpdateTime.current = Date.now();
    const d = e.clientX - startX.current;
    const nextWidth = limit(startDragWidth.current + d);
    // config.update((config) => (config.sidebarWidth = nextWidth));
    document.documentElement.style.setProperty(
      '--sidebar-width',
      String(nextWidth + 'px'),
    );
  });

  const handleMouseUp = useRef(() => {
    startDragWidth.current = DEFAULT_SIDEBAR_WIDTH;
    window.removeEventListener('mousemove', handleMouseMove.current);
    window.removeEventListener('mouseup', handleMouseUp.current);
  });

  const onDragMouseDown = (e: MouseEvent) => {
    startX.current = e.clientX;

    window.addEventListener('mousemove', handleMouseMove.current);
    window.addEventListener('mouseup', handleMouseUp.current);
  };

  return { onDragMouseDown };
};
