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

  const submit = (values: any) => {
    mutateTawzeas({ variables: values });
  };

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
    (val: string) => {
      if (val.length) {
        if (specsSearchTimeoutRef.current)
          clearTimeout(specsSearchTimeoutRef.current);

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
                    weaponId: { in: [weaponId, 26] },
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
              seglNo: {
                equals: +value,
              },
            },
          },
        }),
      500
    );
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      if (e.key === "Enter") form.submit();
    },
    [form]
  );

  return (
    <Modal
      title="إضافة توزيعات"
      visible={isVisible}
      onOk={() => form.submit()}
      onCancel={() => setIsVisible(false)}
      width={1200}
      confirmLoading={mTawLoading}
      destroyOnClose
    >
      <Form
        onKeyUp={handleKeyUp}
        form={form}
        name="add-tawzea"
        onFinish={submit}
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
            optionFilterProp="title"
          >
            {unitData?.units.map((unit) => (
              <Select.Option
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
                      { required: true, message: "يرجى ادخال رقم السجل" },
                    ]}
                  >
                    <Select
                      placeholder="رقم السجل"
                      loading={soldiersLoading}
                      showSearch
                      allowClear
                      optionFilterProp="title"
                      onSearch={handleSoldiersSearch}
                    >
                      {soldiersData?.miniSoldiers.map((sol) => (
                        <Select.Option
                          key={`index-${sol.militaryNo}`}
                          value={sol.militaryNo}
                          title={sol.seglNo.toString()}
                        >
                          {sol.name} ({sol.seglNo})
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...field}
                    key={`spec-${index}`}
                    className="tawzea-modal__input-grp__flex-large-input"
                    name={[field.name, "spec"]}
                  >
                    <Select
                      placeholder="التخصص"
                      loading={specsLoading}
                      showSearch
                      allowClear
                      onSearch={handleSpecsSearch}
                      optionFilterProp="title"
                    >
                      {specsData?.specializations.map((spec) => (
                        <Select.Option
                          key={spec.id}
                          value={spec.id}
                          title={spec.name}
                        >
                          {spec.name}
                        </Select.Option>
                      ))}
                    </Select>
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
                      onChange={(val) =>
                        console.log({ val, pages: selectedTawzea?.numOfPages })
                      }
                    />
                  </Form.Item>
                  <Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Form.Item>
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
