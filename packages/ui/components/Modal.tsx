import type { PropsWithChildren } from 'react';

type ModalProps = PropsWithChildren<{
  open: boolean;
  title?: string;
}>;

const Modal = ({ children, open, title }: ModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
      <div className="w-full max-w-lg rounded-[28px] border border-line bg-white p-6 shadow-card">
        {title ? <h2 className="text-lg font-semibold text-ink">{title}</h2> : null}
        <div className={title ? 'mt-4' : ''}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
