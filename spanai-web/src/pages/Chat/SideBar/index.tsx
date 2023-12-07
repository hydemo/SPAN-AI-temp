import { useLocalStorageState, useResponsive } from 'ahooks';
import moment from 'moment';
import { useMemo, useState } from 'react';

import { ChatTypeSelect } from './ChatTypeSelect';
import { CreateNewAssistantModal } from './CreateNewAssistantModal';
import { SortRuleSelect } from './SortRuleSelect';
import { UploadFile } from './UploadFile';
import { useDragSidebar } from './useDragSidebar';

import { ChatList } from '@/components/ChatList';
import { IconButton } from '@/components/IconButton';
import { AddIcon, DragIcon } from '@/components/icons';
import { ChatType, SortRule } from '@/constant';

type Props = {
  visible: boolean;
  chatId: string;
  chatsData: any[];
  chatType?: ChatType;
  onChangeChatType: (chatType: ChatType) => void;
  refreshChats: () => void;
  onSetSelectedChatId: (chatId: string) => void;
  onSetMobileSideBarVisible: (value: boolean) => void;
};

export const SideBar = ({
  visible,
  chatId,
  chatsData,
  chatType,
  onSetSelectedChatId,
  onSetMobileSideBarVisible,
  onChangeChatType,
  refreshChats,
}: Props) => {
  const [sortRule, setSortRule] = useLocalStorageState('chat-sort-rule', {
    defaultValue: SortRule.Created,
  });
  const responsive = useResponsive();
  const isSmallDevice = !responsive.md;

  const { onDragMouseDown } = useDragSidebar();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const handleSetSelectedChatId = (id: string) => {
    onSetSelectedChatId(id);
    onSetMobileSideBarVisible(false);
  };

  const handleCreateNewChat = async () => {
    handleSetSelectedChatId('');
  };

  const handleCreateNewAssistant = () => {
    setCreateModalOpen(true);
  };

  const sortedData = useMemo(() => {
    if (!chatsData) {
      return chatsData;
    }
    return chatsData.sort((a, b) => {
      if (sortRule === SortRule.Updated) {
        return moment(b.updatedAt).valueOf() - moment(a.updatedAt).valueOf();
      }
      return moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf();
    });
  }, [chatsData, sortRule]);

  return (
    <div className={visible ? 'sidebar sidebar-show' : 'sidebar'}>
      <div className="sidebar-header-bar">
        <ChatTypeSelect
          chatType={chatType}
          onChatTypeChange={onChangeChatType}
        />
      </div>
      {/* <div className="sidebar-header-bar">
        <SortRuleSelect sortRule={sortRule} onSortRuleChange={setSortRule} />
      </div> */}

      <div className="sidebar-body">
        <ChatList
          chatId={chatId}
          sortRule={sortRule}
          // narrow={shouldNarrow}
          data={sortedData}
          onSetSelectedChatId={handleSetSelectedChatId}
        />
      </div>
      <div className="sidebar-tail">
        {!isSmallDevice && (
          <div className="sidebar-actions">
            <UploadFile />
          </div>
        )}
        {chatType === ChatType.Assistant ? (
          !isSmallDevice && (
            <IconButton
              icon={<AddIcon />}
              text="新的助理"
              shadow
              onClick={handleCreateNewAssistant}
            />
          )
        ) : (
          <IconButton
            icon={<AddIcon />}
            text="新的聊天"
            shadow
            onClick={handleCreateNewChat}
          />
        )}
      </div>
      <div
        className={'sidebar-drag'}
        onMouseDown={(e) => onDragMouseDown(e as any)}
      >
        <DragIcon />
      </div>
      <CreateNewAssistantModal
        open={isCreateModalOpen}
        onOpenChange={setCreateModalOpen}
        refreshChats={refreshChats}
        onSetSelectedChatId={onSetSelectedChatId}
      />
    </div>
  );
};
