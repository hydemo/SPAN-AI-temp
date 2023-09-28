import { GPTTokens } from 'gpt-tokens';
import moment from 'moment';

const checkExpired = (expired: string) => {
  const now = moment().format('YYYY-MM-DD');
  if (expired && now > expired) {
    return true;
  }
  return false;
};

const checkUserQuestionExceedLimit = (
  messages: any[],
  questionCount: number,
) => {
  return (
    messages.filter((item) => item.role === 'user').length >= questionCount
  );
};

export enum LimitError {
  IsExpired = 'isExpired',
  IsUserQuestionExceedLimit = 'isUserQuestionExceedLimit',
  IsSingleQuestionExceedLimit = 'isSingleQuestionExceedLimit',
  IsChatQuestionExceedLimit = 'isChatQuestionExceedLimit',
}

export const checkUserUsageLimitError = ({
  userUsage,
  messages,
  userInput,
}): LimitError | undefined => {
  const {
    expired,
    questionCount,
    model = 'gpt-3.5-turbo',
    singleQuestionToken,
    singleChatToken,
  } = userUsage;
  const isExpired = checkExpired(expired);
  if (isExpired) {
    return LimitError.IsExpired;
  }

  const apiMessages = messages.filter((item: any) => Boolean(item._id));

  const isUserQuestionExceedLimit = checkUserQuestionExceedLimit(
    apiMessages,
    questionCount,
  );
  if (isUserQuestionExceedLimit) {
    return LimitError.IsUserQuestionExceedLimit;
  }

  const usageInfo = new GPTTokens({
    model,
    messages: [{ content: userInput, role: 'user' }],
  });
  const userInputQuestionToken = usageInfo.promptUsedTokens;

  if (userInputQuestionToken > singleQuestionToken) {
    return LimitError.IsSingleQuestionExceedLimit;
  }

  const currentChatMessagesToken =
    (apiMessages?.[0]?.promptTokens || 0) + userInputQuestionToken;
  if (currentChatMessagesToken > singleChatToken) {
    return LimitError.IsChatQuestionExceedLimit;
  }
  return undefined;
};
