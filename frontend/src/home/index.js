import React from 'react'
import {useSelector} from 'react-redux'
import {Descriptions} from 'antd'
import Container from '../common/components/Container'

const Home = ({backgroundColor}) => {
  const stockStatus = useSelector(state => state.stock.status)
  const stockItems = useSelector(state => state.stock.items)
  const stockRetailers = useSelector(state => state.stock.filters.retailers)
  const dealsStatus = useSelector(state => state.deals.status)
  const dealsItems = useSelector(state => state.deals.todayItems)

  return (
      <Container
          column
          style={{
            padding: '24px 24px',
            background: backgroundColor
          }}>
        {dealsStatus === 'succeeded' && (
            <Descriptions title="Deals">
              <Descriptions.Item label="Total for today">
                {dealsItems.total}
              </Descriptions.Item>
              <Descriptions.Item label="Without exchange price">
                {dealsItems.unrecognized.total}
              </Descriptions.Item>
              <Descriptions.Item label="With buy price smaller than exchange">
                {dealsItems.profitable.total}
              </Descriptions.Item>
            </Descriptions>
        )}
        {stockStatus === 'succeeded' && (
            <Descriptions title="Stock">
              <Descriptions.Item label="Total">
                {stockItems.length}
              </Descriptions.Item>
              <Descriptions.Item label="Tracked retailers">
                {stockRetailers.join(', ')}
              </Descriptions.Item>
            </Descriptions>
        )}
      </Container>
  )
}

export default Home