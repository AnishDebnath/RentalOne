import type { PropsWithChildren } from 'react';

const Table = ({ children }: PropsWithChildren) => (
  <div className="overflow-hidden rounded-[24px] border border-line bg-white shadow-card">
    <table className="min-w-full divide-y divide-line text-left text-sm">
      {children}
    </table>
  </div>
);

export default Table;
