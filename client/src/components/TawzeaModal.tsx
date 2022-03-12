// TODO: Fix soldiers duplicating, and implement a search strategy.
import { MinusCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Button, Form, Input, Modal, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { DateTime } from "luxon";
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { ReceivedTawzea, Soldier, Specialization, Unit } from "type-graphql";
import { receivedTawzeasQuery } from "../graphql/receivedTawzeasQuery";
import { soldiersQuery } from "../graphql/soldiersQuery";
import { specsQuery } from "../graphql/specsQuery";
import { unitsQuery } from "../graphql/unitsQuery";
import { useAppSelector } from "../redux/hooks";
import "./tawzea-modal.less";

interface Props {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const TawzeaModal: FC<Props> = ({ isVisible, setIsVisible }) => {
  const [form] = useForm();
  const marhla = useAppSelector((state) => state.global.marhla);
  const weaponId = useAppSelector((state) => state.global.weaponId);
  const unitSearchTimeoutRef = useRef<NodeJS.Timeout>();
  const specsSearchTimeoutRef = useRef<NodeJS.Timeout>();

  const { data: soldiersData, loading: soldiersLoading } = useQuery<{
    soldiers: Soldier[];
  }>(soldiersQuery, {
    variables: {
      where: {
        marhla: {
          equals: marhla,
        },
      },
      orderBy: {
        seglNo: "asc",
      },
    },
  });

  const { data: rTawData, loading: rTawLoading } = useQuery<{
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
    console.log(values);
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
                    weaponId: { equals: weaponId },
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

  const soldiers = useMemo(
    () => soldiersData?.soldiers,
    [soldiersData?.soldiers]
  );

  return (
    <Modal
      title="التوزيع"
      visible={isVisible}
      onOk={() => form.submit()}
      onCancel={() => setIsVisible(false)}
      width={1200}
    >
      <Form form={form} name="add-tawzea" onFinish={submit}>
        <Form.Item
          label="التوزيعة المعنية"
          name="receivedTawzea"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select loading={rTawLoading} showSearch allowClear>
            {rTawData?.receivedTawzeas.map((opt) => (
              <Select.Option key={opt.id} value={opt.id}>
                {opt.displayName} (
                {DateTime.fromISO(opt.dateReceived.toString())
                  .setLocale("ar-EG")
                  .toLocaleString(DateTime.DATE_MED)}
                )
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="الوحدة" name="unit" rules={[{ required: true }]}>
          <Select
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
                <Input.Group compact className="tawzea-modal__input-grp">
                  <Form.Item
                    {...field}
                    name={[field.name, "militaryNo"]}
                    key={`militaryNo-${index}`}
                    className="tawzea-modal__input-grp__flex-medium-input"
                  >
                    <Select
                      placeholder="رقم السجل"
                      loading={soldiersLoading}
                      showSearch
                      allowClear
                      optionFilterProp="title"
                    >
                      {soldiers?.map((sol) => (
                        <Select.Option
                          key={`${index}-${sol.militaryNo}`}
                          value={+sol.militaryNo}
                          title={`${sol.name} (${sol.seglNo})`}
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
