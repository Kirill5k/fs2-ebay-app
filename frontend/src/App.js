import {Routes, Route, Link, useLocation} from "react-router-dom";
import {Layout, Menu, theme} from 'antd';
import Home from './home';
import Stock from './stock';
import './App.css';

const App = () => {
  const {token: {colorBgContainer}} = theme.useToken();
  const location = useLocation();

  return (
      <Layout>
        <Layout.Header className="header">
          <div className="logo"/>
          <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[location.pathname]}
          >
            <Menu.Item key="/" title="Home">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="/stock" title="Stock">
              <Link to="/stock">Stock</Link>
            </Menu.Item>
          </Menu>
        </Layout.Header>
        <Layout.Content className="content">
          <Routes>
            <Route
                exact
                path="/"
                element={<Home backgroundColor={colorBgContainer}/>}
            />
            <Route
                exact
                path="/stock"
                element={<Stock backgroundColor={colorBgContainer}/>}
            />
          </Routes>
        </Layout.Content>
        <Layout.Footer className="footer">
          Ant Design ©2023 Created by Ant UED
        </Layout.Footer>
      </Layout>
  );
}

export default App;