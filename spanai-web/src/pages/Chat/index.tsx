import { usePrevious, useRequest, useResponsive } from 'ahooks';
import cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { history } from 'umi';

import { Content } from './Content';
import { SideBar } from './SideBar';

import { getChats } from '@/services/apiList/chat';

export default function Chat() {
  const { data: chatsData, refresh: refreshChats } = useRequest(async () => {
    const result = await getChats();
    return result?.reverse();
  });

  const [selectedChatId, setSelectedChatId] = useState('');
  const previousChatsData = usePrevious(chatsData);

  const responsive = useResponsive();
  const isSmallDevice = !responsive.md;

  const shouldShowSideBar = !Boolean(selectedChatId) && isSmallDevice;

  useEffect(() => {
    const token = cookies.get('web_access_token');
    if (!token) {
      return history.push('/login');
    }

    const previousChatsDataLength = previousChatsData?.length || 0;

    if (isSmallDevice && previousChatsDataLength === 0) {
      return;
    }
    if (chatsData?.length > previousChatsDataLength) {
      setSelectedChatId(chatsData[0]?._id);
    }
  }, [chatsData, previousChatsData]);

  return (
    <>
      <SideBar
        visible={shouldShowSideBar}
        chatId={selectedChatId}
        onSetSelectedChatId={setSelectedChatId}
        chatsData={chatsData}
        refreshChats={refreshChats}
      />
      <Content
        chatId={selectedChatId}
        refreshChats={refreshChats}
        clearSelectedChatId={() => setSelectedChatId('')}
      />
    </>
  );
}
