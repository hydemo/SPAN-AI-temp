import { useDragSidebar } from './useDragSidebar';

import { ChatList } from '@/components/ChatList';
import { IconButton } from '@/components/IconButton';
import { AddIcon, DragIcon } from '@/components/icons';

export const SideBar = () => {
  const shouldNarrow = false;

  const { onDragMouseDown } = useDragSidebar();

  return (
    <div className="sidebar">
      <div className="sidebar-body">
        <ChatList narrow={shouldNarrow} />
      </div>
      <div className="sidebar-tail">
        <div className="sidebar-actions"></div>
        <div>
          <IconButton
            icon={<AddIcon />}
            text={shouldNarrow ? undefined : '新的聊天'}
            shadow
          />
        </div>
      </div>
      <div
        className={'sidebar-drag'}
        onMouseDown={(e) => onDragMouseDown(e as any)}
      >
        <DragIcon />
      </div>
    </div>
  );
};
