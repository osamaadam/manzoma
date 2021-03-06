import {
  Button,
  DatePicker,
  Divider,
  Form,
  FormInstance,
  Input,
  message,
  Select,
  Spin,
} from "antd";
import axios from "axios";
import { DateTime } from "luxon";
import moment, { Moment } from "moment";
import React, { useCallback } from "react";
import { generateRelAddress } from "../helpers/generateRelAddress";
import { removeArabicDialicts } from "../helpers/removeArabicDialicts";
import "./form.less";

const { Option } = Select;

const NewComersForm = () => {
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = React.useState(true);

  const [serverTime, setServerTime] = React.useState<Moment>();

  const [govs, setGovs] = React.useState<GenericFormData[]>([]);
  const [bloodTypes, setBloodTypes] = React.useState<GenericFormData[]>([]);
  const [healthOpts, setHealthOpts] = React.useState<GenericFormData[]>([]);
  const [religionOpts, setReligionOpts] = React.useState<GenericFormData[]>([]);
  const [maritalStates, setMaritalStates] = React.useState<GenericFormData[]>(
    []
  );
  const [tagneedFactors, setTagneedFactors] = React.useState<GenericFormData[]>(
    []
  );
  const [etgahOpts, setEtgahOpts] = React.useState<GenericFormData[]>([]);
  const [jobOpts, setJobOpts] = React.useState<GenericFormData[]>([]);
  const [majorOpts, setMajorOpts] = React.useState<Major[]>([]);
  const [centerOpts, setCenterOpts] = React.useState<Center[]>([]);
  const [solasyFirst, setSolasyFirst] = React.useState<number>();
  const [solasySecond, setSolasySecond] = React.useState<number>();
  const [solasyThird, setSolasyThird] = React.useState<number>();
  const [curPrefix, setCurPrefix] = React.useState<number>();
  const [curMrhla, setCurMrhla] = React.useState<string>();

  const [formDataQueryFailed, setFormDataQueryFailed] = React.useState(false);

  const fetchServerTime = async () => {
    try {
      const { data } = await axios.get<string>("/time");
      const momentObj = moment(data);
      setServerTime(momentObj);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMajors = async (moahelId: number | string) => {
    const { data } = await axios.get<Major[]>("/form-data/major", {
      params: {
        moahelId,
      },
    });

    setMajorOpts(data);
  };

  const fetchFormData = useCallback(async () => {
    try {
      const { data } = await axios.get<BasicFormData>("/form-data");
      setFormDataQueryFailed(false);
      setGovs(data.govs);
      setBloodTypes(data.bloodTypes);
      setHealthOpts(data.health);
      setReligionOpts(data.religions);
      setMaritalStates(data.maritalStates);
      setTagneedFactors(data.tagneedFactor);
      setEtgahOpts(data.etgah);
      setJobOpts(data.mehna);
      setIsLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setFormDataQueryFailed(true);
        message.error(err.message);
      } else console.error(err);
    }
  }, []);

  React.useEffect(() => {
    fetchServerTime();
    fetchFormData();
  }, [fetchFormData]);

  React.useEffect(() => {
    let timeoutRef: NodeJS.Timeout;
    if (formDataQueryFailed) {
      timeoutRef = setTimeout(fetchFormData, 500);
    }

    return () => {
      clearTimeout(timeoutRef);
    };
  }, [fetchFormData, formDataQueryFailed]);

  const deduceMoahel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const militaryNumber = e.currentTarget.value.toString();
    if (militaryNumber.length > 5) {
      const deducedMoahelId = militaryNumber[5];
      try {
        fetchMajors(deducedMoahelId);
      } catch (err) {
        console.error(err);
      }
    } else {
      setMajorOpts([]);
      form.resetFields(["major_fk"]);
    }
  };

  const fetchCenters = async (govId: string | number) => {
    form.setFieldsValue({ center_code: undefined });
    if (govId !== undefined) {
      try {
        const { data } = await axios.get<Center[]>("/form-data/markaz", {
          params: { govId },
        });

        setCenterOpts(data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setCenterOpts([]);
    }
  };

  const guessSolasyThird = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nationalId = e.currentTarget.value.toString();
    if (nationalId.length >= 7) {
      const birthDatePortion = nationalId.substring(1, 7);
      const birthYear = DateTime.fromFormat(birthDatePortion, "yyMMdd").year;
      setSolasyThird(birthYear);
    }
  };

  const guessMrhla = React.useCallback(() => {
    let mrhla = serverTime?.year().toString();
    if (!mrhla) return undefined;

    const curMonth = Number(serverTime?.month()) + 1;

    switch (curMonth) {
      case 1:
      case 2:
      case 3:
        mrhla += 1;
        break;
      case 4:
      case 5:
      case 6:
        mrhla += 2;
        break;
      case 7:
      case 8:
      case 9:
        mrhla += 3;
        break;
      case 10:
      case 11:
      case 12:
        mrhla += 4;
        break;
    }

    return mrhla;
  }, [serverTime]);

  React.useEffect(() => {
    const curMrhla = guessMrhla();
    if (curMrhla) {
      setCurMrhla(curMrhla);
      if (curMrhla.length === 5) setCurPrefix(+("2" + curMrhla[4]));
    }
  }, [guessMrhla, serverTime]);

  const onFinish = async (values: FormData) => {
    let {
      address,
      blood_type,
      center_code,
      etgah,
      first_name,
      governorate_fk,
      health,
      major_fk,
      marital_state,
      mehna,
      military_no,
      mrhla,
      national_no,
      parent_name,
      religion_code,
      segl_no,
      tagneed_date,
      tagneed_factor,
      tasgeel_date,
    } = values;
    first_name = removeArabicDialicts(first_name).trim();
    parent_name = removeArabicDialicts(parent_name).trim();
    const soldier_name = [first_name, parent_name].join(" ");
    const rel_name = parent_name.trim();
    const governorate = govs.find((gov) => gov.id === governorate_fk)?.name;
    const center = centerOpts.find((center) => center.id === center_code)?.name;
    const rel_address = generateRelAddress(address, center, governorate).trim();

    tasgeel_date = moment(tasgeel_date).format("D/M/YYYY");
    tagneed_date = moment(tagneed_date).format("D/M/YYYY");
    const solasy_no = [solasyFirst, solasySecond, solasyThird].join("/").trim();

    const postData: PostData = {
      address,
      blood_type,
      center_code,
      etgah,
      governorate_fk,
      health,
      major_fk,
      marital_state,
      military_no,
      mrhla,
      national_no,
      rel_address,
      rel_name,
      religion_code,
      segl_no,
      solasy_no,
      soldier_name,
      tagneed_date,
      tagneed_factor,
      tasgeel_date,
      mehna,
    };

    message.config({
      maxCount: 1,
      rtl: true,
    });

    message.loading("?????? ?????????? ????????????...");

    try {
      await axios.post("/insert", postData);
      message.success("???? ?????????? ???????????? ??????????");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data.process.message);
        message.error(err.response?.data.process.message);
      }
      console.error(err);
    }
  };

  if (isLoading || !serverTime?.isValid())
    return (
      <div className="spinner-container">
        <Spin />
      </div>
    );
  return (
    <div className="form-container">
      <Form
        form={form}
        layout="inline"
        onFinish={onFinish}
        initialValues={{
          religion: 1,
          marital_state: 0,
          mrhla: curMrhla,
          tasgeel_date: serverTime,
        }}
        className="form"
      >
        <div className="form-items-container">
          <Divider>???????????????? ??????????????</Divider>
          <div className="form-items-container__inner-container">
            <Form.Item name="first_name" label="?????????? ??????????" required>
              <Input autoFocus type="text" autoComplete="off" lang="ar" />
            </Form.Item>
            <Form.Item name="parent_name" label="?????? ????????" required>
              <Input type="text" autoComplete="off" lang="ar" />
            </Form.Item>
            <Form.Item
              label="?????????? ????????????"
              name="national_no"
              required
              rules={[
                {
                  required: true,
                },
                {
                  len: 14,
                },
                {
                  validator: (_, val: number) => {
                    const national_no = val.toString();
                    if (national_no.length >= 13) {
                      if (!(+national_no[12] % 2)) {
                        return Promise.reject(
                          new Error(
                            "?????????? ?????? ???????????? ?????? ???? ???????? ???????? ???? ???????? ????????????"
                          )
                        );
                      } else {
                        return Promise.resolve();
                      }
                    } else return Promise.resolve();
                  },
                },
                {
                  validator: (_, val) =>
                    fetchValidator(
                      "national_no",
                      val,
                      "???????? ???????? ???????? ?????????? ????????????",
                      14
                    ),
                },
              ]}
            >
              <Input
                type="number"
                autoComplete="off"
                onChange={guessSolasyThird}
              />
            </Form.Item>
            <Form.Item name="governorate_fk" label="????????????????" required>
              <Select
                showSearch
                filterOption={(input, option) => {
                  const normalizedOption = removeArabicDialicts(option?.title);
                  const normalizedInput = removeArabicDialicts(input);
                  return normalizedOption.indexOf(normalizedInput) >= 0;
                }}
                onSelect={fetchCenters}
                disabled={!govs.length}
              >
                {govs
                  .sort((a, b) =>
                    a.name
                      .toLocaleLowerCase()
                      .localeCompare(b.name.toLocaleLowerCase())
                  )
                  .map((gov) => (
                    <Option value={gov.id} key={gov.id} title={gov.name}>
                      {gov.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item name="center_code" label="?????????? / ????????????" required>
              <Select
                showSearch
                filterOption={(input, option) => {
                  const normalizedOption = removeArabicDialicts(option?.title);
                  const normalizedInput = removeArabicDialicts(input);
                  return normalizedOption.indexOf(normalizedInput) >= 0;
                }}
                disabled={!centerOpts.length}
                onSelect={(val, opt) => {
                  setSolasySecond(+opt.value);
                }}
              >
                {centerOpts
                  .sort((a, b) =>
                    a.name
                      .toLocaleLowerCase()
                      .localeCompare(b.name.toLocaleLowerCase())
                  )
                  .map((centerOpt) => (
                    <Option
                      value={centerOpt.id}
                      key={centerOpt.id}
                      title={centerOpt.name}
                    >
                      {centerOpt.name} ({centerOpt.id})
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="??????????????"
              name="address"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input type="text" autoComplete="off" lang="ar" />
            </Form.Item>
            <Form.Item name="religion_code" label="??????????????" required>
              <Select
                showSearch
                filterOption={(input, option) => {
                  const normalizedOption = removeArabicDialicts(option?.title);
                  const normalizedInput = removeArabicDialicts(input);
                  return normalizedOption.indexOf(normalizedInput) >= 0;
                }}
                disabled={!religionOpts.length}
              >
                {religionOpts.map((religionOpt) => (
                  <Option
                    value={religionOpt.id}
                    key={religionOpt.id}
                    title={religionOpt.name}
                  >
                    {religionOpt.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="?????? ????????" name="blood_type" required>
              <Select
                showSearch
                filterOption={(input, option) => {
                  const normalizedOption = removeArabicDialicts(option?.title);
                  const normalizedInput = removeArabicDialicts(input);
                  return normalizedOption.indexOf(normalizedInput) >= 0;
                }}
                disabled={!bloodTypes.length}
              >
                {bloodTypes.map((bloodType) => (
                  <Option
                    value={bloodType.id}
                    key={bloodType.id}
                    title={bloodType.name}
                  >
                    {bloodType.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="marital_state" label="???????????? ????????????????????" required>
              <Select
                showSearch
                filterOption={(input, option) => {
                  const normalizedOption = removeArabicDialicts(option?.title);
                  const normalizedInput = removeArabicDialicts(input);
                  return normalizedOption.indexOf(normalizedInput) >= 0;
                }}
                disabled={!maritalStates.length}
              >
                {maritalStates
                  .sort((a, b) =>
                    a.name
                      .toLocaleLowerCase()
                      .trim()
                      .localeCompare(b.name.toLocaleLowerCase().trim())
                  )
                  .map((maritalState) => (
                    <Option
                      value={maritalState.id}
                      key={maritalState.id}
                      title={maritalState.name}
                    >
                      {maritalState.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className="form-items-container">
          <Divider>???????????????? ????????????????</Divider>
          <div className="form-items-container__inner-container">
            <Form.Item
              label="??????????????"
              name="mrhla"
              required
              rules={[
                {
                  required: true,
                },
                {
                  len: 5,
                },
              ]}
            >
              <Input
                type="number"
                value={curMrhla}
                onChange={(e) => {
                  const curMrhla = e.currentTarget.value;
                  setCurMrhla(curMrhla);
                  if (curMrhla.length === 5) setCurPrefix(+("2" + curMrhla[4]));
                }}
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              label="?????????? ??????????????"
              name="military_no"
              required
              rules={[
                {
                  required: true,
                },
                {
                  len: 13,
                },
                {
                  validator: (_, val) =>
                    fetchValidator(
                      "military_no",
                      val,
                      "???????? ???????? ???????? ?????????? ??????????????",
                      13
                    ),
                },
                {
                  validator: (_, val?: string | number) => {
                    const militaryNum = val?.toString();
                    if (militaryNum && militaryNum.length >= 8) {
                      const selahCode = militaryNum.substring(6, 8);
                      if (+selahCode !== 16)
                        return Promise.reject(
                          "?????????? ?????????? ?????????? ?????????????? ???? 16"
                        );
                    }
                    return Promise.resolve();
                  },
                  warningOnly: true,
                },
              ]}
            >
              <Input type="number" autoComplete="off" onChange={deduceMoahel} />
            </Form.Item>
            <Form.Item
              label="?????? ??????????"
              name="segl_no"
              required
              validateTrigger="onBlur"
              rules={[
                {
                  required: true,
                },
                {
                  min: 3,
                },
                {
                  validator: (_, val) =>
                    fetchValidator(
                      "segl_no",
                      val,
                      "???????? ???????? ???????? ?????? ??????????",
                      3
                    ),
                },
              ]}
            >
              <SeglNoInput form={form} prefix={curPrefix} />
            </Form.Item>
            <Form.Item
              name="solasy_no"
              dependencies={["national_no", "markaz"]}
              label="?????????? ??????????????"
            >
              <SolasyNumber
                solasySecond={solasySecond}
                solasyThird={solasyThird}
                setSolasyFirst={setSolasyFirst}
                setSolasySecond={setSolasySecond}
                setSolasyThird={setSolasyThird}
              />
            </Form.Item>
            <Form.Item label="??????????????" name="etgah" required>
              <Select
                showSearch
                filterOption={(input, option) => {
                  const normalizedOption = removeArabicDialicts(option?.title);
                  const normalizedInput = removeArabicDialicts(input);
                  return normalizedOption.indexOf(normalizedInput) >= 0;
                }}
                disabled={!etgahOpts.length}
              >
                {etgahOpts
                  .sort((a, b) => +a.id - +b.id)
                  .map((etgah) => (
                    <Option value={etgah.id} key={etgah.id} title={etgah.name}>
                      {etgah.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item name="health" label="??????????????" required>
              <Select
                showSearch
                filterOption={(input, option) => {
                  const normalizedOption = removeArabicDialicts(option?.title);
                  const normalizedInput = removeArabicDialicts(input);
                  return normalizedOption.indexOf(normalizedInput) >= 0;
                }}
                disabled={!healthOpts.length}
              >
                {healthOpts
                  .sort((a, b) =>
                    a.name
                      .toLocaleLowerCase()
                      .trim()
                      .localeCompare(b.name.toLocaleLowerCase().trim())
                  )
                  .map((healthOpt) => (
                    <Option
                      value={healthOpt.id}
                      key={healthOpt.id}
                      title={healthOpt.name}
                    >
                      {healthOpt.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item name="tagneed_factor" label="???????????? ??????????????????" required>
              <Select
                showSearch
                filterOption={(input, option) => {
                  const normalizedOption = removeArabicDialicts(option?.title);
                  const normalizedInput = removeArabicDialicts(input);
                  return normalizedOption.indexOf(normalizedInput) >= 0;
                }}
                disabled={!tagneedFactors.length}
              >
                {tagneedFactors.map((tagneedFactor) => (
                  <Option
                    value={tagneedFactor.id}
                    key={tagneedFactor.id}
                    title={tagneedFactor.name}
                  >
                    {tagneedFactor.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="tasgeel_date" label="?????????? ??????????????" required>
              <DatePicker format="D/M/YYYY" />
            </Form.Item>
            <Form.Item name="tagneed_date" label="?????????? ??????????????" required>
              <DatePicker format="D/M/YYYY" />
            </Form.Item>
          </div>
        </div>
        <div className="form-items-container">
          <Divider>???????????????? ?????????????? ?? ????????????????????</Divider>
          <div className="form-items-container__inner-container">
            <Form.Item label="???????????? ?????? ??????????????" name="mehna">
              <Select
                showSearch
                allowClear
                filterOption={(input, option) => {
                  const normalizedOption = removeArabicDialicts(option?.title);
                  const normalizedInput = removeArabicDialicts(input);
                  return normalizedOption.indexOf(normalizedInput) >= 0;
                }}
                disabled={!jobOpts.length}
              >
                {jobOpts
                  .sort((a, b) =>
                    a.name
                      .toLocaleLowerCase()
                      .trim()
                      .localeCompare(b.name.toLocaleLowerCase().trim())
                  )
                  .map((jobOpt) => (
                    <Option
                      value={jobOpt.id}
                      key={jobOpt.id}
                      title={jobOpt.name}
                    >
                      {jobOpt.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="????????????"
              name="major_fk"
              required
              dependencies={["military_no"]}
            >
              <Select
                showSearch
                filterOption={(input, option) => {
                  const normalizedOption = removeArabicDialicts(option?.title);
                  const normalizedInput = removeArabicDialicts(input);
                  return normalizedOption.indexOf(normalizedInput) >= 0;
                }}
                disabled={!majorOpts.length}
              >
                {majorOpts
                  .sort((a, b) =>
                    a.name
                      .toLocaleLowerCase()
                      .trim()
                      .localeCompare(b.name.toLocaleLowerCase().trim())
                  )
                  .map((majorOpt) => (
                    <Option
                      value={majorOpt.id}
                      key={majorOpt.id}
                      title={majorOpt.name}
                    >
                      {majorOpt.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            formAction="submit"
            className="form__submit-btn"
          >
            ??????????
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const fetchValidator = async (
  key: string,
  value: string | number,
  errorText: string,
  lengthThreshold: number
) => {
  if (value?.toString().length >= lengthThreshold) {
    const validationReq = await axios.get<BasicRow[]>("/get/soldier", {
      params: { [key]: value },
    });
    if (validationReq.status === 204) return Promise.resolve();
    else return Promise.reject(errorText);
  }
  return Promise.resolve();
};

const SolasyNumber = ({
  solasySecond,
  solasyThird,
  setSolasyFirst,
  setSolasySecond,
  setSolasyThird,
}: {
  solasySecond?: number;
  solasyThird?: number;
  setSolasyFirst: React.Dispatch<React.SetStateAction<number | undefined>>;
  setSolasySecond: React.Dispatch<React.SetStateAction<number | undefined>>;
  setSolasyThird: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => (
  <Input.Group compact>
    <Input
      required
      value={solasyThird}
      type="number"
      style={{ width: "5rem" }}
      onChange={(e) => setSolasyThird(e.currentTarget.valueAsNumber)}
    />
    <Input
      disabled
      placeholder="/"
      style={{ width: "2rem", backgroundColor: "inherit" }}
    />
    <Input
      required
      value={solasySecond}
      type="number"
      style={{ width: "5rem" }}
      onChange={(e) => setSolasySecond(e.currentTarget.valueAsNumber)}
    />
    <Input
      disabled
      placeholder="/"
      style={{ width: "2rem", backgroundColor: "inherit" }}
    />
    <Input
      required
      type="number"
      style={{ width: "5rem" }}
      onChange={(e) => setSolasyFirst(+e.currentTarget.value)}
    />
  </Input.Group>
);

const SeglNoInput = ({
  form,
  prefix,
}: {
  form: FormInstance<any>;
  prefix?: number;
}) => {
  return (
    <Input.Group compact>
      <Input
        type="number"
        autoComplete="off"
        style={{ width: "6rem" }}
        onChange={(e) => {
          const realVal = prefix?.toString() + e.currentTarget.value.toString();
          console.log(realVal);
          form.setFieldsValue({
            segl_no: realVal,
          });
        }}
      />
      <Input
        disabled
        value={prefix}
        style={{ width: "2.5rem", backgroundColor: "inherit" }}
      />
    </Input.Group>
  );
};

export default NewComersForm;

interface GenericFormData {
  id: string | number;
  name: string;
}

interface Major extends GenericFormData {
  moahel: string;
  moahelId: number;
}

interface Center extends GenericFormData {
  gov: string;
  govId: number;
}

interface BasicRow {
  soldier_name: string;
  tasgeel_date: string;
  segl_no: number;
  address: string;
  military_no: string;
  national_no: string;
  moahel_name: string;
  gov_name: string;
  major_name: string;
  blood_type: string;
  markaz: string;
  deg_name: string;
  religion_name: string;
  fea_name: string;
  tagneed_factor_name: string;
}

interface BasicFormData {
  bloodTypes: GenericFormData[];
  driversLicense: GenericFormData[];
  etgah: GenericFormData[];
  govs: GenericFormData[];
  health: GenericFormData[];
  maritalStates: GenericFormData[];
  mehna: GenericFormData[];
  moahel: GenericFormData[];
  religions: GenericFormData[];
  tagneedFactor: GenericFormData[];
}

interface PostData {
  soldier_name: string;
  address: string;
  mrhla: string | number;
  military_no: string | number;
  tagneed_date: string;
  governorate_fk: number;
  solasy_no: string;
  health: number;
  segl_no: number;
  blood_type: number;
  tasgeel_date: string;
  center_code: number;
  religion_code: number;
  marital_state: number;
  national_no: string | number;
  tagneed_factor: number;
  etgah: number;
  mehna?: string;
  major_fk: string | number;
  rel_address: string;
  rel_name: string;
}

interface FormData {
  first_name: string;
  parent_name: string;
  address: string;
  mrhla: string | number;
  military_no: string | number;
  tagneed_date: string;
  governorate_fk: number;
  solasy_no: string;
  health: number;
  segl_no: number;
  blood_type: number;
  tasgeel_date: string;
  center_code: number;
  religion_code: number;
  marital_state: number;
  national_no: string | number;
  tagneed_factor: number;
  etgah: number;
  mehna?: string;
  major_fk: string | number;
}
