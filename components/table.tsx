import { ReactElement, PropsWithChildren, useState } from "react";
import {
  useTable,
  TableOptions,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import { Table, TextInput } from "@mantine/core";
import { ArrowUp, ArrowDown, MagnifyingGlass } from "phosphor-react";

export interface ReactTableProps<T extends Record<string, unknown>>
  extends TableOptions<T> {
  onRowClick?: (data: T) => void;
  searchable: boolean;
  selectable: boolean;
}

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <TextInput
      value={value || ""}
      icon={<MagnifyingGlass weight="bold" />}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={`Search ${count} records...`}
      style={{
        fontSize: "1.1rem",
        border: "0",
      }}
    />
  );
}

export function ReactTable<T extends Record<string, unknown>>(
  props: PropsWithChildren<ReactTableProps<T>>
): ReactElement {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { globalFilter },
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      ...props,
    },
    useGlobalFilter,
    useSortBy
  );

  // Render the UI for your table
  return (
    <>
      {props.searchable && (
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      )}
      <Table highlightOnHover={props.selectable} {...getTableProps()}>
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
                    props.onRowClick && props.onRowClick(row.original);
                  },
                  style: {
                    cursor: props.onRowClick ? "pointer" : "default",
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
    </>
  );
}
