import { Space, Radio } from 'antd';

import { SortRule } from '@/constant';

type Props = {
  sortRule: SortRule | undefined;
  onSortRuleChange: (value: SortRule) => void;
};

export const SortRuleSelect = ({ sortRule, onSortRuleChange }: Props) => {
  const handleChange = (e: any) => {
    onSortRuleChange(e.target.value);
  };

  return (
    <>
      <Space>
        排序
        <Radio.Group value={sortRule} onChange={handleChange}>
          <Radio.Button value={SortRule.Created}>创建时间</Radio.Button>
          <Radio.Button value={SortRule.Updated}>更新时间</Radio.Button>
        </Radio.Group>
      </Space>
    </>
  );
};
