import { Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { Link } from "react-router-dom";
import "./navbar.less";

const NavBar = () => {
  return (
    <Menu mode="horizontal">
      <SubMenu key="newcomers" title="المستجدين">
        <Menu.Item key="register">
          <Link to="/newcomers/register">تسجيل</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="export" title="تصدير">
        <Menu.Item key="rasd">
          <Link to="/report/rasd">نماذج الرصد</Link>
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export default NavBar;
