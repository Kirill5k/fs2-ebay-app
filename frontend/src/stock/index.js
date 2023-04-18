import {Layout, Menu} from "antd"
import React, {useEffect} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined
} from "@ant-design/icons"
import {getStock} from './slice'
import StockItems from './StockItems'

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
)

const Stock = ({backgroundColor}) => {
  const dispatch = useDispatch()
  const stockStatus = useSelector(state => state.stock.status)
  const items = useSelector(state => state.stock.items)
  const filters = useSelector(state => state.stock.filters)

  useEffect(() => {
    if (stockStatus === 'idle') {
      dispatch(getStock())
    }
  }, [stockStatus, dispatch])

  return (
      <Layout style={{padding: '24px 0', background: backgroundColor}}>
        <Layout.Sider style={{background: backgroundColor}} width={200}>
          <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{height: '100%'}}
              items={menuItems}
          />
        </Layout.Sider>
        <Layout.Content style={{padding: '0 24px', minHeight: 280}}>
          <StockItems
              items={items}
          />
        </Layout.Content>
      </Layout>
  )
}

export default Stock