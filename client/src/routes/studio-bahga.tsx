import { useLazyQuery, useQuery } from "@apollo/client";
import { Button, Form, Input, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { FC, useCallback, useRef } from "react";
import Webcam from "react-webcam";
import { Fasela, Sarya, Soldier } from "type-graphql";
import { faselasQuery } from "../graphql/faselas.query";
import { saryasQuery } from "../graphql/saryas.query";
import { miniSoldierQuery } from "../graphql/soldiers.query";
import { useAppSelector } from "../redux/hooks";
import "./studio.less";

const StudioBahga: FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const marhla = useAppSelector(({ global }) => global.marhla);
  const [form] = useForm();
  const fetchSoldiersTimout = useRef<NodeJS.Timeout>();

  const { data: saryasData, loading: saryasLoading } =
    useQuery<{ saryas: Sarya[] }>(saryasQuery);

  const [fetchSoldiers, { data: solData, loading: solLoading }] =
    useLazyQuery<{ miniSoldiers: Soldier[] }>(miniSoldierQuery);

  const [fetchFaselas, { data: faselasData, loading: faselasLoading }] =
    useLazyQuery<{ faselas: Fasela[] }>(faselasQuery);

  // TODO: add capture logic both in the frontend, and backend
  const capture = useCallback(
    (values) => {
      webcamRef.current?.getScreenshot();
    },
    [webcamRef]
  );

  const handleSoldiersSearch = async (value?: string) => {
    if (value?.length) {
      if (fetchSoldiersTimout.current)
        clearTimeout(fetchSoldiersTimout.current);

      fetchSoldiersTimout.current = setTimeout(
        () =>
          fetchSoldiers({
            variables: {
              where: {
                marhla: {
                  equals: marhla,
                },
                name: isNaN(+value)
                  ? {
                      contains: value,
                    }
                  : undefined,
                militaryNo: !isNaN(+value)
                  ? {
                      contains: value,
                    }
                  : undefined,
              },
            },
          }),
        500
      );
    }
  };

  const handleSaryaSelect = (value: string) => {
    fetchFaselas({
      variables: {
        where: {
          saryaId: {
            equals: +value,
          },
        },
      },
    });
  };

  return (
    <main className="studio__container">
      <section className="studio__form-section">
        <Form form={form} layout="vertical" onFinish={capture}>
          <Form.Item label="الجندي" name="militaryNo">
            <Select
              onClear={() => form.resetFields([["sarya"], ["fasela"]])}
              placeholder="الرقم العسكري او الاسم"
              showSearch
              allowClear
              optionFilterProp="data-search"
              onSearch={handleSoldiersSearch}
              loading={solLoading}
            >
              {solData?.miniSoldiers.map((sol) => (
                <Select.Option
                  value={sol.militaryNo}
                  key={sol.militaryNo}
                  title={`${sol.name} (${sol.militaryNo})`}
                  data-search={`${sol.name} ${sol.militaryNo}`}
                >
                  {sol.name} ({sol.militaryNo})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="المسكن">
            <Input.Group compact>
              <Form.Item
                noStyle
                shouldUpdate={(prev, cur) => prev.militaryNo !== cur.militaryNo}
              >
                {() => (
                  <Form.Item name="sarya" dependencies={["militaryNo"]}>
                    <Select
                      onSelect={handleSaryaSelect}
                      disabled={!form.getFieldValue("militaryNo")?.length}
                      onClear={() => form.resetFields([["fasela"]])}
                      allowClear
                      showSearch
                      placeholder="السرية"
                      loading={saryasLoading}
                      optionFilterProp="data-search"
                    >
                      {saryasData?.saryas.map((sarya) => (
                        <Select.Option
                          value={sarya.id}
                          key={sarya.id}
                          title={sarya.name}
                          data-search={sarya.name}
                        >
                          {sarya.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prev, cur) =>
                  prev.sarya !== cur.sarya || prev.militaryNo !== cur.militaryNo
                }
              >
                {() => (
                  <Form.Item
                    name="fasela"
                    dependencies={[["sarya"], ["militaryNo"]]}
                  >
                    <Select
                      disabled={
                        !form.getFieldValue("sarya") ||
                        !form.getFieldValue("militaryNo")?.length
                      }
                      allowClear
                      showSearch
                      placeholder="الفصيلة"
                      loading={faselasLoading}
                      optionFilterProp="data-search"
                    >
                      {faselasData?.faselas.map((fasela) => (
                        <Select.Option
                          value={fasela.id}
                          key={fasela.id}
                          title={fasela.name}
                          data-search={fasela.name}
                        >
                          {fasela.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">تصوير</Button>
          </Form.Item>
        </Form>
      </section>
      <section className="studio__camera">
        <Webcam
          ref={webcamRef}
          audio={false}
          width={300}
          screenshotFormat="image/jpeg"
          mirrored
        />
      </section>
    </main>
  );
};

export default StudioBahga;
