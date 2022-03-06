import { useLazyQuery } from "@apollo/client";
import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Column } from "react-table";
import { Soldier } from "type-graphql";
import InfiniteTable from "../components/InfiniteTable";
import SoldierSearch from "../components/SoldierSearch";
import TableStats from "../components/TableStats";
import { soldiersQuery } from "../graphql/soldiersQuery";
import "../table.less";
import "./newcomers.less";

const PAGE_SIZE = 50;

const Newcomers = () => {
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);

  const [fetchSoldiers, fetchSoldiersResponse] =
    useLazyQuery<{ soldiers: Soldier[] }>(soldiersQuery);

  useEffect(() => {
    console.log("fired");
    fetchSoldiers({
      variables: {
        orderBy: {
          seglNo: "asc",
        },
        take: 50,
      },
    });
  }, [fetchSoldiers]);

  useEffect(() => {
    if (fetchSoldiersResponse.data?.soldiers) {
      const { soldiers } = fetchSoldiersResponse.data;
      setSoldiers((prev) => [...prev, ...soldiers]);
    }
  }, [fetchSoldiersResponse.data]);

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

  const fetchMore = useCallback(() => {
    fetchSoldiers({
      variables: {
        orderBy: {
          seglNo: "asc",
        },
        cursor: {
          militaryNo: soldiers[soldiers.length - 1].militaryNo,
        },
        skip: 1,
        take: PAGE_SIZE,
      },
    });
  }, [fetchSoldiers, soldiers]);

  if (!soldiers.length) return null;
  return (
    <div className="newcomers__container">
      <SoldierSearch />
      <InfiniteTable
        autoPaginate
        pageSize={PAGE_SIZE}
        columns={columns}
        rows={soldiers}
        onScrollHitLast={fetchMore}
        searchValue={""}
        setRowClassName={(row) =>
          `${row.original.status?.id === 1 ? "mawkef-teby" : ""} ${
            row.original.status?.id === 2 ? "raft-teby" : ""
          }`
        }
      />
      <TableStats
        filteredMawkef={soldiers.filter((sol) => sol.status?.id === 1).length}
        filteredRaft={soldiers.filter((sol) => sol.status?.id === 2).length}
        filteredSoldiers={soldiers.length}
        marhla={20221}
      />
    </div>
  );
};

export default Newcomers;
