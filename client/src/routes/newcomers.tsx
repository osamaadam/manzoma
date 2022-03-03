import { useQuery } from "@apollo/client";
import { Input } from "antd";
import { DateTime } from "luxon";
import { useEffect, useMemo, useRef, useState } from "react";
import InView, { useInView } from "react-intersection-observer";
import {
  Column,
  useAsyncDebounce,
  useGlobalFilter,
  useSortBy,
  useTable,
} from "react-table";
import { Soldier } from "type-graphql";
import { soldiersQuery } from "../graphql/soldiersQuery";
import "../table.less";
import "./newcomers.less";

const Newcomers = () => {
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [lastVisibleIndex, setLastVisibleIndex] = useState(1);
  const scrollingRef = useRef<HTMLDivElement>(null);
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
        accessor: (record) =>
          record.TawzeaHistory?.length
            ? record.TawzeaHistory[0]?.unit?.etgah?.name
            : record.predefinedEtgah?.name,
      },
      {
        Header: "الوحدة",
        accessor: (record) =>
          record.TawzeaHistory?.length
            ? record.TawzeaHistory[0]?.unit?.name
            : "بدون توزيع",
      },
      {
        Header: "الموقف",
        accessor: (record) => record.status?.name ?? "بدون",
      },
      {
        Header: "تاريخ الإلحاق",
        accessor: (record) =>
          DateTime.fromISO(record.registerationDate.toString()).toFormat(
            "yyyyMMdd"
          ),
        Cell: ({ value }: { value: string }) =>
          DateTime.fromFormat(value, "yyyyMMdd")
            .setLocale("ar-EG")
            .toLocaleString({ dateStyle: "long" }),
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

  const { ref, inView } = useInView({
    threshold: 0,
    root: scrollingRef.current,
    rootMargin: "500px",
  });

  const onSearchChange = useAsyncDebounce(
    (val: string) => setGlobalFilter(val.trim()),
    300
  );

  useEffect(() => {
    if (inView) setLastVisibleIndex((prev) => prev + 50);
  }, [inView]);

  if (!soldiers.length) return null;
  return (
    <div className="newcomers__container">
      <Input.Search
        autoFocus
        placeholder="بحث"
        onChange={(e) => {
          const val = e.target.value;
          onSearchChange(val);
        }}
      />
      <div ref={scrollingRef} className="newcomers__table-container">
        <div className="newcomers__table-container__inner-container">
          <table {...getTableProps()}>
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
                    <InView
                      root={scrollingRef.current}
                      rootMargin="500px"
                      threshold={0}
                      onChange={(inView) => console.log(inView)}
                    >
                      {({ inView, ref: innerRef }) => {
                        return (
                          <tr
                            {...row.getRowProps()}
                            ref={index === lastVisibleIndex ? ref : innerRef}
                            className={`${
                              row.original.status?.id === 1 ? "mawkef-teby" : ""
                            } ${
                              row.original.status?.id === 2 ? "raft-teby" : ""
                            }`}
                          >
                            {inView ? (
                              row.cells.map((cell) => (
                                <td {...cell.getCellProps()}>
                                  {cell.render("Cell")}
                                </td>
                              ))
                            ) : (
                              <td
                                style={{
                                  display: "inline-block",
                                }}
                              ></td>
                            )}
                          </tr>
                        );
                      }}
                    </InView>
                  );

                return null;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Newcomers;
