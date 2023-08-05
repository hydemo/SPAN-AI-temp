import { MessageItem } from "./MessageItem";

type Props = {
  messages: MessageInfo[];
};

export const ChatMessageList = ({ messages }: Props) => {
  return messages.map((message, index) => (
    <MessageItem key={index} data={message} />
  ));
};
