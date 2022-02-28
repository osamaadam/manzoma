import { useQuery } from "@apollo/client";
import { Input } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  Column,
  useAsyncDebounce,
  useGlobalFilter,
  useSortBy,
  useTable,
} from "react-table";
import { soldiersQuery } from "src/graphql/soldiersQuery";
import { Soldier } from "type-graphql";

const Newcomers = () => {
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [lastVisibleIndex, setLastVisibleIndex] = useState(1);
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
      {
        Header: "المؤهل",
        accessor: (record) => record.qualification?.name,
      },
      {
        Header: "الاتجاه",
        accessor: (record) => record.predefinedEtgah?.name,
      },
      {
        Header: "الموقف",
        accessor: (record) => record.status?.name ?? "بدون",
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
    useSortBy
  );

  const { ref, inView } = useInView();

  const onSearchChange = useAsyncDebounce((val) => setGlobalFilter(val), 300);

  useEffect(() => {
    if (inView) setLastVisibleIndex((prev) => prev + 50);
  }, [inView]);

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
          {rows.map((row, index) => {
            prepareRow(row);
            if (index <= lastVisibleIndex)
              return (
                <tr
                  {...row.getRowProps()}
                  ref={index === lastVisibleIndex ? ref : undefined}
                >
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );

            return null;
          })}
        </tbody>
      </table>
    </>
  );
};

export default Newcomers;
