import { useQuery } from "@apollo/client";
import { DateTime } from "luxon";
import { useMemo, useRef } from "react";
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
  const { data, fetchMore, refetch } = useQuery<{
    soldiers: Soldier[];
    groupBySoldier: { _count: { militaryNo: number }; statusId: number }[];
  }>(soldiersQuery, {
    variables: {
      take: PAGE_SIZE,
      orderBy: {
        seglNo: "asc",
      },
    },
    onError: (err) => console.error(err),
  });
  const filterDebounceRef = useRef<NodeJS.Timeout>();

  const filterSoldiers = (variables: any) => {
    if (filterDebounceRef.current) clearTimeout(filterDebounceRef.current);
    filterDebounceRef.current = setTimeout(() => refetch(variables), 500);
  };

  const clearFilter = () => {
    console.log("triggered");
    refetch({
      take: PAGE_SIZE,
      orderBy: {
        seglNo: "asc",
      },
      where: undefined,
    });
  };

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
        id: "gov",
        accessor: (record) => record.center?.gov?.name,
      },
      {
        Header: "القسم/المركز",
        id: "center",
        accessor: (record) => record.center?.name,
      },
      {
        Header: "المؤهل",
        id: "qualification",
        accessor: (record) => record.qualification?.name,
      },
      {
        Header: "الاتجاه",
        id: "etgah",
        accessor: (record) =>
          record.tawzea?.unit?.etgah?.name ?? record.predefinedEtgah?.name,
      },
      {
        Header: "الوحدة",
        id: "unit",
        accessor: (record) => record.tawzea?.unit?.name ?? "بدون توزيع",
      },
      {
        Header: "التخصص",
        id: "specialization",
        accessor: (record) =>
          record.tawzea?.specialization?.name ?? "بدون تخصص",
      },
      {
        Header: "الموقف",
        id: "status",
        accessor: (record) => record.status?.name ?? "بدون",
      },
      {
        Header: "تاريخ الإلحاق",
        id: "registerationDate",
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

  if (!data?.soldiers) return null;
  return (
    <div className="newcomers__container">
      <SoldierSearch
        marhla={20221}
        filterSoldiers={filterSoldiers}
        clearFilter={clearFilter}
      />
      <InfiniteTable
        autoPaginate
        pageSize={PAGE_SIZE}
        columns={columns}
        rows={data.soldiers}
        onScrollHitLast={() =>
          fetchMore({
            variables: {
              orderBy: {
                seglNo: "asc",
              },
              cursor: {
                militaryNo: data.soldiers[data.soldiers.length - 1].militaryNo,
              },
              skip: 1,
              take: PAGE_SIZE,
            },
          })
        }
        searchValue={""}
        setRowClassName={(row) =>
          `${row.original.status?.id === 1 ? "mawkef-teby" : ""} ${
            row.original.status?.id === 2 ? "raft-teby" : ""
          }`
        }
      />
      <TableStats
        filteredMawkef={
          data.groupBySoldier.find((agg) => agg.statusId === 1)?._count
            .militaryNo
        }
        filteredRaft={
          data.groupBySoldier.find((agg) => agg.statusId === 2)?._count
            .militaryNo
        }
        filteredSoldiers={data.groupBySoldier.reduce(
          (prev, agg) => prev + agg._count.militaryNo,
          0
        )}
        marhla={20221}
      />
    </div>
  );
};

export default Newcomers;
