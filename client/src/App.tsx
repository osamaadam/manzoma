import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewComersForm from "./components/NewComersForm";
import RasdButton from "./components/RasdButton";

const App = () => {
  return (
    <BrowserRouter basename="/access">
      <main>
        <Routes>
          <Route path="/" element={<NewComersForm />} />
          <Route path="/rasd" element={<RasdButton />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
