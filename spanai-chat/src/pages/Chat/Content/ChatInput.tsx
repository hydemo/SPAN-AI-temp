import { IconButton } from "@/components/IconButton";
import { SendWhiteIcon } from "@/components/icons";
import { LAST_INPUT_KEY } from "@/constant";
import { useRef, useState } from "react";
import { useDebounceEffect } from "ahooks";
import { autoGrowTextArea } from "./utils";

export const ChatInput = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState("");
  const [inputRows, setInputRows] = useState(2);

  useDebounceEffect(
    () => {
      const rows = inputRef.current ? autoGrowTextArea(inputRef.current) : 1;
      const inputRows = Math.min(20, Math.max(2, rows));
      setInputRows(inputRows);
    },
    [userInput],
    {
      wait: 100,
    },
  );

  // const { scrollRef, setAutoScroll, scrollToBottom } = useScrollToBottom();
  const onInput = (text: string) => {
    setUserInput(text);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // if ArrowUp and no userInput, fill with last input
    if (
      e.key === "ArrowUp" &&
      userInput.length <= 0 &&
      !(e.metaKey || e.altKey || e.ctrlKey)
    ) {
      setUserInput(localStorage.getItem(LAST_INPUT_KEY) ?? "");
      e.preventDefault();
      return;
    }
    // if (shouldSubmit(e) && promptHints.length === 0) {
    //   doSubmit(userInput);
    //   e.preventDefault();
    // }
  };
  return (
    <div className="chat-input-panel">
      {/* <ChatActions
        showPromptModal={() => setShowPromptModal(true)}
        scrollToBottom={scrollToBottom}
        hitBottom={hitBottom}
        showPromptHints={() => {
          // Click again to close
          if (promptHints.length > 0) {
            setPromptHints([]);
            return;
          }

          inputRef.current?.focus();
          setUserInput("/");
          onSearch("");
        }}
      /> */}
      <div className={"chat-input-panel-inner"}>
        <textarea
          ref={inputRef}
          className="chat-input"
          // placeholder={Locale.Chat.Input(submitKey)}
          onInput={(e) => onInput(e.currentTarget.value)}
          value={userInput}
          onKeyDown={onInputKeyDown}
          // onFocus={() => setAutoScroll(true)}
          // onBlur={() => setAutoScroll(false)}
          rows={inputRows}
          autoFocus
          style={{
            fontSize: 14,
          }}
        />
        <IconButton
          icon={<SendWhiteIcon />}
          text="发送"
          className="chat-input-send"
          type="primary"
          // onClick={() => doSubmit(userInput)}
        />
      </div>
    </div>
  );
};
