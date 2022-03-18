import { Button, Form, Input, message } from "antd";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { login } from "../redux/thunks/login";
import "./login.less";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const userLogin = useAppSelector((state) => state.user.details);

  useEffect(() => {
    if (userLogin.error?.trim().length && userLogin.status === "failed") {
      message.error(userLogin.error);
    }
  }, [userLogin]);

  const onFinish = ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    dispatch(login({ username, password }));
  };

  return (
    <div className="login__container">
      <Form layout="vertical" name="login-form" onFinish={onFinish}>
        <Form.Item
          name="username"
          label="اسم المستخدم"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="كلمة المرور"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            تسجيل الدخول
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
