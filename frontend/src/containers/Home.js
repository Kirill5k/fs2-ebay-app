import { Layout, Menu, theme } from "antd";
import React from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined
} from "@ant-design/icons";

const { Content, Sider } = Layout;

const menuItems = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
      const key = String(index + 1);

      return {
        key: `sub${key}`,
        icon: React.createElement(icon),
        label: `subnav ${key}`,

        children: new Array(4).fill(null).map((_, j) => {
          const subKey = index * 4 + j + 1;
          return {
            key: subKey,
            label: `option${subKey}`,
          };
        }),
      };
    },
);

const Home = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
      <Layout style={{ padding: '24px 0', margin: '16px 50px', background: colorBgContainer }}>
        <Sider style={{ background: colorBgContainer }} width={200}>
          <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
              items={menuItems}
          />
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>Home page content</Content>
      </Layout>
  );
}

export default Home;