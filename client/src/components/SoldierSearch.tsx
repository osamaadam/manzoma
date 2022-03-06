import { useLazyQuery } from "@apollo/client";
import { Input, Select } from "antd";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { availableGovsQuery } from "../graphql/availableGovsQuery";
import "./soldier-search.less";

const FREE_SEARCH_MODES = ["name", "seglNo", "militaryNo"];

interface Opt {
  id: number;
  name: string;
}

const SoldierSearch = () => {
  const [searchMode, setSearchMode] = useState("name");
  const [searchOpts, setSearchOpts] = useState<Opt[]>([]);

  const [fetchAvailableGovs, availableGovsResponse] =
    useLazyQuery<{ availableGovs: Opt[] }>(availableGovsQuery);

  useEffect(() => {
    switch (searchMode) {
      case "gov":
        fetchAvailableGovs({ variables: { marhla: 20221 } });
        break;
      default:
        break;
    }
  }, [fetchAvailableGovs, searchMode]);

  useEffect(() => {
    if (availableGovsResponse.data) {
      setSearchOpts(availableGovsResponse.data.availableGovs);
    }
  }, [availableGovsResponse.data]);

  return (
    <section className="soldier-search__container">
      {FREE_SEARCH_MODES.includes(searchMode) ? (
        <Input
          autoFocus
          addonBefore={
            <ModeSelect searchMode={searchMode} setSearchMode={setSearchMode} />
          }
        />
      ) : (
        <DoubleSelect
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          className="soldier-search__grp-container"
        >
          <Select
            loading={availableGovsResponse.loading}
            showSearch
            className="soldier-search__flex-dropdown"
          >
            {searchOpts.map((opt) => (
              <Select.Option key={opt.id} value={opt.name}>
                {opt.name}
              </Select.Option>
            ))}
          </Select>
        </DoubleSelect>
      )}
    </section>
  );
};

const DoubleSelect: FC<{
  searchMode: string;
  setSearchMode: Dispatch<SetStateAction<string>>;
  className?: string;
}> = ({ children, searchMode, setSearchMode, className = "" }) => {
  return (
    <Input.Group compact className={className}>
      <ModeSelect searchMode={searchMode} setSearchMode={setSearchMode} />
      {children}
    </Input.Group>
  );
};

const ModeSelect: FC<{
  searchMode: string;
  setSearchMode: Dispatch<SetStateAction<string>>;
}> = ({ searchMode, setSearchMode }) => {
  const searchOptions: { value: string; displayName: string }[] = [
    {
      value: "name",
      displayName: "الاسم",
    },
    {
      value: "seglNo",
      displayName: "رقم السجل",
    },
    {
      value: "militaryNo",
      displayName: "الرقم العسكري",
    },
    {
      value: "qualification",
      displayName: "المؤهل",
    },
    {
      value: "etgah",
      displayName: "الاتجاه",
    },
    {
      value: "tawzea",
      displayName: "التوزيع",
    },
    {
      value: "gov",
      displayName: "المحافظة",
    },
    {
      value: "center",
      displayName: "المركز / القسم",
    },
    {
      value: "registerationDate",
      displayName: "تاريخ الالتحاق",
    },
  ];

  return (
    <Select
      value={searchMode}
      onSelect={(val) => {
        console.log(val);
        setSearchMode(val);
      }}
      className="soldier-search__dropdown"
    >
      {searchOptions.map((opt) => (
        <Select.Option value={opt.value}>{opt.displayName}</Select.Option>
      ))}
    </Select>
  );
};

export default SoldierSearch;
