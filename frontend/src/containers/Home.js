import { theme } from "antd";
import React from "react";

const Home = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
      <div style={{ padding: '24px 24px', margin: '16px 50px', background: colorBgContainer }}>
        <p>Home page content</p>
      </div>
  );
}

export default Home;