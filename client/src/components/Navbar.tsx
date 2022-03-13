import { Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import "./navbar.less";
import ReceivedTawzeaModal from "./ReceivedTawzeaModal";
import TawzeaModal from "./TawzeaModal";

const NavBar = () => {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const [isTawzeaVisible, setIsTawzeaVisible] = useState(false);
  const [isReceivedTawzeaVisible, setIsReceivedTawzeaVisible] = useState(false);

  return (
    <>
      <Menu mode="horizontal">
        <SubMenu key="newcomers" title="المستجدين" disabled={!isLoggedIn}>
          <Menu.Item key="list">
            <Link to="/newcomers">قائمة المستجدين</Link>
          </Menu.Item>
          <Menu.Item key="register">
            <Link to="/newcomers/register">تسجيل</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="export" title="تصدير" disabled={!isLoggedIn}>
          <Menu.Item key="rasd">
            <Link to="/report/rasd">نماذج الرصد</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="tawzea" title="التوزيع">
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
