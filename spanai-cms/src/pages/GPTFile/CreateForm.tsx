import {
  ModalForm,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';

import { getAdminToken } from '../../utils/authority';

import { baseURL } from '@/utils/config';

type FormProps = {
  onCancel: () => void;
  onFinish: (values: any) => void;
  visible: boolean;
};

export default (props: FormProps) => {
  const { onFinish, onCancel, visible } = props;
  const token = getAdminToken();
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
        label="文件名称"
        placeholder="文件名称"
        rules={[
          {
            required: true,
            message: '文件名称',
          },
        ]}
      />
      <ProFormUploadButton
        label="文件"
        name="filename"
        action={`${baseURL}/gptFiles/upload`}
        max={1}
        fieldProps={{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }}
      />
    </ModalForm>
  );
};
