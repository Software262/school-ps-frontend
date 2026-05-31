/* eslint-disable */
import type { ReactNode } from "react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onSelect?: (row: any) => void;
  selectedRow?: any;
  emptyMessage?: string;
}

export function DataTable({
  columns,
  data,
  onSelect,
  selectedRow,
  emptyMessage = "No se encontraron registros",
}: DataTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {onSelect && <th className="w-12 px-4 py-3"></th>}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => {
              const isSelected = selectedRow && selectedRow.id === row.id;
              return (
                <tr
                  key={row.id || index}
                  className={`hover:bg-gray-50 transition-colors ${isSelected ? "bg-blue-50" : ""}`}
                  onClick={() => onSelect?.(row)}
                  style={{ cursor: onSelect ? "pointer" : "default" }}
                >
                  {onSelect && (
                    <td className="px-4 py-3">
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => onSelect(row)}
                        className="w-4 h-4 text-blue-600"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-3 text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
