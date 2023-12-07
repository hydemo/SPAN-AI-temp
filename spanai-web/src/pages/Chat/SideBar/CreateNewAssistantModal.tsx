import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import cookies from 'js-cookie';

import {
  AssistantFormValue,
  addAssistants,
} from '@/services/apiList/assistants';
import { baseURL } from '@/utils/config';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refreshChats: () => void;
  onSetSelectedChatId: (id: string) => void;
};

const getUserInfo = () => {
  const result = cookies.get('web_userinfo');
  if (!result) {
    return {};
  }
  try {
    return JSON.parse(result);
  } catch (error) {
    return {};
  }
};

export const CreateNewAssistantModal = ({
  open,
  onOpenChange,
  refreshChats,
  onSetSelectedChatId,
}: Props) => {
  const token = cookies.get('web_access_token');

  const userInfo = getUserInfo();

  const handleFinish = async (values: AssistantFormValue) => {
    const submitData = {
      ...values,
      files: values.files.map((filename: any) => {
        return {
          filename: filename.response,
          name: `${userInfo?.username}_${filename.response}`,
        };
      }),
    };
    const result: any = await addAssistants(submitData);
    refreshChats();
    onSetSelectedChatId(result._id);
    onOpenChange(false);
    return;
  };

  return (
    <ModalForm
      modalProps={{ destroyOnClose: true }}
      title="创建新的助理"
      open={open}
      onFinish={handleFinish}
      onOpenChange={onOpenChange}
    >
      <ProFormText
        name="name"
        label="助理名称"
        placeholder="助理名称"
        rules={[
          {
            required: true,
            message: '助理名称',
          },
        ]}
      />
      <ProFormTextArea
        name="instructions"
        label="简介"
        placeholder="简介"
        rules={[
          {
            required: true,
            message: '简介',
          },
        ]}
      />
      <ProFormSelect
        name="model"
        label="模型"
        request={async () => [
          { label: 'gpt-4-1106-preview', value: 'gpt-4-1106-preview' },
        ]}
      />
      <ProFormUploadButton
        label="文件"
        name="files"
        action={`${baseURL}/assistants/upload`}
        max={5}
        fieldProps={{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }}
      />
      <ProFormSelect
        name="tools"
        label="工具集"
        mode="multiple"
        request={async () => [
          { label: 'code_interpreter', value: 'code_interpreter' },
          { label: 'retrieval', value: 'retrieval' },
        ]}
      />
    </ModalForm>
  );
};
