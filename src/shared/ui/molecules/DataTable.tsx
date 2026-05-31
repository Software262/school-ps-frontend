import type { ReactNode } from "react";

interface RowBase {
  id?: string | number;
}

interface Column<TRow extends RowBase> {
  key: string;
  label: string;
  render?: (value: unknown, row: TRow) => ReactNode;
}

interface DataTableProps<TRow extends RowBase> {
  columns: Column<TRow>[];
  data: TRow[];
  onSelect?: (row: TRow) => void;
  selectedRow?: TRow;
  emptyMessage?: string;
}

export function DataTable<TRow extends RowBase>({
  columns,
  data,
  onSelect,
  selectedRow,
  emptyMessage = "No se encontraron registros",
}: DataTableProps<TRow>) {
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
              const isSelected = selectedRow?.id === row.id;

              return (
                <tr
                  key={row.id ?? index}
                  className={`hover:bg-gray-50 transition-colors ${isSelected ? "bg-blue-50" : ""}`}
                  onClick={() => {
                    onSelect?.(row);
                  }}
                  style={{ cursor: onSelect ? "pointer" : "default" }}
                >
                  {onSelect && (
                    <td className="px-4 py-3">
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => {
                          onSelect(row);
                        }}
                        className="w-4 h-4 text-blue-600"
                      />
                    </td>
                  )}
                  {columns.map((column) => {
                    const cellValue = row[column.key as keyof TRow];

                    let defaultValue: ReactNode = "";
                    if (
                      typeof cellValue === "string" ||
                      typeof cellValue === "number" ||
                      typeof cellValue === "bigint"
                    ) {
                      defaultValue = String(cellValue);
                    } else if (typeof cellValue === "boolean") {
                      defaultValue = cellValue ? "Sí" : "No";
                    }

                    return (
                      <td
                        key={column.key}
                        className="px-4 py-3 text-sm text-gray-900"
                      >
                        {column.render
                          ? column.render(cellValue, row)
                          : defaultValue}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
