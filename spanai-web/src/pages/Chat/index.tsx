import {
  useLocalStorageState,
  usePrevious,
  useRequest,
  useResponsive,
} from 'ahooks';
import cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { history } from 'umi';

import { Content } from './Content';
import { SideBar } from './SideBar';

import { ChatType } from '@/constant';
import { getAssistants } from '@/services/apiList/assistants';
import { getChats } from '@/services/apiList/chat';

export default function Chat() {
  const [chatType, setChatType] = useLocalStorageState('chat-type', {
    defaultValue: ChatType.Conversation,
  });

  const { data: chatsData, refresh: refreshChats } = useRequest(
    async () => {
      if (chatType === ChatType.Assistants) {
        return await getAssistants();
      }
      const result = await getChats(chatType);
      return result?.reverse();
    },
    {
      refreshDeps: [chatType],
    },
  );

  const [selectedChatId, setSelectedChatId] = useState('');
  const previousChatsData = usePrevious(chatsData);

  const responsive = useResponsive();
  const isSmallDevice = !responsive.md;

  const [mobileSideBarVisible, setMobileSideBarVisible] = useState(false);

  const shouldShowSideBar = mobileSideBarVisible && isSmallDevice;

  useEffect(() => {
    const token = cookies.get('web_access_token');
    if (!token) {
      return history.push('/login');
    }

    const previousChatsDataLength = previousChatsData?.length || 0;

    if (isSmallDevice && previousChatsDataLength === 0) {
      return;
    }
    // if (chatsData?.length > previousChatsDataLength) {
    //   setSelectedChatId(chatsData[0]?._id);
    // }
  }, [chatsData, previousChatsData]);

  const handleChangeChatType = (type: ChatType) => {
    setChatType(type);
    setSelectedChatId('');
  };

  return (
    <>
      <SideBar
        visible={shouldShowSideBar}
        chatId={selectedChatId}
        chatType={chatType}
        onChangeChatType={handleChangeChatType}
        chatsData={chatsData}
        refreshChats={refreshChats}
        onSetSelectedChatId={setSelectedChatId}
        onSetMobileSideBarVisible={setMobileSideBarVisible}
      />
      <Content
        chatId={selectedChatId}
        chatType={chatType}
        refreshChats={refreshChats}
        onSetSelectedChatId={setSelectedChatId}
        onShowMobileSideBar={() => setMobileSideBarVisible(true)}
      />
    </>
  );
}
