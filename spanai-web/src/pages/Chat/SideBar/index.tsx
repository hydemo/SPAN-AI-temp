import { useLocalStorageState, useResponsive } from 'ahooks';
import moment from 'moment';
import { useMemo } from 'react';

import { SortRuleSelect } from './SortRuleSelect';
import { UploadFile } from './UploadFile';
import { useDragSidebar } from './useDragSidebar';

import { ChatList } from '@/components/ChatList';
import { IconButton } from '@/components/IconButton';
import { AddIcon, DragIcon } from '@/components/icons';
import { SortRule } from '@/constant';

type Props = {
  visible: boolean;
  chatId: string;
  chatsData: any[];
  refreshChats: () => void;
  onSetSelectedChatId: (chatId: string) => void;
  onSetMobileSideBarVisible: (value: boolean) => void;
};

export const SideBar = ({
  visible,
  chatId,
  chatsData,
  onSetSelectedChatId,
  onSetMobileSideBarVisible,
}: Props) => {
  const [sortRule, setSortRule] = useLocalStorageState('chat-sort-rule', {
    defaultValue: SortRule.Created,
  });
  const responsive = useResponsive();
  const isSmallDevice = !responsive.md;
  const shouldNarrow = false;

  const { onDragMouseDown } = useDragSidebar();

  const handleSetSelectedChatId = (id: string) => {
    onSetSelectedChatId(id);
    onSetMobileSideBarVisible(false);
  };

  const handleCreateNewChat = async () => {
    handleSetSelectedChatId('');
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
        <SortRuleSelect sortRule={sortRule} onSortRuleChange={setSortRule} />
      </div>

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
