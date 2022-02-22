import { createHttpLink } from "@apollo/client";
import axios from "axios";
import { useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { apolloClient, GRAPHQL_URI } from ".";
import "./app.less";
import NavBar from "./components/Navbar";
import NewComersForm from "./components/NewComersForm";
import RasdButton from "./components/RasdButton";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { logout, selectToken } from "./redux/slices/user.slice";
import Login from "./routes/login";
import Newcomers from "./routes/newcomers";

const App = () => {
  const user = useAppSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.user.details.data?.token);

  useEffect(() => {
    axios.interceptors.response.use((res) => {
      const resToken = res.config.headers?.authorization.split(" ")[1];
      if (resToken) dispatch(selectToken(resToken));

      if (res.status === 401) dispatch(logout());

      return res;
    });
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      apolloClient.setLink(
        createHttpLink({
          uri: GRAPHQL_URI,
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
      );
    }
  }, [token]);

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
        <Route path="/newcomers" element={<Newcomers />} />
        <Route path="*" element={<Navigate to="/newcomers/register" />} />
      </Routes>
    </main>
  );
};

export default App;
