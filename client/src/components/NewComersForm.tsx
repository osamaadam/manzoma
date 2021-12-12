import React from "react";
import axios from "axios";
import { Select } from "antd";

const { Option } = Select;

const NewComersForm = () => {
  const [govs, setGovs] = React.useState<GenericFormData[]>([]);

  React.useEffect(() => {
    getFormData();
  }, []);

  const getFormData = async () => {
    try {
      const { data } = await axios.get<BasicFormData>("/form-data");
      console.log(data);
      setGovs(data.govs);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Select
      showSearch
      placeholder="Select governorate"
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      onSelect={(val) => console.log(val)}
    >
      {govs.map((gov) => (
        <Option value={gov.id} key={gov.id}>
          {gov.name}
        </Option>
      ))}
    </Select>
  );
};

export default NewComersForm;

interface GenericFormData {
  id: string | number;
  name: string;
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
  religion: GenericFormData[];
  tagneedFactor: GenericFormData[];
}
