import type { InputHTMLAttributes } from 'react';

const Input = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full border-0 bg-transparent p-0 text-sm focus:ring-0 ${className}`.trim()}
    {...props}
  />
);

export default Input;
