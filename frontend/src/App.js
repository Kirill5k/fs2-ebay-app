import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Layout, Menu } from 'antd';
import Home from './containers/Home';
import Stock from './containers/Stock';
import './App.css';

const App = () => {
  const location = useLocation();
  return (
        <Layout>
          <Layout.Header className="header">
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]}>
              <Menu.Item key="/" title="Home">
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item key="/stock" title="Stock">
                <Link to="/stock">Stock</Link>
              </Menu.Item>
            </Menu>
          </Layout.Header>
          <Layout.Content style={{ padding: '0 50px' }}>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/stock" element={<Stock />} />
            </Routes>
          </Layout.Content>
          <Layout.Footer style={{ textAlign: 'center' }}>
            Ant Design ©2023 Created by Ant UED
          </Layout.Footer>
        </Layout>
  );
}

export default App;