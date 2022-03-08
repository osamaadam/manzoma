// TODO: Add dynamic (soldier search / specialization) fields to the form.
// TODO: Also maybe load all the specializations at once.
import { useQuery } from "@apollo/client";
import { Form, Modal, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { Dispatch, FC, SetStateAction, useCallback, useRef } from "react";
import { ReceivedTawzea, Specialization, Unit } from "type-graphql";
import { receivedTawzeasQuery } from "../graphql/receivedTawzeasQuery";
import { specsQuery } from "../graphql/specsQuery";
import { unitsQuery } from "../graphql/unitsQuery";
import { useAppSelector } from "../redux/hooks";

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

  const submit = () => {};

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

  return (
    <Modal
      title="التوزيع"
      visible={isVisible}
      onOk={submit}
      onCancel={() => setIsVisible(false)}
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
              <Select.Option key={opt.id} value={opt.displayName}>
                {opt.displayName}
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
          >
            {unitData?.units.map((unit) => (
              <Select.Option
                key={unit.id}
                value={unit.name}
                title={`${unit.name} (${unit.etgah?.name})`}
              >
                {unit.name} ({unit.etgah?.name})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="التخصص" name="spec">
          <Select
            loading={specsLoading}
            showSearch
            allowClear
            onSearch={handleSpecsSearch}
          >
            {specsData?.specializations.map((spec) => (
              <Select.Option key={spec.id} value={spec.name} title={spec.name}>
                {spec.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TawzeaModal;
