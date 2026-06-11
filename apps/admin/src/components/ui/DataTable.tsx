const DataTable = ({ columns, rows, renderMobileCard }) => (
  <>
    <div className="hidden overflow-x-auto rounded-[1rem] border border-line bg-white shadow-sm xl:block">
      <table className="min-w-full divide-y divide-line">
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
          {rows.map((row) => (
            <tr key={row.id} className="transition hover:bg-primary-light/70">
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
      {rows.map((row) => renderMobileCard(row))}
    </div>
  </>
);

export default DataTable;
