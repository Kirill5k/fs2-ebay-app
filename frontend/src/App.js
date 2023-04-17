import { App as AntdApp, Layout, Menu, ConfigProvider, theme } from 'antd';
import Home from './containers/Home';
import Stock from './containers/Stock';
import './App.css';

const { Header, Footer } = Layout;

const items1 = ['1', '2', '3'].map((key) => ({key, label: `nav ${key}`}));

const App = () => {

  return (
      <ConfigProvider theme={theme.compactAlgorithm} >
        <AntdApp>
          <Layout>
            <Header className="header">
              <div className="logo" />
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={items1} />
            </Header>
            <Home />
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
          </Layout>
        </AntdApp>
      </ConfigProvider>
  );
}

export default App;