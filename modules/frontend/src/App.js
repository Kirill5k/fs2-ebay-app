import {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Routes, Route, Link, useLocation} from 'react-router-dom'
import {Layout, Menu, theme} from 'antd'
import Status from './common/status'
import Home from './home'
import Stock from './stock'
import Deals from './deals'
import {getStock} from './stock/slice'
import {getTodayDeals} from './deals/slice'
import './App.css'


const App = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const {token: {colorBgContainer}} = theme.useToken()

  const stockStatus = useSelector(state => state.stock.status)
  const dealsStatus = useSelector(state => state.deals.status)

  useEffect(() => {
    if (stockStatus === Status.IDLE) {
      dispatch(getStock())
    }
  }, [stockStatus, dispatch])

  useEffect(() => {
    if (dealsStatus === Status.IDLE) {
      dispatch(getTodayDeals())
    }
  }, [dealsStatus, dispatch])

  return (
      <Layout className="app">
        <Layout.Header className="app-header">
          <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={[
                { key: '/', label: <Link to="/">Home</Link> },
                { key: '/stock', label: <Link to="/stock">Stock</Link> },
                { key: '/deals', label: <Link to="/deals">Deals</Link> }
              ]}
          />
        </Layout.Header>
        <Layout.Content className="app-content">
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
            <Route
                exact
                path="/deals"
                element={<Deals backgroundColor={colorBgContainer}/>}
            />
          </Routes>
        </Layout.Content>
        <Layout.Footer className="app-footer">
          Deals Tracker
        </Layout.Footer>
      </Layout>
  )
}

export default App