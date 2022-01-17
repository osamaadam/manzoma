import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar";
import NewComersForm from "./components/NewComersForm";
import RasdButton from "./components/RasdButton";
import "./app.less";

const App = () => {
  return (
    <BrowserRouter basename="/access">
      <main className="main-layout">
        <NavBar />
        <Routes>
          <Route path="/newcomers/register" element={<NewComersForm />} />
          <Route path="/report/rasd" element={<RasdButton />} />
          <Route path="*" element={<Navigate to="/newcomers/register" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
