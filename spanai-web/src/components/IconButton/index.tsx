import { LoadingIcon } from '../icons';
import './button.scss';

export type ButtonType = 'primary' | 'danger' | null;

type Props = {
  onClick?: () => void;
  icon?: JSX.Element;
  type?: ButtonType;
  text?: string;
  bordered?: boolean;
  shadow?: boolean;
  className?: string;
  title?: string;
  disabled?: boolean;
  tabIndex?: number;
  autoFocus?: boolean;
  loading?: boolean;
};

export function IconButton({
  bordered,
  shadow,
  className,
  type,
  onClick,
  title,
  disabled,
  tabIndex,
  autoFocus,
  icon,
  text,
  loading,
}: Props) {
  return (
    <button
      type="button"
      className={
        'icon-button' +
        ` ${bordered && 'border'} ${shadow && 'shadow'} ${
          className ?? ''
        } clickable ${type ?? ''}`
      }
      onClick={onClick}
      title={title}
      disabled={disabled || loading}
      role="button"
      tabIndex={tabIndex}
      autoFocus={autoFocus}
    >
      {icon && (
        <div
          className={'icon-button-icon' + ` ${type === 'primary' && 'no-dark'}`}
        >
          {icon}
        </div>
      )}

      {text && <div className={'icon-button-text'}>{text}</div>}
    </button>
  );
}
