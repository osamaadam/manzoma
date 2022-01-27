import { Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { Link } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import "./navbar.less";

const NavBar = () => {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  return (
    <Menu mode="horizontal">
      <SubMenu key="newcomers" title="المستجدين" disabled={!isLoggedIn}>
        <Menu.Item key="register">
          <Link to="/newcomers/register">تسجيل</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="export" title="تصدير" disabled={!isLoggedIn}>
        <Menu.Item key="rasd">
          <Link to="/report/rasd">نماذج الرصد</Link>
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export default NavBar;
