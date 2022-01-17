import { Button } from "antd";
import axios from "axios";
import { saveAs } from "file-saver";
import { useState } from "react";

const RasdButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const downloadDocx = async () => {
    try {
      setIsLoading(true);
      const resp = await axios.get("/rasd/docx", {
        responseType: "blob",
      });

      saveAs(resp.data, resp.headers.filename);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100%",
        padding: "1rem",
      }}
    >
      <Button onClick={downloadDocx} loading={isLoading}>
        Download DOCX
      </Button>
    </div>
  );
};

export default RasdButton;
