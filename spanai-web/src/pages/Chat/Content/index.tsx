import { ChatMessageList } from "@/components/ChatMessageList";
import { ChatInput } from "./ChatInput";
import { Header } from "./Header";
import "./content.scss";

const messages: MessageInfo[] = [
  {
    role: "user",
    content: "你好",
    date: "2023-08-04 19:16:17",
  },
  {
    role: "agent",
    content: "我是 ChatGPT",
    date: "2023-08-05 19:16:17",
  },
];

export const Content = () => {
  return (
    <div className="window-content">
      <div className="chat">
        <Header
          topic="Conversation Summary: Hello Ivan Generate Title"
          messages={messages}
        />
        <div className="chat-body">
          <ChatMessageList messages={messages} />
        </div>
        <ChatInput />
      </div>
    </div>
  );
};
