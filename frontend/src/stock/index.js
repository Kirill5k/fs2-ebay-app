import {Layout} from "antd"
import React, {useEffect} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {getStock, filter} from './slice'
import StockItems from './StockItems'
import StockFilters from "./StockFilters"


const Stock = ({backgroundColor}) => {
  const dispatch = useDispatch()
  const stockStatus = useSelector(state => state.stock.status)
  const selectedItems = useSelector(state => state.stock.selectedItems)
  const filters = useSelector(state => state.stock.filters)
  const selectedFilters = useSelector(state => state.stock.selectedFilters)

  useEffect(() => {
    if (stockStatus === 'idle') {
      dispatch(getStock())
    }
  }, [stockStatus, dispatch])

  return (
      <Layout style={{padding: '24px 0', background: backgroundColor}}>
        <Layout.Sider
            style={{background: backgroundColor, paddingLeft: '24px'}}
            width={200}
        >
          <StockFilters
            options={filters}
            selections={selectedFilters}
            onChange={f => dispatch(filter(f))}
          />
        </Layout.Sider>
        <Layout.Content style={{paddingLeft: '24px', minHeight: 280}}>
          <StockItems
              items={selectedItems}
          />
        </Layout.Content>
      </Layout>
  )
}

export default Stock