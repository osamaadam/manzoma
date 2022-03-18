import { Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slices/user.slice";
import "./navbar.less";
import ReceivedTawzeaModal from "./ReceivedTawzeaModal";
import TawzeaModal from "./TawzeaModal";

const NavBar = () => {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const dispatch = useAppDispatch();
  const [isTawzeaVisible, setIsTawzeaVisible] = useState(false);
  const [isReceivedTawzeaVisible, setIsReceivedTawzeaVisible] = useState(false);

  const { pathname } = useLocation();

  return (
    <>
      <Menu mode="horizontal" selectedKeys={[pathname?.split("/")[1]]}>
        <SubMenu key="newcomers" title="المستجدين" disabled={!isLoggedIn}>
          <Menu.Item key="/newcomers">
            <Link to="/newcomers">قائمة المستجدين</Link>
          </Menu.Item>
          <Menu.Item key="/newcomers/register">
            <Link to="/newcomers/register">تسجيل</Link>
          </Menu.Item>
          <Menu.Item key="/newcomers/studio-bahga">
            <Link to="/newcomers/studio-bahga">تصوير</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="export" title="تصدير" disabled={!isLoggedIn}>
          <Menu.Item key="rasd">
            <Link to="/export/rasd">نماذج الرصد</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu disabled={!isLoggedIn} key="tawzea" title="التوزيع">
          <Menu.Item
            typeof="button"
            key="add-received-tawzea"
            onClick={() => setIsReceivedTawzeaVisible(true)}
          >
            اضافة توزيعة مستلمة
          </Menu.Item>
          <Menu.Item
            typeof="button"
            key="add-tawzea"
            onClick={() => setIsTawzeaVisible(true)}
          >
            اضافة توزيعات
          </Menu.Item>
        </SubMenu>
        <Menu.Item
          disabled={!isLoggedIn}
          key="logout"
          onClick={() => dispatch(logout())}
        >
          تسجيل الخروج
        </Menu.Item>
      </Menu>
      <TawzeaModal
        isVisible={isTawzeaVisible}
        setIsVisible={setIsTawzeaVisible}
      />
      <ReceivedTawzeaModal
        isVisible={isReceivedTawzeaVisible}
        setIsVisible={setIsReceivedTawzeaVisible}
      />
    </>
  );
};

export default NavBar;
