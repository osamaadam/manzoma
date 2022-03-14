import { useQuery } from "@apollo/client";
import { Input, Select } from "antd";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { availableOptsQuery } from "../graphql/availableOpts.query";
import { useAppSelector } from "../redux/hooks";
import "./soldier-search.less";

const FREE_SEARCH_MODES: SearchMode[] = ["name", "seglNo", "militaryNo"];

interface Opt {
  id: number;
  name: string;
}

type SearchMode =
  | "name"
  | "seglNo"
  | "militaryNo"
  | "qualification"
  | "etgah"
  | "tawzea"
  | "gov"
  | "center"
  | "registerationDate"
  | "status";

interface Props {
  filterSoldiers: (variables: any) => void;
  clearFilter: () => void;
}

const SoldierSearch: FC<Props> = ({ clearFilter, filterSoldiers }) => {
  const [searchMode, setSearchMode] = useState<SearchMode>("name");
  const [searchOpts, setSearchOpts] = useState<Opt[]>([]);
  const marhla = useAppSelector(({ global }) => global.marhla);

  const { data, loading, refetch } = useQuery<{
    availableUnits: Opt[];
    availableGovs: Opt[];
    availableCenters: Opt[];
    availableQualifications: Opt[];
    availableStatuses: Opt[];
    etgahs: Opt[];
  }>(availableOptsQuery, {
    variables: {
      marhla,
    },
  });

  useEffect(() => {
    refetch({ marhla });
  }, [marhla, refetch]);

  useEffect(() => {
    if (data) {
      const {
        availableCenters,
        availableGovs,
        availableQualifications,
        availableUnits,
        availableStatuses,
        etgahs,
      } = data;

      switch (searchMode) {
        case "center":
          setSearchOpts(availableCenters);
          break;
        case "gov":
          setSearchOpts(availableGovs);
          break;
        case "qualification":
          setSearchOpts(availableQualifications);
          break;
        case "tawzea":
          setSearchOpts(availableUnits);
          break;
        case "etgah":
          setSearchOpts(etgahs);
          break;
        case "status":
          setSearchOpts(availableStatuses);
          break;
        default:
          break;
      }
    }
  }, [data, searchMode]);

  return (
    <section className="soldier-search__container">
      {FREE_SEARCH_MODES.includes(searchMode) ? (
        <Input
          autoFocus
          addonBefore={
            <ModeSelect searchMode={searchMode} setSearchMode={setSearchMode} />
          }
          allowClear
          onChange={(e) => {
            const { value } = e.target;
            if (value.trim().length) {
              let variables: any = {
                take: undefined,
              };
              switch (searchMode) {
                case "name":
                  variables.where = {
                    name: {
                      contains: value,
                    },
                  };
                  break;
                case "seglNo":
                  variables.where = {
                    seglNo: {
                      equals: +value,
                    },
                  };
                  break;
                case "militaryNo":
                  variables.where = {
                    militaryNo: {
                      contains: value,
                    },
                  };
                  break;
                default:
                  break;
              }
              filterSoldiers(variables);
            } else {
              clearFilter();
            }
          }}
        />
      ) : (
        <DoubleSelect
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          className="soldier-search__grp-container"
        >
          <Select
            loading={loading}
            showSearch
            allowClear
            className="soldier-search__flex-dropdown"
            onClear={() => clearFilter()}
            onSelect={(_, { key }) => {
              let variables: any = {};
              switch (searchMode) {
                case "qualification":
                  variables.where = {
                    qualificationId: {
                      equals: Number(key),
                    },
                  };
                  break;
                case "etgah":
                  variables.where = {
                    OR: [
                      {
                        tawzea: {
                          is: {
                            unit: {
                              is: {
                                etgah: { is: { id: { equals: Number(key) } } },
                              },
                            },
                          },
                        },
                      },
                      {
                        AND: [
                          { tawzea: { is: null } },
                          { predefinedEtgahId: { equals: Number(key) } },
                        ],
                      },
                    ],
                  };
                  break;
                case "gov":
                  variables.where = {
                    center: {
                      is: {
                        govId: {
                          equals: Number(key),
                        },
                      },
                    },
                  };
                  break;
                case "center":
                  variables.where = {
                    centerId: {
                      equals: Number(key),
                    },
                  };
                  break;
                case "tawzea":
                  if (Number(key) !== 0)
                    variables.where = {
                      tawzea: {
                        is: {
                          unitId: {
                            equals: Number(key),
                          },
                        },
                      },
                    };
                  else
                    variables.where = {
                      tawzea: {
                        is: null,
                      },
                    };
                  break;
                case "status":
                  if (Number(key) !== 0)
                    variables.where = {
                      statusId: {
                        equals: Number(key),
                      },
                    };
                  else
                    variables.where = {
                      statusId: null,
                    };
                  break;
                default:
                  break;
              }

              filterSoldiers(variables);
            }}
          >
            {searchMode === "tawzea" ? (
              <Select.Option key={0} value="بدون توزيع">
                بدون توزيع
              </Select.Option>
            ) : searchMode === "status" ? (
              <Select.Option key={0} value="بدون موقف">
                بدون موقف
              </Select.Option>
            ) : null}
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
  searchMode: SearchMode;
  setSearchMode: Dispatch<SetStateAction<SearchMode>>;
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
  searchMode: SearchMode;
  setSearchMode: Dispatch<SetStateAction<SearchMode>>;
}> = ({ searchMode, setSearchMode }) => {
  const searchOptions: { value: SearchMode; displayName: string }[] = [
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
      value: "status",
      displayName: "الموقف",
    },
  ];

  return (
    <Select
      value={searchMode}
      onSelect={(val) => {
        setSearchMode(val);
      }}
      className="soldier-search__dropdown"
    >
      {searchOptions.map((opt) => (
        <Select.Option key={opt.value} value={opt.value}>
          {opt.displayName}
        </Select.Option>
      ))}
    </Select>
  );
};

export default SoldierSearch;
