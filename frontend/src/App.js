import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu } from 'antd';
import Home from './containers/Home';
import Stock from './containers/Stock';
import './App.css';

const { Header, Footer, Content } = Layout;

const App = () => {

  return (
      <Router>
        <Layout>
          <Header className="header">
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
              <Menu.Item key="0" title="Home">
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item key="1" title="Stock">
                <Link to="/stock">Stock</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/stock" element={<Stock />} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
        </Layout>
      </Router>
  );
}

export default App;