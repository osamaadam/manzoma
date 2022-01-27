import { useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./app.less";
import NavBar from "./components/Navbar";
import NewComersForm from "./components/NewComersForm";
import RasdButton from "./components/RasdButton";
import { useAppSelector } from "./redux/hooks";
import Login from "./routes/login";

const App = () => {
  const user = useAppSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isLoggedIn && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    } else if (
      user.isLoggedIn &&
      user.details.status === "succeeded" &&
      location.pathname === "/login"
    ) {
      navigate("/newcomers/register", { replace: true });
    }
  }, [user, location, navigate]);

  return (
    <main className="main-layout">
      <NavBar />
      <Routes>
        <Route path="/newcomers/register" element={<NewComersForm />} />
        <Route path="/report/rasd" element={<RasdButton />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/newcomers/register" />} />
      </Routes>
    </main>
  );
};

export default App;
