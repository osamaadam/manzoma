import { useMutation } from "@apollo/client";
import { DatePicker, Form, Input, InputNumber, Modal } from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import { Dispatch, FC, SetStateAction, useCallback, useEffect } from "react";
import { createReceivedTawzeaMutation } from "../graphql/createReceivedTawzea.query";
import { useAppSelector } from "../redux/hooks";

interface Props {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const ReceivedTawzeaModal: FC<Props> = ({ isVisible, setIsVisible }) => {
  const [form] = useForm();
  const marhla = useAppSelector(({ global }) => global.marhla);

  const [mutateReceivedTawzea, { loading }] = useMutation(
    createReceivedTawzeaMutation
  );

  const closeModal = () => {
    setIsVisible(false);
  };

  const submit = async (values: any) => {
    const {
      displayName,
      dateReceived,
      numOfPages,
    }: {
      displayName: string;
      dateReceived: string;
      numOfPages: number;
    } = {
      ...values,
      dateReceived: moment(form.getFieldValue("dateReceived")).toISOString(),
    };

    await mutateReceivedTawzea({
      variables: {
        data: {
          marhla,
          displayName,
          dateReceived,
          numOfPages,
        },
      },
    });

    closeModal();
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      if (e.key === "Enter") form.submit();
    },
    [form]
  );

  useEffect(() => {
    // force rerender on loading state change
  }, [loading]);

  return (
    <Modal
      title="إضافة توزيعة مستلمة"
      visible={isVisible}
      onCancel={() => closeModal()}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form
        form={form}
        onKeyUp={handleKeyUp}
        name="add-received-tawzea"
        onFinish={submit}
      >
        <Form.Item
          label="اسم التوزيعة"
          name="displayName"
          rules={[{ required: true, message: "يرجى ادخال اسم التوزيعة" }]}
        >
          <Input autoComplete="off" autoFocus />
        </Form.Item>
        <Form.Item
          label="عدد الصفحات"
          name="numOfPages"
          rules={[
            {
              required: true,
              message: "يرجى ادخال عدد الصفحات",
            },
          ]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item
          label="تاريخ الاستلام"
          name="dateReceived"
          rules={[{ required: true, message: "يرجى ادخال تاريخ الاستلام" }]}
          initialValue={moment()}
        >
          <DatePicker picker="date" format={"DD/MM/YYYY"} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReceivedTawzeaModal;
