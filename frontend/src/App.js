import { App as AntdApp, Button, Space, ConfigProvider, theme } from 'antd';
import './App.css';

const MyPage = () => {
  const { message, notification, modal } = AntdApp.useApp();
  const showMessage = () => {
    message.success('Success!');
  };

  const showModal = () => {
    modal.warning({
      title: 'This is a warning message',
      content: 'some messages...some messages...',
    });
  };

  const showNotification = () => {
    notification.info({
      message: `Notification topLeft`,
      description: 'Hello, Ant Design!!',
      placement: 'topLeft',
    });
  };

  return (
      <Space>
        <Button type="primary" onClick={showMessage}>
          Open message
        </Button>
        <Button type="primary" onClick={showModal}>
          Open modal
        </Button>
        <Button type="primary" onClick={showNotification}>
          Open notification
        </Button>
      </Space>
  );
};

function App() {
  return (
      <ConfigProvider theme={theme.compactAlgorithm} >
        <AntdApp>
          <MyPage />
        </AntdApp>
      </ConfigProvider>
  );
}

export default App;
