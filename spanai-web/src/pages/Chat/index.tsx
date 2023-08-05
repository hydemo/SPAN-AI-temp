import { usePrevious, useRequest } from 'ahooks';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (chatsData?.length > (previousChatsData?.length || 0)) {
      setSelectedChatId(chatsData[0]?._id);
    }
  }, [chatsData, previousChatsData]);

  return (
    <>
      <SideBar
        chatId={selectedChatId}
        onSetSelectedChatId={setSelectedChatId}
        chatsData={chatsData}
        refreshChats={refreshChats}
      />
      <Content chatId={selectedChatId} refreshChats={refreshChats} />
    </>
  );
}
