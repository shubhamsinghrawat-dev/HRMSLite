import { HiOutlineInbox } from 'react-icons/hi';

export default function Table({ columns, data, loading, emptyMessage = 'No data available', emptyIcon: EmptyIcon = HiOutlineInbox }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-zinc-900/5 overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-zinc-50/50 border-b border-zinc-100" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 border-b border-zinc-100 last:border-0">
              <div className="flex items-center px-6 py-3 gap-4">
                <div className="h-8 w-8 bg-zinc-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-zinc-200 rounded w-3/4" />
                  <div className="h-2 bg-zinc-100 rounded w-1/2" />
                </div>
                <div className="h-6 bg-zinc-200 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-zinc-900/5 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-100 rounded-lg mb-4">
          <EmptyIcon className="w-8 h-8 text-zinc-400" />
        </div>
        <h3 className="text-base font-medium text-zinc-700 mb-1">No Data Found</h3>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-zinc-900/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-zinc-50/60 border-b border-zinc-100">
              {columns.map((column, idx) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wide ${idx === 0 ? 'pl-6' : ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="hover:bg-zinc-50/50 transition-colors duration-150"
              >
                {columns.map((column, colIdx) => (
                  <td
                    key={column.key}
                    className={`px-6 py-3 ${colIdx === 0 ? 'pl-6' : ''}`}
                  >
                    <div className="text-sm text-zinc-700">
                      {column.render ? column.render(row) : row[column.key]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-zinc-50/40 border-t border-zinc-100">
        <p className="text-xs text-zinc-400">
          Showing <span className="font-medium text-zinc-600">{data.length}</span> {data.length === 1 ? 'record' : 'records'}
        </p>
      </div>
    </div>
  );
}
