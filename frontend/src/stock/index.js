import {Layout, Spin, Alert} from 'antd'
import {useSelector, useDispatch} from 'react-redux'
import {filter, setCurrentPage} from './slice'
import StockItems from './StockItems'
import StockFilters from "./StockFilters"
import Container from '../common/components/Container'

const Stock = ({backgroundColor}) => {
  const dispatch = useDispatch()
  const stockStatus = useSelector(state => state.stock.status)
  const currentPage = useSelector(state => state.stock.currentPage)
  const selectedItems = useSelector(state => state.stock.selectedItems)
  const filters = useSelector(state => state.stock.filters)
  const selectedFilters = useSelector(state => state.stock.selectedFilters)
  const errorMessage = useSelector(state => state.stock.error)

  return (
      <Layout style={{padding: '24px 0', background: backgroundColor}}>
        <Layout.Sider
            style={{background: backgroundColor, paddingLeft: '24px'}}
            width={200}
        >
          <p style={{textAlign: 'center', margin: '5px 0'}}>{selectedItems.length} items</p>
          <StockFilters
              options={filters}
              selections={selectedFilters}
              onChange={f => dispatch(filter(f))}
          />
        </Layout.Sider>
        <Layout.Content style={{paddingLeft: '24px', minHeight: 280}}>
          {stockStatus === 'loading' &&
              <Container>
                <Spin size="large" tip="Loading"/>
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