import { ModalForm, ProFormSelect } from '@ant-design/pro-components';

import { getAssistants } from '@/services/apiList/assistant';
import { getUserList } from '@/services/apiList/userManagement';

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
      <ProFormSelect
        name="assistant"
        label="助理"
        request={async (params) => {
          const res = await getAssistants(params);
          return res.data.map((item: any) => ({
            label: item.name,
            value: item._id,
          }));
        }}
      />
      <ProFormSelect
        name="user"
        label="用户"
        request={async (params) => {
          const res = await getUserList(params);
          return res.data.map((item: any) => ({
            label: item.username,
            value: item._id,
          }));
        }}
      />
    </ModalForm>
  );
};
