import { memo } from 'react';

const safeRows = (rows: any) => (Array.isArray(rows) ? rows : []);

const DataTable = ({ columns, rows, renderMobileCard, visibleCount = 0 }) => {
  const data = safeRows(rows);
  const count = visibleCount ?? data.length;
  return (
    <>
      <div className="hidden overflow-x-auto rounded-[1rem] border border-line bg-white shadow-sm xl:block">
        <table className="min-w-full table-fixed divide-y divide-line">
          <thead className="bg-white/70">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-2 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-tertiary ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {data.map((row, idx) => (
              <tr key={row.id} className={`transition hover:bg-primary-light/70 ${idx < count ? 'card-entrance-row' : 'card-hidden'}`}>
                {columns.map((column) => (
                  <td key={column.key} className={`px-2 py-3 text-sm font-medium text-muted ${column.className || ''}`}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:hidden">
        {data.map((row, idx) => (
          <div key={row.id} className={idx < count ? 'card-entrance' : 'card-hidden'}>
            {renderMobileCard(row)}
          </div>
        ))}
      </div>
    </>
  );
};

export default memo(DataTable);
