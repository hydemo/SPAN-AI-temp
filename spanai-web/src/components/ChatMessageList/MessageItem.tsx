type Props = { data: MessageInfo };

export const MessageItem = ({ data: { role, content, date } }: Props) => {
  const isUser = role === "user";

  return (
    <div className={isUser ? "chat-message-user" : "chat-message"}>
      <div className="chat-message-container">
        <div className="chat-message-item">{content}</div>
        <div className="chat-message-action-date">{date?.toLocaleString()}</div>
      </div>
    </div>
  );
};
