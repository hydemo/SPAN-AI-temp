import { DeleteIcon } from '../icons';

type Props = {
  selected?: boolean;
  title: string;
  count: number;
  time: string;
};

export const ChatItem = ({ selected, title, count, time }: Props) => {
  const handleDelete = () => {};

  return (
    <div
      className={`chat-item ${selected && 'chat-item-selected'}`}
      // onClick={props.onClick}
      // ref={(ele) => {
      //   draggableRef.current = ele;
      //   provided.innerRef(ele);
      // }}
      // {...provided.draggableProps}
      // {...provided.dragHandleProps}
      // title={}
    >
      <div className={'chat-item-title'}>{title}</div>
      <div className={'chat-item-info'}>
        <div className={'chat-item-count'}>{count} 条对话</div>
        <div className={'chat-item-date'}>{time}</div>
      </div>

      <div className={'chat-item-delete'} onClickCapture={handleDelete}>
        <DeleteIcon />
      </div>
    </div>
  );
};
