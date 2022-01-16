import { Button } from "antd";
import axios from "axios";
import { saveAs } from "file-saver";

const RasdButton = () => {
  const downloadDocx = async () => {
    try {
      const resp = await axios.get("/rasd/docx", {
        responseType: "blob",
      });

      saveAs(resp.data, "example.docx");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Button onClick={downloadDocx}>Download DOCX</Button>
    </>
  );
};

export default RasdButton;
