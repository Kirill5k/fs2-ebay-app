import {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Routes, Route, Link, useLocation} from 'react-router-dom'
import {Layout, Menu, theme} from 'antd'
import Home from './home'
import Stock from './stock'
import {getStock} from './stock/slice'
import Deals from './deals'
import {getTodayDeals} from './deals/slice'
import './App.css'

const App = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const {token: {colorBgContainer}} = theme.useToken()

  const stockStatus = useSelector(state => state.stock.status)
  const dealsStatus = useSelector(state => state.deals.status)

  useEffect(() => {
    if (stockStatus === 'idle') {
      dispatch(getStock())
    }
  }, [stockStatus, dispatch])

  useEffect(() => {
    if (dealsStatus === 'idle') {
      dispatch(getTodayDeals())
    }
  }, [dealsStatus, dispatch])

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
            <Menu.Item key="/deals" title="Deals">
              <Link to="/deals">Deals</Link>
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
            <Route
                exact
                path="/deals"
                element={<Deals backgroundColor={colorBgContainer}/>}
            />
          </Routes>
        </Layout.Content>
        <Layout.Footer
            className="footer"
        >
          Deals Tracker
        </Layout.Footer>
      </Layout>
  )
}

export default App