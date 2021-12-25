import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Select,
  Spin,
} from "antd";
import axios from "axios";
import { DateTime } from "luxon";
import moment from "moment";
import React from "react";
import { generateRelAddress } from "../helpers/generateRelAddress";
import { removeArabicDialicts } from "../helpers/removeArabicDialicts";
import "./form.less";

const { Option } = Select;

const NewComersForm = () => {
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = React.useState(true);

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

  React.useEffect(() => {
    fetchFormData();
  }, []);

  const fetchMajors = async (moahelId: number | string) => {
    const { data } = await axios.get<Major[]>("/form-data/major", {
      params: {
        moahelId,
      },
    });

    setMajorOpts(data);
  };

  const fetchFormData = async () => {
    try {
      const { data } = await axios.get<BasicFormData>("/form-data");
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
      console.error(err);
    }
  };

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

  const guessMrhla = () => {
    const { year, month } = DateTime.now();

    let mrhla = year.toString();

    switch (month) {
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
  };

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
    first_name = removeArabicDialicts(first_name);
    parent_name = removeArabicDialicts(parent_name);
    const soldier_name = [first_name, parent_name].join(" ");
    const rel_name = parent_name;
    const governorate = govs.find((gov) => gov.id === governorate_fk)?.name;
    const center = centerOpts.find((center) => center.id === center_code)?.name;
    const rel_address = generateRelAddress(address, center, governorate);

    tasgeel_date = moment(tasgeel_date).format("D/M/YYYY");
    tagneed_date = moment(tagneed_date).format("D/M/YYYY");
    const solasy_no = [solasyFirst, solasySecond, solasyThird].join("/");

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

    message.loading("يتم تسجيل المجند...");

    try {
      await axios.post("/insert", postData);
      message.success("تم تسجيل المجند بنجاح");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data.process.message);
        message.error(err.response?.data.process.message);
      }
      console.error(err);
    }
  };

  if (isLoading)
    return (
      <div className="spinner-container">
        <Spin />
      </div>
    );
  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onFinish}
      initialValues={{
        religion: 1,
        marital_state: 0,
        mrhla: guessMrhla(),
        tasgeel_date: moment(),
      }}
      className="form"
    >
      <Divider>البيانات الشخصية</Divider>
      <div className="form-items-container">
        <Form.Item name="first_name" label="الاسم الأول" required>
          <Input type="text" autoComplete="off" lang="ar" />
        </Form.Item>
        <Form.Item name="parent_name" label="اسم الأب" required>
          <Input type="text" autoComplete="off" lang="ar" />
        </Form.Item>
        <Form.Item
          label="الرقم القومي"
          name="national_no"
          required
          validateTrigger="onBlur"
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
                        "الرقم قبل الأخير يجب ان يكون فردي في حالة الذكور"
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
                  "يوجد مجند بنفس الرقم القومي"
                ),
            },
          ]}
        >
          <Input type="number" autoComplete="off" onChange={guessSolasyThird} />
        </Form.Item>
        <Form.Item name="governorate_fk" label="المحافظة" required>
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
        <Form.Item name="center_code" label="القسم / المركز" required>
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
          label="العنوان"
          name="address"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input type="text" autoComplete="off" lang="ar" />
        </Form.Item>
        <Form.Item name="religion_code" label="الديانة" required>
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
        <Form.Item label="نوع الدم" name="blood_type" required>
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
        <Form.Item name="marital_state" label="الحالة الاجتماعية" required>
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
      <Divider>البيانات العسكرية</Divider>
      <div className="form-items-container">
        <Form.Item
          label="المرحلة"
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
          <Input type="number" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="الرقم العسكري"
          name="military_no"
          required
          validateTrigger="onBlur"
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
                  "يوجد مجند بنفس الرقم العسكري"
                ),
            },
          ]}
        >
          <Input type="number" autoComplete="off" onChange={deduceMoahel} />
        </Form.Item>
        <Form.Item
          label="رقم السجل"
          name="segl_no"
          required
          rules={[
            {
              required: true,
            },
            {
              min: 3,
            },
            {
              validator: (_, val) =>
                fetchValidator("segl_no", val, "يوجد مجند بنفس رقم السجل"),
            },
          ]}
          validateTrigger="onBlur"
        >
          <Input type="number" autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="solasy_no"
          dependencies={["national_no", "markaz"]}
          label="الرقم الثلاثي"
        >
          <SolasyNumber
            solasySecond={solasySecond}
            solasyThird={solasyThird}
            setSolasyFirst={setSolasyFirst}
            setSolasySecond={setSolasySecond}
            setSolasyThird={setSolasyThird}
          />
        </Form.Item>
        <Form.Item label="الاتجاه" name="etgah" required>
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
        <Form.Item name="health" label="اللياقة" required>
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
        <Form.Item name="tagneed_factor" label="الحالة التجنيدية" required>
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
        <Form.Item name="tasgeel_date" label="تاريخ التسجيل" required>
          <DatePicker format="D/M/YYYY" />
        </Form.Item>
        <Form.Item name="tagneed_date" label="تاريخ التجنيد" required>
          <DatePicker format="D/M/YYYY" />
        </Form.Item>
      </div>
      <Divider>البيانات المهنية و الأكاديمية</Divider>
      <div className="form-items-container">
        <Form.Item label="المهنة قبل التجنيد" name="mehna">
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
                <Option value={jobOpt.id} key={jobOpt.id} title={jobOpt.name}>
                  {jobOpt.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="التخصص"
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
      <Form.Item>
        <Button type="primary" htmlType="submit">
          تسجيل
        </Button>
      </Form.Item>
    </Form>
  );
};

const fetchValidator = async (
  key: string,
  value: string | number,
  errorText: string
) => {
  const validationReq = await axios.get<BasicRow[]>("/get/soldier", {
    params: { [key]: value },
  });
  if (validationReq.status === 204) return Promise.resolve();
  else return Promise.reject(errorText);
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
