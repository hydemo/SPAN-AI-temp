import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';

import { getGptFiles } from '@/services/apiList/gptFiles';

type FormProps = {
  onCancel: () => void;
  onFinish: (values: any) => void;
  visible: boolean;
};

export default (props: FormProps) => {
  const { onFinish, onCancel, visible } = props;
  return (
    <ModalForm
      title="新增"
      autoFocusFirstInput
      visible={visible}
      modalProps={{
        destroyOnClose: true,
        onCancel,
      }}
      submitTimeout={2000}
      onFinish={onFinish}
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
      <ProFormSelect
        name="files"
        label="文件集"
        mode="multiple"
        request={async (params) => {
          const res = await getGptFiles(params);
          return res.data.map((item: any) => ({
            label: item.name,
            value: item._id,
          }));
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
