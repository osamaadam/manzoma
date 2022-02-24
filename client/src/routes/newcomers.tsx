import { useQuery } from "@apollo/client";
import { Input } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Column,
  useAsyncDebounce,
  useBlockLayout,
  useGlobalFilter,
  useSortBy,
  useTable,
} from "react-table";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";
import { soldiersQuery } from "src/graphql/soldiersQuery";
import { Soldier } from "type-graphql";

const Newcomers = () => {
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const { data } = useQuery<{ soldiers: Soldier[] }>(soldiersQuery, {
    variables: {
      orderBy: {
        seglNo: "asc",
      },
    },
  });

  useEffect(() => {
    if (data?.soldiers) {
      setSoldiers(data.soldiers);
      console.log(data.soldiers);
    }
  }, [data]);

  const columns: Column<Soldier>[] = useMemo(
    (): Column<Soldier>[] => [
      {
        Header: "رقم السجل",
        accessor: "seglNo",
      },
      {
        Header: "الاسم",
        accessor: "name",
      },
      {
        Header: "الرقم العسكري",
        accessor: "militaryNo",
      },
      {
        Header: "المحافظة",
        accessor: (record) => record.center?.gov?.name,
      },
      {
        Header: "القسم/المركز",
        accessor: (record) => record.center?.name,
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // @ts-ignore
    setGlobalFilter,
  } = useTable(
    {
      data: soldiers,
      columns,
    },
    useGlobalFilter,
    useSortBy,
    useBlockLayout
  );

  const onSearchChange = useAsyncDebounce((val) => setGlobalFilter(val), 300);

  const RenderRow = useCallback(
    ({ index }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <tr {...row.getRowProps()}>
          {row.cells.map((cell) => (
            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
          ))}
        </tr>
      );
    },
    [prepareRow, rows]
  );

  return (
    <>
      <Input.Search
        placeholder="بحث"
        onChange={(e) => {
          const val = e.target.value;
          onSearchChange(val);
        }}
      />
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((group) => (
            <tr {...group.getHeaderGroupProps()}>
              {group.headers.map((col) => (
                // @ts-ignore
                <th {...col.getHeaderProps(col.getSortByToggleProps())}>
                  {col.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          <AutoSizer>
            {({ height, width }) => {
              console.log({ height, width });
              return (
                <VariableSizeList
                  height={height + 100}
                  itemCount={rows.length}
                  itemSize={() => 35}
                  direction="rtl"
                  width={width}
                >
                  {RenderRow}
                </VariableSizeList>
              );
            }}
          </AutoSizer>
        </tbody>
      </table>
    </>
  );
};

export default Newcomers;
