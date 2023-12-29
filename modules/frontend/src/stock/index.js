import {Layout, Spin, Alert} from 'antd'
import {useSelector, useDispatch} from 'react-redux'
import {filter, setCurrentPage} from './slice'
import StockItems from './StockItems'
import StockFilters from "./StockFilters"
import Container from '../common/components/Container'
import './index.css'

const Stock = ({backgroundColor}) => {
  const dispatch = useDispatch()
  const stockStatus = useSelector(state => state.stock.status)
  const currentPage = useSelector(state => state.stock.currentPage)
  const selectedItems = useSelector(state => state.stock.selectedItems)
  const filters = useSelector(state => state.stock.filters)
  const selectedFilters = useSelector(state => state.stock.selectedFilters)
  const errorMessage = useSelector(state => state.stock.error)

  return (
      <Layout className="stock-layout" style={{background: backgroundColor}}>
        <Layout.Sider
            className="stock-layout-slider"
            style={{background: backgroundColor}}
            width={200}
            breakpoint="md"
        >
          <p className="stock-count">{selectedItems.length} items</p>
          <StockFilters
              options={filters}
              selections={selectedFilters}
              onChange={f => dispatch(filter(f))}
          />
        </Layout.Sider>
        <Layout.Content className="stock-layout-content">
          {stockStatus === 'loading' &&
              <Container>
                <Spin size="large" />
              </Container>
          }
          {stockStatus === 'succeeded' &&
              <StockItems
                  items={selectedItems}
                  currentPage={currentPage}
                  onPageChange={p => dispatch(setCurrentPage(p))}
              />
          }
          {stockStatus === 'failed' &&
              <Container>
                <Alert
                    message="Failed to Fetch Current Stock"
                    description={errorMessage}
                    type="error"
                    showIcon
                />
              </Container>
          }
        </Layout.Content>
      </Layout>
  )
}

export default Stock