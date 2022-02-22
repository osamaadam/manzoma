import { useLazyQuery, useQuery } from "@apollo/client";
import { Input, Select } from "antd";
import Table, { ColumnType } from "antd/lib/table";
import { useEffect, useRef, useState } from "react";
import { soldiersQuery } from "src/graphql/soldiersQuery";
import { Soldier } from "type-graphql";

const Newcomers = () => {
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [visibleSoldiers, setVisibleSoldiers] = useState<Soldier[]>([]);
  const [searchCat, setSearchCat] = useState("name");

  const [searchSoldiers, searchSoldiersResponse] =
    useLazyQuery<{ soldiers: Soldier[] }>(soldiersQuery);
  const { data } = useQuery<{ soldiers: Soldier[] }>(soldiersQuery, {
    variables: {
      take: 10,
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

  useEffect(() => {
    if (
      searchSoldiersResponse.data?.soldiers &&
      !searchSoldiersResponse.loading
    ) {
      setVisibleSoldiers(searchSoldiersResponse.data.soldiers);
    } else {
      setVisibleSoldiers(soldiers);
    }
  }, [searchSoldiersResponse.data, searchSoldiersResponse.loading, soldiers]);

  const columns: ColumnType<Soldier>[] = [
    {
      title: "رقم السجل",
      dataIndex: "seglNo",
      key: "seglNo",
      sorter: (a, b) => a.seglNo - b.seglNo,
      defaultSortOrder: "ascend",
      align: "right",
      render: (_, record) =>
        record.seglNo.toLocaleString("ar-EG", { useGrouping: false }),
    },
    {
      title: "الاسم",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      align: "right",
    },
  ];

  const Search = () => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [searchVal, setSearchVal] = useState<string | number>("");

    const handleSearch = (val: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (val.length) {
        let searchCond = {};

        switch (searchCat) {
          case "name":
            setSearchVal(val);
            searchCond = {
              name: {
                contains: val,
              },
            };
            break;
          case "seglNo":
            setSearchVal(+val);
            searchCond = {
              seglNo: {
                equals: +val,
              },
            };
            break;
          default:
            break;
        }

        timeoutRef.current = setTimeout(() => {
          searchSoldiers({
            variables: {
              where: searchCond,
            },
          });
        }, 200);
      } else {
        setVisibleSoldiers(soldiers);
      }
    };

    return (
      <Input.Search
        autoFocus
        placeholder="الاسم"
        value={searchVal}
        loading={searchSoldiersResponse.loading}
        onChange={(e) => setSearchVal(e.currentTarget.value)}
        onSearch={(val) => handleSearch(val)}
      />
    );
  };

  return (
    <>
      <Select value={searchCat} onChange={(val) => setSearchCat(val)}>
        <Select.Option value={"name"}>الاسم</Select.Option>
        <Select.Option value={"seglNo"}>رقم السجل</Select.Option>
      </Select>
      <Search />
      <Table
        dataSource={visibleSoldiers}
        columns={columns}
        direction="rtl"
        pagination={false}
      />
    </>
  );
};

export default Newcomers;
