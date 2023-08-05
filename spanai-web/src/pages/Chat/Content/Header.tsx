import { IconButton } from '@/components/IconButton';

type Props = {
  topic: string;
  messages?: any[];
};

export const Header = ({ topic = '新的聊天', messages }: Props) => {
  if (!messages) {
    return;
  }

  return (
    <div className="window-header" data-tauri-drag-region>
      <div className="window-header-title chat-body-title">
        <div
          className="window-header-main-title chat-body-main-title"
          // onClickCapture={() => setIsEditingMessage(true)}
        >
          {topic}
        </div>
        <div className="window-header-sub-title">
          共 {messages.length} 条对话
        </div>
      </div>
      <div className="window-actions">
        {/* {isMobile && (
          <div className="window-action-button">
            <IconButton
              icon={config.tightBorder ? <MinIcon /> : <MaxIcon />}
              bordered
              onClick={() => {
                config.update(
                  (config) => (config.tightBorder = !config.tightBorder),
                );
              }}
            />
          </div>
        )} */}
      </div>
    </div>
  );
};
