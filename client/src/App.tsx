import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewComersForm from "./components/NewComersForm";

const App = () => {
  return (
    <BrowserRouter basename="/access">
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <NewComersForm />
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
