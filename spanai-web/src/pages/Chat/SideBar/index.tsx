import { useDragSidebar } from './useDragSidebar';

import { ChatList } from '@/components/ChatList';
import { IconButton } from '@/components/IconButton';
import { AddIcon, DragIcon } from '@/components/icons';
import { newChats } from '@/services/apiList/chat';
type Props = {
  chatId: string;
  onSetSelectedChatId: (chatId: string) => void;
  chatsData: any[];
  refreshChats: () => void;
};

export const SideBar = ({
  chatId,
  onSetSelectedChatId,
  chatsData,
  refreshChats,
}: Props) => {
  const shouldNarrow = false;

  const { onDragMouseDown } = useDragSidebar();

  const handleCreateNewChat = async () => {
    await newChats();
    refreshChats();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-body">
        <ChatList
          chatId={chatId}
          // narrow={shouldNarrow}
          data={chatsData}
          onSetSelectedChatId={onSetSelectedChatId}
        />
      </div>
      <div className="sidebar-tail">
        <div className="sidebar-actions"></div>
        <div>
          <IconButton
            icon={<AddIcon />}
            text={shouldNarrow ? undefined : '新的聊天'}
            shadow
            onClick={handleCreateNewChat}
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
