import { ReactElement, PropsWithChildren } from "react";
import { useTable, TableOptions, useSortBy } from "react-table";
import { Table } from "@mantine/core";
import { ArrowUp, ArrowDown } from "phosphor-react";

export interface ReactTableProps<T extends Record<string, unknown>>
  extends TableOptions<T> {
  onRowClick?: (data: T) => void;
}

export function ReactTable<T extends Record<string, unknown>>(
  props: PropsWithChildren<ReactTableProps<T>>
): ReactElement {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        ...props,
      },
      useSortBy
    );

  // Render the UI for your table
  return (
    <Table highlightOnHover {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                {/* Add a sort direction indicator */}
                <span>
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <ArrowDown />
                    ) : (
                      <ArrowUp />
                    )
                  ) : (
                    ""
                  )}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps({
                onClick: (e, t) => {
                  props.onRowClick ? props.onRowClick(row.original) : return;
                },
                style: {
                  cursor: props.onRowClick ? "pointer" : "default"
                },
              })}
            >
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps({
                      style: {
                        minWidth: cell.column.minWidth,
                        width: cell.column.width,
                      },
                    })}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
