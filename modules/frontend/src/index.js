import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'
import {App as AntdApp, ConfigProvider, theme} from 'antd'
import reportWebVitals from './reportWebVitals'
import App from './App'
import store from './store'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <React.StrictMode>
      <ConfigProvider
          componentSize="small"
          theme={{
            algorithm: [theme.compactAlgorithm],
            token: {
              fontSize: 14
            }
          }}
      >
        <AntdApp>
          <Provider store={store}>
            <Router>
              <App/>
            </Router>
          </Provider>
        </AntdApp>
      </ConfigProvider>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
