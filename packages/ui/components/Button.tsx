import { memo, type ButtonHTMLAttributes, type PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary';
    fullWidth?: boolean;
  }
>;

const Button = ({
  children,
  className = '',
  fullWidth = true,
  variant = 'primary',
  ...props
}: ButtonProps) => (
  <button
    className={`${variant === 'secondary' ? 'secondary-button' : 'primary-button'} ${fullWidth ? 'w-full' : ''
      } ${className}`.trim()}
    {...props}
  >
    {children}
  </button>
);

export default memo(Button);
