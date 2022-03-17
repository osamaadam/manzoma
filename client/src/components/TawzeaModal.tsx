import { MinusCircleOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { DateTime } from "luxon";
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
import { ReceivedTawzea, Soldier, Specialization, Unit } from "type-graphql";
import { receivedTawzeasQuery } from "../graphql/receivedTawzeas.query";
import { registerTawzeaMutation } from "../graphql/registerTawzea.mutation";
import { miniSoldierQuery } from "../graphql/soldiers.query";
import { specsQuery } from "../graphql/specs.query";
import { unitsQuery } from "../graphql/units.query";
import { parseMilitaryNumber } from "../helpers/parseMilitaryNumber";
import { useAppSelector } from "../redux/hooks";
import "./tawzea-modal.less";

interface Props {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const TawzeaModal: FC<Props> = ({ isVisible, setIsVisible }) => {
  const [selectedTawzea, setSelectedTawzea] = useState<ReceivedTawzea>();
  const [form] = useForm();
  const marhla = useAppSelector((state) => state.global.marhla);
  const weaponId = useAppSelector((state) => state.global.weaponId);
  const unitSearchTimeoutRef = useRef<NodeJS.Timeout>();
  const specsSearchTimeoutRef = useRef<NodeJS.Timeout>();
  const soldiersSearchTimeoutRef = useRef<NodeJS.Timeout>();

  const [mutateTawzeas, { loading: mTawLoading }] = useMutation(
    registerTawzeaMutation
  );

  const [fetchSoldiers, { data: soldiersData, loading: soldiersLoading }] =
    useLazyQuery<{
      miniSoldiers: Soldier[];
    }>(miniSoldierQuery);

  const {
    data: rTawData,
    loading: rTawLoading,
    refetch: rTawRefetch,
  } = useQuery<{
    receivedTawzeas: ReceivedTawzea[];
  }>(receivedTawzeasQuery, {
    variables: {
      where: {
        marhla: {
          equals: marhla,
        },
      },
    },
  });

  const {
    data: unitData,
    loading: unitLoading,
    refetch: fetchUnits,
  } = useQuery<{ units: Unit[] }>(unitsQuery, { variables: { take: 50 } });

  const {
    data: specsData,
    loading: specsLoading,
    refetch: fetchSpecs,
  } = useQuery<{ specializations: Specialization[] }>(specsQuery, {
    variables: { take: 50 },
  });

  const submit = async (values: any) => mutateTawzeas({ variables: values });

  const handleUnitSearch = useCallback(
    (val: string) => {
      if (val.length) {
        if (unitSearchTimeoutRef.current)
          clearTimeout(unitSearchTimeoutRef.current);

        unitSearchTimeoutRef.current = setTimeout(
          () =>
            fetchUnits({
              take: undefined,
              where: {
                name: {
                  contains: val,
                },
              },
            }),
          500
        );
      }
    },
    [fetchUnits]
  );

  const handleSpecsSearch = useCallback(
    (val: string, militaryNo: string | number) => {
      if (val.length) {
        if (specsSearchTimeoutRef.current)
          clearTimeout(specsSearchTimeoutRef.current);

        const parsedMilitaryNo = parseMilitaryNumber(militaryNo);

        specsSearchTimeoutRef.current = setTimeout(
          () =>
            fetchSpecs({
              take: undefined,
              where: {
                AND: [
                  {
                    name: {
                      contains: val,
                    },
                  },
                  {
                    weaponId: {
                      equals: parsedMilitaryNo?.weaponId ?? weaponId,
                    },
                  },
                ],
              },
            }),
          500
        );
      }
    },
    [fetchSpecs, weaponId]
  );

  const handleSoldiersSearch = (value: string) => {
    value = value.trim();
    if (!value.length) return;
    if (soldiersSearchTimeoutRef.current)
      clearTimeout(soldiersSearchTimeoutRef.current);

    soldiersSearchTimeoutRef.current = setTimeout(
      () =>
        fetchSoldiers({
          variables: {
            where: {
              marhla: {
                equals: marhla,
              },
              seglNo: !isNaN(+value)
                ? {
                    equals: +value,
                  }
                : undefined,
              name: isNaN(+value)
                ? {
                    contains: value,
                  }
                : undefined,
            },
          },
        }),
      500
    );
  };

  return (
    <Modal
      title="إضافة توزيعات"
      visible={isVisible}
      onOk={() => form.submit()}
      onCancel={() => setIsVisible(false)}
      width={1200}
      confirmLoading={mTawLoading}
    >
      <Form
        form={form}
        name="add-tawzea"
        onFinish={submit}
        initialValues={{ tawzeas: [undefined] }}
      >
        <Form.Item
          label="التوزيعة المعنية"
          name="receivedTawzea"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            onFocus={() => rTawRefetch()}
            loading={rTawLoading}
            showSearch
            allowClear
            onSelect={(_, opt) =>
              setSelectedTawzea(
                rTawData?.receivedTawzeas.find((taw) => taw.id === opt.value)
              )
            }
          >
            {rTawData?.receivedTawzeas.map((opt) => (
              <Select.Option key={opt.id} value={opt.id}>
                {opt.displayName} (
                {DateTime.fromISO(opt.dateReceived.toString())
                  .setLocale("ar-EG")
                  .toLocaleString(DateTime.DATE_MED)}
                ) ({opt.numOfPages.toLocaleString("ar-EG")} صفحة)
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="الوحدة" name="unit" rules={[{ required: true }]}>
          <Select
            disabled={!form.getFieldValue("receivedTawzea")}
            loading={unitLoading}
            showSearch
            allowClear
            onSearch={handleUnitSearch}
            optionFilterProp="data-search"
          >
            {unitData?.units.map((unit) => (
              <Select.Option
                data-search={`${unit.name} ${unit.etgah?.name}`}
                key={unit.id}
                value={unit.id}
                title={`${unit.name} (${unit.etgah?.name})`}
              >
                {unit.name} ({unit.etgah?.name})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.List name="tawzeas">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Input.Group
                  key={`${index}-input-grp`}
                  compact
                  className="tawzea-modal__input-grp"
                >
                  <Form.Item
                    {...field}
                    name={[field.name, "militaryNo"]}
                    key={`militaryNo-${index}`}
                    className="tawzea-modal__input-grp__flex-medium-input"
                    rules={[
                      {
                        required: true,
                        message: "يرجى ادخال اسم الجندي او رقم سجله",
                      },
                    ]}
                  >
                    <Select
                      placeholder="الجندي"
                      loading={soldiersLoading}
                      showSearch
                      allowClear
                      optionFilterProp="data-search"
                      onSearch={handleSoldiersSearch}
                    >
                      {soldiersData?.miniSoldiers.map((sol) => (
                        <Select.Option
                          data-search={`${sol.name} ${sol.seglNo}`}
                          key={`${index}-${sol.militaryNo}`}
                          value={sol.militaryNo}
                          title={`${sol.name} (${sol.seglNo})`}
                        >
                          {sol.name} ({sol.seglNo})
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prev, cur) =>
                      prev.tawzeas[index]?.militaryNo !==
                      cur.tawzeas[index]?.militaryNo
                    }
                  >
                    {() => (
                      <Form.Item
                        {...field}
                        key={`spec-${index}`}
                        className="tawzea-modal__input-grp__flex-large-input"
                        name={[field.name, "spec"]}
                      >
                        <Select
                          disabled={
                            !form.getFieldValue([
                              "tawzeas",
                              field.name,
                              "militaryNo",
                            ])
                          }
                          placeholder="التخصص"
                          loading={specsLoading}
                          showSearch
                          allowClear
                          onSearch={(val) =>
                            handleSpecsSearch(
                              val,
                              form.getFieldValue("tawzeas")[index]?.militaryNo
                            )
                          }
                          optionFilterProp="data-search"
                        >
                          {specsData?.specializations.map((spec) => (
                            <Select.Option
                              data-search={spec.name}
                              key={spec.id}
                              value={spec.id}
                              title={spec.name}
                            >
                              {spec.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                  </Form.Item>
                  <Form.Item
                    {...field}
                    key={`pageNo-${index}`}
                    className="tawzea-modal__input-grp__flex-small-input"
                    name={[field.name, "pageNo"]}
                    rules={[
                      {
                        required: true,
                        message: "يرجى ادخال رقم الصفحة",
                      },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      max={selectedTawzea?.numOfPages}
                      style={{ width: "100%" }}
                      placeholder="رقم الصفحة"
                      autoComplete="off"
                    />
                  </Form.Item>
                  {index !== 0 ? (
                    <Form.Item>
                      <MinusCircleOutlined
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    </Form.Item>
                  ) : null}
                </Input.Group>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  اضافة جندي
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default TawzeaModal;
