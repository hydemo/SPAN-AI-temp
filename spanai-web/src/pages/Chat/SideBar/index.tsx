import { UploadOutlined } from '@ant-design/icons';
import { useLocalStorageState } from 'ahooks';
import moment from 'moment';
import { useMemo, useState } from 'react';

import { SortRuleSelect } from './SortRuleSelect';
import { UploadFile } from './UploadFile';
import { useDragSidebar } from './useDragSidebar';

import { ChatList } from '@/components/ChatList';
import { IconButton } from '@/components/IconButton';
import { AddIcon, DragIcon } from '@/components/icons';
import { SortRule } from '@/constant';
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
  const [sortRule, setSortRule] = useLocalStorageState('chat-sort-rule', {
    defaultValue: SortRule.Created,
  });
  console.log(sortRule);
  const shouldNarrow = false;

  const { onDragMouseDown } = useDragSidebar();

  const handleCreateNewChat = async () => {
    await newChats();
    refreshChats();
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
    <div className="sidebar">
      <div className="sidebar-header-bar">
        <SortRuleSelect sortRule={sortRule} onSortRuleChange={setSortRule} />
      </div>

      <div className="sidebar-body">
        <ChatList
          chatId={chatId}
          sortRule={sortRule}
          // narrow={shouldNarrow}
          data={sortedData}
          onSetSelectedChatId={onSetSelectedChatId}
        />
      </div>
      <div className="sidebar-tail">
        <div className="sidebar-actions">
          <UploadFile />
        </div>
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
