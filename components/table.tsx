import { ReactElement, PropsWithChildren, useState, useCallback } from "react";
import {
  useTable,
  TableOptions,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
} from "react-table";
import {
  Select,
  Table,
  TextInput,
  Group,
  Divider,
  ActionIcon,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import {
  ArrowUp,
  ArrowDown,
  MagnifyingGlass,
  CaretLeft,
  CaretDoubleLeft,
  CaretRight,
  CaretDoubleRight,
} from "phosphor-react";

export interface ReactTableProps<T extends Record<string, unknown>>
  extends TableOptions<T> {
  onRowClick?: (data: T) => void;
  searchable: boolean;
  selectable: boolean;
  pagination: boolean;
  loading: boolean;
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
    <Group
      sx={{
        position: "sticky",
        top: 0,
        backgroundColor: "white",
      }}
    >
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
    </Group>
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
    state: { globalFilter, pageIndex, pageSize },
    // global filter
    preGlobalFilteredRows,
    setGlobalFilter,
    // pagination
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      ...props,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const RenderRow = useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className="tr"
        >
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} className="td">
                {cell.render("Cell")}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows]
  );

  const getPageRecordInfo = () => {
    const firstRowNum = pageIndex * pageSize + 1;
    // const totalRows = serverSideDataSource ? total : rows.length;
    const totalRows = rows.length;

    const currLastRowNum = (pageIndex + 1) * pageSize;
    let lastRowNum = currLastRowNum < totalRows ? currLastRowNum : totalRows;
    return `${firstRowNum} - ${lastRowNum} of ${totalRows}`;
  };

  // Render the UI for your table
  return (
    <div>
      {props.searchable && (
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      )}
      <div
        style={{
          display: "block",
          maxWidth: "100%",
          overflowX: "scroll",
          overflowY: "hidden",
        }}
      >
        <LoadingOverlay visible={props.loading} overlayOpacity={0.5} />{" "}
        <Table highlightOnHover={props.selectable} {...getTableProps()}>
          <thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
            }}
          >
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps({
                      ...column.getSortByToggleProps(),
                      style: {
                        maxWidth: column.maxWidth,
                        minWidth: column.minWidth,
                        width: column.width,
                      },
                    })}
                  >
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

          {/* <ScrollArea> */}
          <tbody {...getTableBodyProps()}>
            {props.pagination &&
              page.map((row, i) => {
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
                              maxWidth: cell.column.maxWidth,
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
            {!props.pagination &&
              rows.map((row, i) => {
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
                              maxWidth: cell.column.maxWidth,
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
          {rows.length === 0 && !props.loading && <span>no data....</span>}
          {/* </ScrollArea> */}
        </Table>
      </div>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      {props.pagination && (
        <div
          style={{
            position: "sticky",
            bottom: 0,
            backgroundColor: "white",
            paddingTop: 5,
          }}
        >
          <Group spacing="5px">
            <ActionIcon
              variant="light"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              <CaretDoubleLeft weight="bold" />
            </ActionIcon>
            <ActionIcon
              variant="light"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <CaretLeft weight="bold" />
            </ActionIcon>
            <ActionIcon
              variant="light"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              <CaretRight weight="bold" />
            </ActionIcon>
            <ActionIcon
              variant="light"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              <CaretDoubleRight weight="bold" />
            </ActionIcon>
            <Divider orientation="vertical" mx="sm" />

            <Text size="sm">
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </Text>
            <Divider orientation="vertical" mx="sm" />

            <Text size="sm">{getPageRecordInfo()}</Text>
            <Divider orientation="vertical" mx="sm" />
            <Text size="sm">Rows per page:</Text>
            <Select
              value={pageSize.toString()}
              style={{ width: "72px" }}
              onChange={(e) => {
                setPageSize(Number(e));
              }}
              data={[
                { value: "10", label: "10" },
                { value: "20", label: "20" },
                { value: "30", label: "30" },
                { value: "40", label: "40" },
                { value: "50", label: "50" },
              ]}
            />
          </Group>
        </div>
      )}
    </div>
  );
}
